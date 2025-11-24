import type { RscPayload } from "./entry.rsc";
import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import React from "react";
import type { ReactFormState } from "react-dom/client";
import { renderToReadableStream } from "react-dom/server.edge";
import { injectRSCPayload } from "rsc-html-stream/server";

export type RenderHTML = typeof renderHTML;

export async function renderHTML(
	rscStream: ReadableStream<Uint8Array>,
	options?: {
		formState?: ReactFormState;
		nonce?: string;
	},
): Promise<{ stream: ReadableStream<Uint8Array>; status?: number }> {
	const [rscStream1, rscStream2] = rscStream.tee();

	let payload: Promise<RscPayload>;
	function SsrRoot() {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		payload ??= createFromReadableStream<RscPayload>(rscStream1);
		return React.use(payload).root;
	}

	const bootstrapScriptContent =
		await import.meta.viteRsc.loadBootstrapScriptContent("index");
	let htmlStream: ReadableStream<Uint8Array>;
	let status: number | undefined;
	try {
		htmlStream = await renderToReadableStream(<SsrRoot />, {
			bootstrapScriptContent,
			nonce: options?.nonce,
			formState: options?.formState,
		});
	} catch {
		status = 500;
		htmlStream = await renderToReadableStream(
			<html>
				<body>
					<noscript>Internal Server Error: SSR failed</noscript>
				</body>
			</html>,
			{
				bootstrapScriptContent: `self.__NO_HYDRATE=1;` + bootstrapScriptContent,
				nonce: options?.nonce,
			},
		);
	}

	const responseStream = htmlStream.pipeThrough(
		injectRSCPayload(rscStream2, {
			nonce: options?.nonce,
		}),
	) as ReadableStream<Uint8Array>;

	return { stream: responseStream, status };
}
