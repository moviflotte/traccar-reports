import translations from "./translations";

let locale = typeof navigator !== "undefined" && navigator.language.substring(0, 2)

export const t = ( key ) => (translations[locale] && translations[locale][key]) || key

export const setLocale = (l) => (locale=l)
