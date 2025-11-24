import { handler } from "../src/framework/entry.rsc.tsx";
import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint {
	override async fetch(request: Request) {
		return handler(request, this.env);
	}
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
