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

// function getLogoSvg() {
//   const logoSvg = `
//     <svg
//       t="1784386556396"
//       class="logo"
//       viewBox="0 0 1024 1024"
//       version="1.1"
//       xmlns="http://www.w3.org/2000/svg"
//       p-id="4777"
//       width="100%"
//       height="100%"
//     >
//       <path d="M16.40220445 95.07195222L512 950.43811556 1007.59779555 99.19829334v-4.12634112H814.92195555L514.91271111 610.4276389 216.1656411 95.12049778z" fill="#42B883" p-id="4778"></path>
//       <path d="M216.21418667 95.07195222l298.64997888 515.40423111L814.92195555 95.07195222h-180.73372444L516.07779555 297.9422811 398.40426667 95.02340779z" fill="#35495E" p-id="4779"></path>
//     </svg>
//   `;

//   return logoSvg;
// }
