import { computed, effectScope, onScopeDispose, ref, toRefs, watch, nextTick } from "vue";
import type { Ref } from "vue";
import { useDateFormat, useEventListener, useNow } from "@vueuse/core";
import { defineStore } from "pinia";
import { getPaletteColorByNumber } from "@sa/color";
import { localStg } from "@/utils/storage";
import { SetupStoreId } from "@/enum";
import { useAuthStore } from "../auth";
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getNaiveTheme,
  initThemeSettings,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode
} from "./shared";

/** Theme store */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope();
  const authStore = useAuthStore();

  /** Theme settings */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings());

  /** Optional NaiveUI theme overrides from preset */
  const naiveThemeOverrides: Ref<App.Theme.NaiveUIThemeOverride | undefined> = ref(undefined);

  /** Watermark time instance with controls */
  const { now: watermarkTime, pause: pauseWatermarkTime, resume: resumeWatermarkTime } = useNow({ controls: true });

  /** Dark mode */
  const darkMode = computed(() => {
    return settings.value.themeScheme === "dark";
  });

  /** grayscale mode */
  const grayscaleMode = computed(() => settings.value.grayscale);

  /** colourWeakness mode */
  const colourWeaknessMode = computed(() => settings.value.colourWeakness);

  /** Theme colors */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value;
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info
    };
    return colors;
  });

  /** Naive theme */
  const naiveTheme = computed(() => getNaiveTheme(themeColors.value, settings.value, naiveThemeOverrides.value));

  /**
   * Settings json
   *
   * It is for copy settings
   */
  const settingsJson = computed(() => JSON.stringify(settings.value));

  /** Watermark time date formatter */
  const formattedWatermarkTime = computed(() => {
    const { watermark } = settings.value;
    const date = useDateFormat(watermarkTime, watermark.timeFormat);
    return date.value;
  });

  /** Watermark content */
  const watermarkContent = computed(() => {
    const { watermark } = settings.value;

    if (watermark.enableUserName && authStore.userInfo.userName) {
      return authStore.userInfo.userName;
    }

    if (watermark.enableTime) {
      return formattedWatermarkTime.value;
    }

    return watermark.text;
  });

  /** Reset store */
  function resetStore() {
    const themeStore = useThemeStore();

    themeStore.$reset();
  }

  /**
   * Set theme scheme
   *
   * @param themeScheme
   * @param [event] Mouse event for view transition origin
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme, event?: MouseEvent) {
    const isAppearanceTransition =
      // @ts-expect-error - startViewTransition is not available in the current DOM lib target
      document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isAppearanceTransition || !event) {
      settings.value.themeScheme = themeScheme;
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(async () => {
      settings.value.themeScheme = themeScheme;
      await nextTick();
    });
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      const animate = document.documentElement.animate(
        {
          clipPath: settings.value.themeScheme === "dark" ? [...clipPath].toReversed() : clipPath
        },
        {
          duration: 450,
          easing: "ease-in",
          pseudoElement:
            settings.value.themeScheme === "dark" ? "::view-transition-old(root)" : "::view-transition-new(root)"
        }
      );
      animate.onfinish = () => {
        transition.skipTransition();
      };
    });
  }

  /**
   * Set grayscale value
   *
   * @param isGrayscale
   */
  function setGrayscale(isGrayscale: boolean) {
    settings.value.grayscale = isGrayscale;
  }

  /**
   * Set colourWeakness value
   *
   * @param isColourWeakness
   */
  function setColourWeakness(isColourWeakness: boolean) {
    settings.value.colourWeakness = isColourWeakness;
  }

  /** Toggle theme scheme */
  function toggleThemeScheme(event?: MouseEvent) {
    const themeSchemes: UnionKey.ThemeScheme[] = ["light", "dark"];
    const index = themeSchemes.findIndex(item => item === settings.value.themeScheme);
    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1;
    const nextThemeScheme = themeSchemes[nextIndex];
    setThemeScheme(nextThemeScheme, event);
  }

  /**
   * Update theme colors
   *
   * @param key Theme color key
   * @param color Theme color
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    let colorValue = color;

    if (settings.value.recommendColor) {
      // get a color palette by provided color and color name, and use the suitable color

      colorValue = getPaletteColorByNumber(color, 500, true);
    }

    if (key === "primary") {
      settings.value.themeColor = colorValue;
    } else {
      settings.value.otherColor[key] = colorValue;
    }
  }

  /**
   * Set theme layout
   *
   * @param mode Theme layout mode
   */
  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    settings.value.layout.mode = mode;
  }

  /** Setup theme vars to global */
  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(
      themeColors.value,
      settings.value.tokens,
      settings.value.recommendColor
    );
    addThemeVarsToGlobal(themeTokens, darkThemeTokens);
  }

  /**
   * Set watermark enable user name
   *
   * @param enable Whether to enable user name watermark
   */
  function setWatermarkEnableUserName(enable: boolean) {
    settings.value.watermark.enableUserName = enable;

    if (enable) {
      settings.value.watermark.enableTime = false;
    }
  }

  /**
   * Set watermark enable time
   *
   * @param enable Whether to enable time watermark
   */
  function setWatermarkEnableTime(enable: boolean) {
    settings.value.watermark.enableTime = enable;

    if (enable) {
      settings.value.watermark.enableUserName = false;
    }
  }

  /**
   * Set NaiveUI theme overrides
   *
   * @param overrides NaiveUI theme overrides or undefined to clear
   */
  function setNaiveThemeOverrides(overrides?: App.Theme.NaiveUIThemeOverride) {
    naiveThemeOverrides.value = overrides;
  }

  /** Only run timer when watermark is visible and time display is enabled */
  function updateWatermarkTimer() {
    const { watermark } = settings.value;
    const shouldRunTimer = watermark.visible && watermark.enableTime;

    if (shouldRunTimer) {
      resumeWatermarkTime();
    } else {
      pauseWatermarkTime();
    }
  }

  /** Cache theme settings */
  function cacheThemeSettings() {
    const isProd = import.meta.env.PROD;

    if (!isProd) return;

    localStg.set("themeSettings", settings.value);
  }

  // cache theme settings when page is closed or refreshed
  useEventListener(window, "beforeunload", () => {
    cacheThemeSettings();
  });

  // watch store
  scope.run(() => {
    // watch dark mode
    watch(
      darkMode,
      val => {
        toggleCssDarkMode(val);
        localStg.set("darkMode", val);
      },
      { immediate: true }
    );

    watch(
      [grayscaleMode, colourWeaknessMode],
      val => {
        toggleAuxiliaryColorModes(val[0], val[1]);
      },
      { immediate: true }
    );

    // themeColors change, update css vars and storage theme color
    watch(
      themeColors,
      val => {
        setupThemeVarsToGlobal();
        localStg.set("themeColor", val.primary);
      },
      { immediate: true }
    );

    // watch watermark settings to control timer
    watch(
      () => [settings.value.watermark.visible, settings.value.watermark.enableTime],
      () => {
        updateWatermarkTimer();
      },
      { immediate: true }
    );
  });

  /** On scope dispose */
  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...toRefs(settings.value),
    darkMode,
    themeColors,
    naiveTheme,
    settingsJson,
    watermarkContent,
    setGrayscale,
    setColourWeakness,
    resetStore,
    setThemeScheme,
    toggleThemeScheme,
    updateThemeColors,
    setThemeLayout,
    setWatermarkEnableUserName,
    setWatermarkEnableTime,
    setNaiveThemeOverrides
  };
});
