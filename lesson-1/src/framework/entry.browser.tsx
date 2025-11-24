import type { RscPayload } from "./entry.rsc";
import { GlobalErrorBoundary } from "./error-boundary";
import { createRscRenderRequest } from "./request";
import {
	createFromReadableStream,
	createFromFetch,
	setServerCallback,
	createTemporaryReferenceSet,
	encodeReply,
} from "@vitejs/plugin-rsc/browser";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";

async function main() {
	let setPayload: (v: RscPayload) => void;

	const initialPayload = await createFromReadableStream<RscPayload>(
		rscStream as ReadableStream<Uint8Array>,
	);

	function BrowserRoot() {
		const [payload, setPayload_] = React.useState(initialPayload);

		React.useEffect(() => {
			setPayload = (v) => {
				React.startTransition(() => {
					setPayload_(v);
				});
			};
		}, [setPayload_]);

		React.useEffect(() => {
			return listenNavigation(() => {
				void fetchRscPayload();
			});
		}, []);

		return payload.root;
	}

	async function fetchRscPayload() {
		const renderRequest = createRscRenderRequest(window.location.href);
		const payload = await createFromFetch<RscPayload>(fetch(renderRequest));
		setPayload(payload);
	}

	setServerCallback(async (id, args) => {
		const temporaryReferences = createTemporaryReferenceSet();
		const renderRequest = createRscRenderRequest(window.location.href, {
			id,
			body: await encodeReply(args, { temporaryReferences }),
		});
		const payload = await createFromFetch<RscPayload>(fetch(renderRequest), {
			temporaryReferences,
		});
		setPayload(payload);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { ok, data } = payload.returnValue!;
		if (!ok) throw data;
		return data;
	});

	const browserRoot = (
		<React.StrictMode>
			<GlobalErrorBoundary>
				<BrowserRoot />
			</GlobalErrorBoundary>
		</React.StrictMode>
	);
	if ("__NO_HYDRATE" in globalThis) {
		createRoot(document).render(browserRoot);
	} else {
		hydrateRoot(document, browserRoot, {
			formState: initialPayload.formState,
		});
	}

	if (import.meta.hot) {
		import.meta.hot.on("rsc:update", () => {
			void fetchRscPayload();
		});
	}
}

function listenNavigation(onNavigation: () => void) {
	window.addEventListener("popstate", onNavigation);

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const oldPushState = window.history.pushState;
	window.history.pushState = function (...args) {
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		const res = oldPushState.apply(this, args);
		onNavigation();
		return res;
	};

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const oldReplaceState = window.history.replaceState;
	window.history.replaceState = function (...args) {
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		const res = oldReplaceState.apply(this, args);
		onNavigation();
		return res;
	};

	function onClick(e: MouseEvent) {
		const link = (e.target as Element).closest("a");
		if (
			link &&
			link instanceof HTMLAnchorElement &&
			link.href &&
			(!link.target || link.target === "_self") &&
			link.origin === location.origin &&
			!link.hasAttribute("download") &&
			e.button === 0 &&
			!e.metaKey &&
			!e.ctrlKey &&
			!e.altKey &&
			!e.shiftKey &&
			!e.defaultPrevented
		) {
			e.preventDefault();
			history.pushState(null, "", link.href);
		}
	}
	document.addEventListener("click", onClick);

	return () => {
		document.removeEventListener("click", onClick);
		window.removeEventListener("popstate", onNavigation);
		window.history.pushState = oldPushState;
		window.history.replaceState = oldReplaceState;
	};
}

main().catch((e: unknown) => {
	console.error(e);
});
