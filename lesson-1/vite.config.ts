import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import assert from "node:assert";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 8001,
	},
	plugins: [
		tailwindcss(),
		react(),
		rsc({
			entries: {
				client: "./src/framework/entry.browser.tsx",
				ssr: "./src/framework/entry.ssr.tsx",
			},
			serverHandler: false,
			loadModuleDevProxy: true,
		}),
		cloudflare({
			viteEnvironment: {
				name: "rsc",
			},
			persistState: { path: "../.wrangler/state/" },
		}),
		{
			name: "fix-wrangler-files",
			writeBundle(outputOptions) {
				switch (this.environment.name) {
					case "client": {
						const outDir = outputOptions.dir;
						assert(outDir, "client environment directory is not defined");
						const filePath = resolve(outDir, "wrangler.json");
						rmSync(filePath);
						break;
					}
					case "rsc": {
						const outDir = outputOptions.dir;
						assert(outDir, "worker environment directory is not defined");
						const filePath = resolve(outDir, "wrangler.json");
						const contents = JSON.parse(readFileSync(filePath, "utf-8")) as {
							d1_databases: { database_id?: string }[];
						};
						contents.d1_databases.forEach((d1Database) => {
							if (d1Database.database_id === "DATABASE_ID_HERE") {
								delete d1Database["database_id"];
							}
						});
						writeFileSync(filePath, JSON.stringify(contents));
					}
				}
			},
		},
	],
	environments: {
		rsc: {
			build: {
				outDir: "./dist/worker/",
			},
			// optimizeDeps: {
			//   include: ['turbo-stream'],
			// },
		},
		ssr: {
			keepProcessEnv: false,
			build: {
				outDir: "./dist/worker/ssr/",
			},
			resolve: {
				noExternal: true,
			},
		},
	},
});
