import { ColorMode, init } from "./index";

describe("ColorModeDetector", () => {
  describe("init", () => {
    it("returns a new detector", () => {
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
      }));
      const detector = init();
      expect(detector).toBeDefined();
    });
  });

  describe("currentColorMode", () => {
    it("returns the matching color", () => {
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: jest.fn(),
      }));
      const darkModeDetector = init(ColorMode.Dark);
      expect(darkModeDetector.currentColorMode).toBe(ColorMode.Dark);
      const lightModeDetector = init(ColorMode.Light);
      expect(lightModeDetector.currentColorMode).toBe(ColorMode.Light);
    });

    it("returns them opposite color", () => {
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
      }));
      const darkModeDetector = init(ColorMode.Dark);
      expect(darkModeDetector.currentColorMode).toBe(ColorMode.Light);
      const lightModeDetector = init(ColorMode.Light);
      expect(lightModeDetector.currentColorMode).toBe(ColorMode.Dark);
    });
  });

  describe("subscribe", () => {
    it("notifies about the current color change", () => {
      let callback = () => {};
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
      }));
      const darkModeDetector = init(ColorMode.Dark);
      darkModeDetector.subscribe((colorMode) => {
        expect(colorMode).toBe(ColorMode.Light);
      });
      callback();
      const lightModeDetector = init(ColorMode.Light);
      lightModeDetector.subscribe((colorMode) => {
        expect(colorMode).toBe(ColorMode.Dark);
      });
      callback();
    });

    it("accepts multiple subscribers", () => {
      let callback = () => {};
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
      }));
      const detector = init(ColorMode.Dark);
      detector.subscribe((colorMode) => {
        expect(colorMode).toBe(ColorMode.Light);
      });
      detector.subscribe((colorMode) => {
        expect(colorMode).toBe(ColorMode.Light);
      });
      callback();
    });

    it("won't call the same subscriber twice", () => {
      let callback = () => {};
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
      }));
      const detector = init(ColorMode.Dark);
      const subscriber = jest.fn();
      detector.subscribe(subscriber);
      detector.subscribe(subscriber);
      callback();
      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe("unsubscribe", () => {
    it("stops notifying about the current color change", () => {
      let callback = () => {};
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
      }));
      const detector = init(ColorMode.Dark);
      const subscriber = jest.fn();
      detector.subscribe(subscriber);
      callback();
      detector.unsubscribe(subscriber);
      callback();
      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanup", () => {
    it("stops notifying all subscribers about the current color change", () => {
      let callback = () => {};
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
      }));
      const detector = init(ColorMode.Dark);
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();
      detector.subscribe(subscriber1);
      detector.subscribe(subscriber2);
      callback();
      detector.unsubscribe(subscriber1);
      detector.unsubscribe(subscriber2);
      callback();
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);
    });

    it("stops listening to the change event", () => {
      let callback = () => {};
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
      }));
      const detector = init(ColorMode.Dark);
      const subscriber = jest.fn();
      detector.subscribe(subscriber);
      callback();
      detector.unsubscribe(subscriber);
      callback();
      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
