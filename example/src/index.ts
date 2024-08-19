import { init, ColorMode } from "@burzomir/color-mode-detector";
import "./style.css";

const container = document.getElementById("app");
const detector = init();
detector.subscribe(handleColorChange);
handleColorChange();

function handleColorChange() {
  if (!container) {
    return;
  }
  container.classList.toggle(
    ColorMode.Dark,
    detector.currentColorMode === ColorMode.Dark,
  );
  container.classList.toggle(
    ColorMode.Light,
    detector.currentColorMode === ColorMode.Light,
  );
  const header = container.querySelector<HTMLHeadingElement>("h1");
  if (!header) {
    return;
  }
  header.innerText = detector.currentColorMode;
}
