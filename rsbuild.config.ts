import { defineConfig } from "@rsbuild/core";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { pluginPreact } from "@rsbuild/plugin-preact";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginSvgr } from "@rsbuild/plugin-svgr";

export default defineConfig({
    output: {
        assetPrefix: "./",
    },
    plugins: [
        pluginPreact(),
        pluginSass(),
        pluginSvgr(),
        pluginImageCompress(),
    ],
});
