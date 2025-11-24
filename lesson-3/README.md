# Lesson 3: Introducing MCP (Model Context Protocol)

## Overview

In this lesson, you'll create a Model Context Protocol (MCP) server within your Cloudflare Worker to expose your property search functionality as a tool that can be used by AI assistants. MCP is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). By implementing an MCP server, you'll enable AI assistants like Claude or ChatGPT to directly search your property database, creating a powerful integration between your application and modern AI tools.

Although we don't use their full power here, Durable Objects power the MCP server, so you'll also need to quickly configure them in the project.

## Prerequisites

Ensure you `cd` into this `/lesson-3/` directory and `npm run dev` from here. The application will now be available at [http://localhost:8003/](http://localhost:8003/).

## Steps

### 1. Install dependencies and configure Durable Objects

First, install the required packages for MCP server functionality:

```bash
npm install --save --save-exact agents @modelcontextprotocol/sdk
npm install -D --save-exact @modelcontextprotocol/inspector
```

- `agents`: Cloudflare's package for building AI agents, which includes helpers for MCP server implementation
- `@modelcontextprotocol/sdk`: The official MCP SDK for implementing the protocol
- `@modelcontextprotocol/inspector`: A development tool for testing and debugging your MCP server locally

Next, configure the Durable Objects in your `./wrangler.toml` file:

```toml
[[migrations]]
new_sqlite_classes = ["MyMCP"]
tag = "v1"

[[durable_objects.bindings]]
class_name = "MyMCP"
name = "MCP_OBJECT"
```

After updating your `./wrangler.toml`, regenerate your TypeScript types to get proper type definitions for the Durable Object binding:

```bash
npm run generate-types
```

### 2. Create the MCP server

Create a basic MCP server with a simple example tool. Replace the contents of `./worker/index.ts` with the following code:

```ts
import { handler } from "../src/framework/entry.rsc.tsx";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { WorkerEntrypoint } from "cloudflare:workers";
import { z } from "zod";

export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "React Rental Agency",
		version: "1.0.0",
	});

	init() {
		this.server.registerTool(
			"add",
			{ inputSchema: { a: z.number(), b: z.number() } },
			({ a, b }) => {
				return { content: [{ type: "text", text: String(a + b) }] };
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
```

This configures:

- A `MyMCP` Durable Object class that extends `McpAgent`, which handles the MCP protocol communication
- An MCP server with metadata (name and version)
- A simple `add` tool that demonstrates how to register tools with input schemas using Zod
- A `WorkerEntrypoint` that routes requests:
  - `/sse` and `/sse/message` endpoints for Server-Sent Events transport (legacy)
  - `/mcp` endpoint for Streamable HTTP (modern)
  - All other requests are handled by your existing React application

### 3. Test the MCP server locally with the Inspector

Start the MCP Inspector, a web-based tool for testing your MCP server:

```bash
npx @modelcontextprotocol/inspector
```

This will open a web interface where you can connect to your local MCP server.

In the Inspector:

1. Select **Streamable HTTP** as the **Transport Type**
2. Enter the URL: `http://localhost:8003/mcp` (note: use `http`, not `https`, and use the `/mcp` endpoint)
3. Click **Connect**
4. Once connected, click **List Tools**
5. You should see the `add` tool listed
6. Try calling the tool with some test inputs to verify the MCP server works

### 4. Implement the property search tool

Now replace the simple `add` tool with a real property search tool. In the `init()` method of your `MyMCP` class in `./worker/index.ts`, replace the `add` tool registration with a `searchForProperty` tool:

**Helpful hints:**

- Access the database by importing `getDb` from `../src/db/index.ts` and calling `const db = getDb(this.env)`
- Use the same property search parameters you defined in lesson 2
- Import the schema types from `./src/stores/property-search.ts` to maintain consistency
- Return the results as JSON-stringified text in the MCP `content` response.

### 5. Test the property search tool locally

After implementing the `searchForProperty` tool, test it using the MCP Inspector:

1. If you still have the Inspector running and connected, click **Clear** and **List Tools** again
2. You should now see the `searchForProperty` tool
3. Try calling it with various search parameters, such as:
   - `{"bedrooms": 2, "neighborhood": "Brooklyn"}`
   - `{"minRent": 2000, "maxRent": 3000}`
   - `{"dogsAllowed": true, "garden": true}`
4. Verify that the tool returns property data matching your search criteria

### 6. Build and deploy to production

Once your MCP server is working locally, build and deploy it to Cloudflare:

```bash
npm run build
```

Then deploy:

```bash
npx wrangler deploy
```

After deployment, Wrangler will provide you with a production URL for your application (e.g. `https://react-rental-agency.your-subdomain.workers.dev`).

### 7. Connect your live MCP server to an AI assistant

Now that your MCP server is deployed, you can connect to it from AI assistants that support MCP:

**For ChatGPT:**

1. Open ChatGPT
2. Go to **Settings** > **Apps & Connectors** > **Advanced settings** > Enable **Developer mode**
3. Go back to **Settings** > **Apps & Connectors**
4. Click **Create**
   - **Name**: "React Rental Agency"
   - **MCP Server URL**: Your production URL with the `/mcp` suffix (e.g. `https://react-rental-agency.gregbrimble.workers.dev/mcp`)
   - **Authentication**: No authentication
   - Check "I understand and want to continue" and click "Create"
5. In a ChatGPT conversation, ask it to "Use the 'React Rental Agency' MCP server to search for 2 bedroom apartments in Manhattan between $3k and $4k with AC, a dishwasher, and is dog friendly."

**For the AI Playground:**

1. Open the AI playground: [https://playground.ai.cloudflare.com/](https://playground.ai.cloudflare.com/).
2. Select a model which supports MCP.
3. Enter your production URL with the `/mcp` suffix (e.g. `https://react-rental-agency.gregbrimble.workers.dev/mcp`)
4. Enter a user prompt of "Use the 'React Rental Agency' MCP server to search for 2 bedroom apartments in Manhattan between $3k and $4k with AC, a dishwasher, and is dog friendly."

## Success Criteria

By the end of this lesson, you should have:

- ✅ Durable Objects configured in `./wrangler.toml`
- ✅ An MCP server implemented using `McpAgent` and `McpServer`
- ✅ A `searchForProperty` tool that queries your D1 database
- ✅ Successfully tested your MCP server locally using the MCP Inspector
- ✅ The MCP server deployed to production on Cloudflare
- ✅ Your MCP server connected to an AI assistant (ChatGPT or the AI Playground)
- ✅ The ability for AI assistants to search your property database via natural language

## Troubleshooting

**MCP Inspector won't connect**: Ensure your development server is running (`npm run dev`) and you're using the correct URL with the `/mcp` endpoint (e.g. `http://localhost:8003/mcp`). Make sure you selected "Streamable HTTP" as the transport type, not "STDIO" or "SSE".

**No tools showing in the Inspector**: Verify that your `init()` method is properly registering tools with `this.server.registerTool()`. Check your browser's developer console and the terminal running your dev server for any error messages.

**Durable Object binding not found**: Verify you've added the Durable Object configuration to `./wrangler.toml` and regenerated types with `npm run generate-types`. Restart your development server after making changes to `./wrangler.toml`.

**Cannot connect to production MCP server from AI assistant**: Ensure your Worker is deployed and accessible at the production URL. And double-check that you're using `https` and have added the `/mcp` path suffix.
