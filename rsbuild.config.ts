import { defineConfig } from "@rsbuild/core";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { pluginPreact } from "@rsbuild/plugin-preact";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginSvgr } from "@rsbuild/plugin-svgr";

export default defineConfig({
    output: {
        assetPrefix: "./",
    },
    dev: {
        hmr: false,
    },
    tools: {
        rspack(_config, { addRules }) {
            addRules([
                {
                    test: /\.ink$/,
                    use: ["./src/engine/build/ink-loader.js"],
                },
            ]);
        },
    },
    plugins: [
        pluginPreact(),
        pluginSass(),
        pluginSvgr(),
        pluginImageCompress(),
    ],
});
