import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import config from "./config";
let resources = {};
config.supportedLanguages.forEach((element) => {
    resources[element] = {
        translations: require("../locale/" + element + ".json"),
    };
});
i18n.use(initReactI18next).init({
    fallbackLng: config.defaultLanguage,
    lng: config.defaultLanguage,
    resources,
    ns: ["translations"],
    defaultNS: "translations",
});

i18n.languages = config.supportedLanguages;

export default i18n;
