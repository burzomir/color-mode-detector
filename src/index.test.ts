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
        removeEventListener: jest.fn(),
      }));
      const detector = init(ColorMode.Dark);
      const subscriber = jest.fn();
      detector.subscribe(subscriber);
      callback();
      detector.unsubscribe(subscriber);
      callback();
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("removes event listener from matchMedia if there are no more subscribers", () => {
      let callback = () => {};
      const removeEventListener = jest.fn();
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn().mockImplementation((_, cb) => {
          callback = cb;
        }),
        removeEventListener,
      }));
      const detector = init(ColorMode.Dark);
      const subscriber = jest.fn();
      detector.subscribe(subscriber);
      callback();
      detector.unsubscribe(subscriber);
      callback();
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(removeEventListener).toHaveBeenCalledTimes(1);
    });

    it("adds event listener for matchMedia again", () => {
      const addEventListener = jest.fn();
      const removeEventListener = jest.fn();
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener,
        removeEventListener,
      }));
      const detector = init(ColorMode.Dark);
      const subscriber = jest.fn();
      detector.subscribe(subscriber);
      detector.unsubscribe(subscriber);
      detector.subscribe(subscriber);
      detector.unsubscribe(subscriber);
      expect(addEventListener).toHaveBeenCalledTimes(2);
      expect(removeEventListener).toHaveBeenCalledTimes(2);
    });
  });
});
