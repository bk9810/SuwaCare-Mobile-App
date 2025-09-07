//i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import si from "./locales/si.json";
import ta from "./locales/ta.json";

export const supportedLngs = ["en", "si", "ta"];

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      si: { translation: si },
      ta: { translation: ta },
    },
    lng: "en",             // default
    fallbackLng: "en",
    supportedLngs,
    compatibilityJSON: "v3",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem("app_lng");
    if (saved && supportedLngs.includes(saved)) {
      await i18n.changeLanguage(saved);
    }
  } catch {}
}

export async function setAppLanguage(lng) {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem("app_lng", lng);
}

export default i18n;
