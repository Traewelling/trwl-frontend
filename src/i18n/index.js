import Lang from "lang.js";
import { i18nStrings } from "@/i18n/translations";
import store from "@/store";

const i18n = new Lang({
  messages: i18nStrings,
  locale: store.state.locale,
  fallback: "en",
});

export default i18n;
