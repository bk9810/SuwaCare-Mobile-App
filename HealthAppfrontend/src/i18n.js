import i18n from "i18next";
import { initReactI18next } from "react-i18next";


const resources = {
  en: {
    translation: {
      select_language: "Select your language",
      patient_login: "Patient Login",
      email: "Email",
      password: "Password",
      login: "Login",
      register: "Don’t have an account? Register",
    },
  },
  si: {
    translation: {
      select_language: "භාෂාව තෝරන්න",
      patient_login: "රෝගියා ලොග් වන්න",
      email: "ඊමේල්",
      password: "මුරපදය",
      login: "ඇතුල් වන්න",
      register: "ගිණුමක් නැද්ද? ලියාපදිංචි වන්න",
    },
  },
  ta: {
    translation: {
      select_language: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
      patient_login: "நோயாளர் உள்நுழைவு",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      login: "உள்நுழைக",
      register: "கணக்கு இல்லையா? பதிவு செய்யவும்",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
