export enum ColorMode {
  Light = "light",
  Dark = "dark",
}

export interface ColorModeDetector {
  currentColorMode: ColorMode;
  subscribe(callback: (colorMode: ColorMode) => void): void;
  unsubscribe(callback: (colorMode: ColorMode) => void): void;
}

export function init(colorMode = ColorMode.Dark): ColorModeDetector {
  return new ColorModeDetectorImpl(colorMode);
}

function opposite(colorMode: ColorMode): ColorMode {
  switch (colorMode) {
    case ColorMode.Dark:
      return ColorMode.Light;
    case ColorMode.Light:
      return ColorMode.Dark;
  }
}

class ColorModeDetectorImpl implements ColorModeDetector {
  private colorMode: ColorMode;
  private matcher: MediaQueryList;
  private subscribers = new Set<(colorMode: ColorMode) => void>();

  constructor(colorMode = ColorMode.Dark) {
    this.colorMode = colorMode;
    const query = `(prefers-color-scheme: ${colorMode})`;
    this.matcher = window.matchMedia(query);
  }

  private changeListener = () => {
    for (const subscriber of this.subscribers.values()) {
      subscriber(this.currentColorMode);
    }
  };

  static init(colorMode = ColorMode.Dark) {
    return new ColorModeDetectorImpl(colorMode);
  }

  get currentColorMode() {
    if (this.matcher.matches) {
      return this.colorMode;
    } else {
      return opposite(this.colorMode);
    }
  }

  subscribe(callback: (colorMode: ColorMode) => void) {
    if (this.subscribers.size === 0) {
      this.matcher.addEventListener("change", this.changeListener);
    }
    this.subscribers.add(callback);
  }

  unsubscribe(callback: (colorMode: ColorMode) => void) {
    this.subscribers.delete(callback);
    if (this.subscribers.size === 0) {
      this.matcher.removeEventListener("change", this.changeListener);
    }
  }
}
