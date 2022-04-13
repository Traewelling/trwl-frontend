import i18n from "@/i18n";

export default function localizeThousands(number, fixed = 0) {
  return parseFloat(number.toFixed(fixed)).toLocaleString(i18n.getLocale());
}
