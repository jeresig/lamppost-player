import { NuqsAdapter } from "nuqs/adapters/react";
import { render } from "preact";

import App from "./engine/app/App";
import { registerWidget } from "./engine/shared/widgets";
import { headerImageWidget } from "./engine/widgets/HeaderImage";
import { imageWidget } from "./engine/widgets/Image";
import { locationWidget } from "./engine/widgets/Location";
import { portraitWidget } from "./engine/widgets/Portrait";
import { textInputWidget } from "./engine/widgets/TextInput";
import settings from "./story/settings";

import "./engine/app/styles.scss";
import "./story/styles.scss";

// Enable the theme
let defaultTheme = settings.defaultTheme || "light";
if (settings.enableDarkMode) {
    defaultTheme = window.localStorage.getItem(`${settings.gameName}-theme`) ||
        (window.matchMedia?.("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light");
}
document.documentElement.setAttribute("data-bs-theme", defaultTheme);

// Register widgets
registerWidget(imageWidget);
registerWidget(textInputWidget);
registerWidget(headerImageWidget);
registerWidget(locationWidget);
registerWidget(portraitWidget);

const root = document.getElementById("root");

if (root) {
    render(
        <NuqsAdapter>
            <App />
        </NuqsAdapter>,
        root,
    );
}
