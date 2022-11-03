import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SearchContextProvider } from "./context/SearchContext";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import common_en from "./translations/en/common.json";
import common_vn from "./translations/vn/common.json";

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "en", // language to use
  resources: {
    en: {
      common: common_en, // 'common' is our custom namespace
    },
    vn: {
      common: common_vn,
    },
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
