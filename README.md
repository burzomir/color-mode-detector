# Color Mode Detector

Welcome to **Color Mode Detector** – a straightforward, no-frills library for detecting and managing color modes in your web applications. If you need a simple, reliable solution for handling light and dark modes without any unnecessary overhead, this library is for you.

## Overview

**Color Mode Detector** provides a minimalistic API to help you detect the current color mode (light or dark) and react to changes. It's designed to be easy to use and integrate into any web project, giving you just what you need without any extra fluff.

## Installation

You can install the library via npm or yarn:

```bash
npm install color-mode-detector
```

or

```bash
yarn add color-mode-detector
```

## Getting Started

### Step 1: Import and Initialize

To get started, import the library and initialize the detector. You can specify the default color mode (light or dark) when initializing:

```typescript
import { init, ColorMode } from "color-mode-detector";

const colorModeDetector = init();
```

### Step 2: Subscribe to Color Mode Changes

Subscribe to color mode changes so you can update your application whenever the mode changes:

```typescript
colorModeDetector.subscribe((colorMode: ColorMode) => {
  switch (colorMode) {
    case ColorMode.Dark:
      console.log("Color mode changed to dark");
      break;
    case ColorMode.Light:
      console.log("Color mode changed to light");
      break;
  }
});
```

### Step 3: Unsubscribe When Done

Unsubscribe from the detector when you no longer need to listen to changes:

```typescript
colorModeDetector.unsubscribe(yourCallbackFunction);
```

### Step 4: Cleanup

When your component or application is being unmounted, clean up the detector to avoid memory leaks:

```typescript
colorModeDetector.cleanup();
```

## Example Usage

Here’s a basic example of how you might use **Color Mode Detector** in a React component:

```javascript
import { init, ColorMode } from "@burzomir/color-mode-detector";

// Initialize the detector
const colorModeDetector = init();

// Define a callback function to handle color mode changes
const handleColorModeChange = (colorMode) => {
  console.log(`Color mode is now: ${colorMode}`);
  document.body.style.backgroundColor = colorMode === "dark" ? "#333" : "#FFF";
  document.getElementById("title").style.color =
    colorMode === "dark" ? "#FFF" : "#000";
};

// Subscribe to color mode changes
colorModeDetector.subscribe(handleColorModeChange);

// Cleanup when not needed anymore
window.addEventListener("beforeunload", () => {
  colorModeDetector.cleanup();
});
```

## Contributing

If you run into any issues or have ideas for improvements, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/burzomir/color-mode-detector).

This library is designed to be simple and efficient – just like your code. If you need a reliable way to manage color modes, give it a try.

## Change log

- 2.0.0

  - Removed cleanup method

    Cleanup is handled automatically when all subscribers are removed

- 1.0.1
  - Project reorganization
- 1.0.0
  - Initial release
