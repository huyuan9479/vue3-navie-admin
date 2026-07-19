// @unocss-include
import { getColorPalette, getRgb } from "@sa/color";
import { DARK_CLASS } from "@/constants/app";
import { localStg } from "@/utils/storage";
import { toggleHtmlClass } from "@/utils/common";
import { $t } from "@/locales";

export function setupLoading() {
  const themeColor = localStg.get("themeColor") || "#1677ff";
  const darkMode = localStg.get("darkMode") || false;
  const palette = getColorPalette(themeColor);

  const { r, g, b } = getRgb(themeColor);

  const primaryColor = `--primary-color: ${r} ${g} ${b}`;

  const svgCssVars = Array.from(palette.entries())
    .map(([key, value]) => `--logo-color-${key}: ${value}`)
    .join(";");

  const cssVars = `${primaryColor}; ${svgCssVars}`;

  if (darkMode) {
    toggleHtmlClass(DARK_CLASS).add();
  }

  const loadingClasses = [
    "left-0 top-0",
    "left-0 bottom-0 animate-delay-500",
    "right-0 top-0 animate-delay-1000",
    "right-0 bottom-0 animate-delay-1500",
  ];

  const dot = loadingClasses
    .map((item) => {
      return `<div class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse ${item}"></div>`;
    })
    .join("\n");

  const loading = `
  <div class="fixed-center flex-col bg-layout" style="${cssVars}">
    <div class="w-100px h-100px">
      ${getLogoSvg()}
    </div>
    <div class="w-50px h-50px my-36px">
      <div class="relative h-full animate-spin">
        ${dot}
      </div>
    </div>
    <h2 class="text-24px font-500 text-primary">${$t("system.title")}</h2>
  </div>`;

  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = loading;
  }
}

function getLogoSvg() {
  const logoSvg = `
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M508.8 0L70.4 252.8v505.6l438.4 252.8 438.4-252.8V252.8L508.8 0z m96 160l-99.2 54.4-96-51.2 99.2-57.6 96 54.4zM163.2 588.8l67.2 38.4v118.4l-67.2-38.4v-118.4z m160 211.2V419.2l86.4-44.8-96-51.2-80 44.8v156.8L163.2 480V307.2l153.6-89.6 371.2 201.6v44.8l92.8-57.6v-41.6l-176-96 96-54.4 156.8 92.8v160l-348.8 214.4-92.8-54.4v105.6l92.8 54.4 176-108.8v128l-176 102.4L323.2 800z m454.4-48v-131.2l76.8-48V704l-76.8 48z" fill="rgb(var(--primary-color))" />
      <path d="M595.2 540.8v-99.2l-86.4-48-86.4 48v99.2l86.4 48z" fill="rgb(var(--primary-color))" />
    </svg>
  `;

  return logoSvg;
}
