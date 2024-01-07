import url from "node:url";
import path from "node:path";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import pkg from "./package.json" assert { type: "json" };

// @see https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const rootDir = path.resolve(__dirname, "..");

export default [
  {
    input: "src/index.mjs",
    plugins: [resolve(), commonjs()],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
      {
        name: "howLongUntilLunch",
        file: pkg.browser,
        format: "umd",
      },
    ],
  },
];
