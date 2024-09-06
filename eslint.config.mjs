// @ts-check

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

// unnecessary async to test linting
export async function unnecessarilyAsync() {
    return true;
}

export default tseslint.config(
    { ignores: ["node_modules", "dist"] },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                project: "tsconfig.json",
            },
        },
    },
    prettier,
);
