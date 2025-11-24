/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable prefer-spread */
import { envStorage, requestStorage } from "../context.ts";
import { Root } from "../root.tsx";
import { parseRenderRequest } from "./request.tsx";
import {
	renderToReadableStream,
	createTemporaryReferenceSet,
	decodeReply,
	loadServerAction,
	decodeAction,
	decodeFormState,
} from "@vitejs/plugin-rsc/rsc";
import type { ReactFormState } from "react-dom/client";

export type RscPayload = {
	root: React.ReactNode;
	returnValue?: { ok: boolean; data: unknown };
	formState?: ReactFormState;
};

export async function handler(request: Request, env: Env): Promise<Response> {
	const renderRequest = parseRenderRequest(request);

	const evaluate = async () => {
		let returnValue: RscPayload["returnValue"] | undefined;
		let formState: ReactFormState | undefined;
		let temporaryReferences: unknown;
		let actionStatus: number | undefined;
		if (renderRequest.isAction) {
			if (renderRequest.actionId) {
				const contentType = request.headers.get("content-type");
				const body = contentType?.startsWith("multipart/form-data")
					? await request.formData()
					: await request.text();
				temporaryReferences = createTemporaryReferenceSet();
				const args = await decodeReply(body, { temporaryReferences });
				const action = await loadServerAction(renderRequest.actionId);
				try {
					const data = (await action.apply(null, args)) as unknown;
					returnValue = { ok: true, data };
				} catch (e) {
					returnValue = { ok: false, data: e };
					actionStatus = 500;
				}
			} else {
				const formData = await request.formData();
				const decodedAction = await decodeAction(formData);
				try {
					const result = await decodedAction();
					formState = await decodeFormState(result, formData);
				} catch {
					return new Response("Internal Server Error: server action failed", {
						status: 500,
					});
				}
			}
		}

		const rscPayload: RscPayload = {
			root: <Root />,
			formState,
			returnValue,
		};
		const rscOptions = { temporaryReferences };
		const rscStream = renderToReadableStream<RscPayload>(
			rscPayload,
			rscOptions,
		);

		if (renderRequest.isRsc) {
			return new Response(rscStream, {
				status: actionStatus,
				headers: {
					"content-type": "text/x-component;charset=utf-8",
				},
			});
		}

		const { renderHTML } = await import.meta.viteRsc.loadModule<
			typeof import("./entry.ssr.tsx")
		>("ssr", "index");
		const ssrResult = await renderHTML(rscStream, {
			formState,
		});

		return new Response(ssrResult.stream, {
			status: ssrResult.status,
			headers: {
				"Content-type": "text/html",
			},
		});
	};

	const result = envStorage.run(env, () =>
		requestStorage.run(renderRequest.request, evaluate),
	);
	return result;
}
