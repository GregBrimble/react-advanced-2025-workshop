// @ts-check
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import { fileURLToPath, URL } from "node:url";
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("../.gitignore", import.meta.url));

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
);
