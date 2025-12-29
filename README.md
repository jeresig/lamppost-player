# Lamp Post Ink Player

This is a web player for running [Ink](https://github.com/inkle/ink) stories created by [Lamp Post Projects](https://lamppostprojects.com/).

> [!WARNING]
> This software still under active development, please use with caution as it's likely to change.

## Getting Started

Requirements: [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

* Clone the [https://github.com/jeresig/lamppost-player](https://github.com/jeresig/lamppost-player) repo.
* Inside your terminal, go into the directory in which you cloned the repo.
* Run `pnpm install`.
* Run `pnpm dev` to see the result and confirm that things are working correctly.
* Export your Story JSON file and put it into `src/story`. You can do this by selecting "Export to JSON..." in the Inky editor.
* Update the settings in `src/story/settings.ts` to point to your story file, and update the game name to describe your game.
* Update the About page in `src/story/About.tsx` to include some information about your game (or remove that screen entirely by updating `src/story/screens.ts`).
* Add any custom CSS styling inside the `src/story/styles.scss` file.
* Run `pnpm build` to create the final HTML/JS/CSS/Image files needed to display the game. The files will be output to the `dist/` directory. You can then bundle them or upload them to the location of your choice.

## Custom Features

The Lamp Post Ink Player includes a number of custom tags and markup that be used to show special features exclusive to this player.

### Header Images

Images to be used in the header for a knot. Can be configured by setting the "Image:Name" tag in your Ink story. The "Name" value will be used to match one of the images defined in the `src/story/settings.ts` file.

You'll probably want to specify "Image" as a sticky tag, as well, in order to simplify the display of the header image. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# Image:Foyer
```

In `src/story/settings.ts`:

```
import Foyer from "./assets/images/foyer.jpg";
...
stickyTags: ["Image"],
widgets: {
    headerImage: {
        Foyer: Foyer,
    },
},
```

### Locations

Display a textual location at teh top of a knot. Can be configured by setting the "Location:Name" tag in your Ink story.

You'll probably want to specify "Location" as a sticky tag, as well, in order to simplify the display of the location across multiple knots. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# Location:Foyer
```

To make locations sticky, in `src/story/settings.ts`:

```
stickyTags: ["Location"],
```

### Portraits

Portraits to be displayed in a knot. Can be configured by setting the "Portrait:Name" tag in your Ink story. The "Name" value will be used to match one of the portraits defined in the `src/story/settings.ts` file. If a large image is specified then it'll be shown in a modal when the portrait is clicked.

You'll probably want to specify "Portrait" as a sticky tag, as well, in order to simplify the display of portraits during a long conversation. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# Portrait:Rion
```

In `src/story/settings.ts`:

```
import Rion from "./assets/images/rion.jpg";
import RionLarge from "./assets/images/rion large.jpg";
...
stickyTags: ["Portrait"],
widgets: {
    portraits: {
        Rion: {
            small: Rion,
            large: RionLarge,
        },
    },
},
```

### Inline Images

Images to be displayed inline in a knot. Can be configured by using a special `!widget:image` syntax in your Ink story. The "Name" value will be used to match one of the images defined in the `src/story/settings.ts` file. If a large image is specified then it'll be shown in a modal when the portrait is clicked.

The alt text is optional, and will be used as the alt text for the image (but should be provided for accessibility reasons).

The align property is optional, and can be "left", "right", or "center". The default is "center". Left or right will float the image and allow the text to flow around it.

For example, in your Ink file, add the following text:

```
!widget:image name="Map" alt="A map of the world..." align="left"
```

In `src/story/settings.ts`:

```
import MapImage from "./assets/images/map.jpg";
import MapImageLarge from "./assets/images/map large.jpg";
...
widgets: {
    images: {
        Map: {
            small: MapImage,
            large: MapImageLarge,
        },
    },
},
```

### Text Input

A text input to be displayed inside a choice. Can be configured by using a special `!widget:text-input` syntax in your Ink story.

The text input widget has the following props:

* `name` (required): This corresponds with the Ink variable that the result will be written to whenever the user submits their answer.
* `label` (required): The label to set on the input, to help inform the user about what is being asked of them.
* `input-label` (optional, default: "Submit"): The label to set on the submit button.

For example, in your Ink file, add the following text as one of your choices:

```
!widget:text-input name="name-var" label="Your Name" submit-label="Set Name"
```

### Sticky Tags

The Lamp Post Ink Player has the ability to "persist" tags defined in knots to future knots. This can help to simplify some of the configuration of some tags used by features (such as Location, ImageHeader, etc.). If you wish to turn "off" a persisted tag then you can set the tag to be "None", like so: `# Location:None`.

To make a tag sticky, in `src/story/settings.ts`:

```
stickyTags: ["Location"],
```

### Achievements

To add an achievement, in `src/story/settings.ts`:

```
widgets: {
    achievements: {
        "all-endings": {
            icon: MapImage,
            title: "All Endings",
            description: "Complete all the endings of the game.",
            hidden: true,
            showHiddenButtonText: "View Locked Achievement",
        },
    },
},
```

The properties for configuring an achievement are as follows:

* `icon`: Can be a path to an image or a React component which renders an image.
* `title`: The name of the achievement to display to the user.
* `description` (optional): The description of the achievement to display to the user.
* `hidden` (optional, defaults to `false`): Should this achievement be hidden on the achievements page?
* `showHiddenButtonText` (optional): If the achievement is `hidden` then a button will be overlaid on it, with this text in it, which a user can click to reveal the hidden achievement.

And then in your `src/story/screens.ts` file you'll want to add an Achievements page:

```
{
    id: "achievements",
    title: "Achievements",
    component: "achievements",
},
```

## Credits and License

* The prototype version of this software was created by Nell Shaw Cohen for use in the games [The Secrets of Sylvan Gardens](https://lamppostprojects.com/the-secrets-of-sylvan-gardens), [Fantasy Opera: Mischief at the Masquerade](https://lamppostprojects.com/fantasy-opera), and [The Path of Totality](https://lamppostprojects.com/the-path-of-totality).
* This version of the web player was created by John Resig.

This software is released under an MIT license.
