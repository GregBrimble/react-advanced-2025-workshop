import { getDb } from "../src/db/index.ts";
import { handler } from "../src/framework/entry.rsc.tsx";
import {
	propertySearch,
	propertySearchParamsSchema,
} from "../src/stores/property-search.ts";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { WorkerEntrypoint } from "cloudflare:workers";

export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "React Rental Agency",
		version: "1.0.0",
	});

	init() {
		this.server.registerTool(
			"searchForProperty",
			{
				inputSchema: propertySearchParamsSchema.shape,
			},
			async (searchParams) => {
				const db = getDb(this.env);
				const properties = await propertySearch(db, searchParams);
				return {
					content: [
						{
							type: "text",
							text:
								"Here are the properties we found:\n" +
								JSON.stringify(properties),
						},
					],
				};
			},
		);

		return Promise.resolve();
	}
}

export default class extends WorkerEntrypoint {
	override async fetch(request: Request) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, this.env, this.ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, this.env, this.ctx);
		}

		return handler(request, this.env);
	}
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
