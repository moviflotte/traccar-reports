import translations from "./translations";

const locale = navigator.language.substring(0, 2)

export const t = ( key ) => (translations[locale] && translations[locale][key]) || key
