import {
  initAnimations,
  initCountUp,
  initHeroWordReveal,
} from "./animations.js";
import { initNav } from "./nav.js";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initAnimations();
  initCountUp();
  initHeroWordReveal();
});
