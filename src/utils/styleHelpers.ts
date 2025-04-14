// src/utils/styleHelpers.ts
export const addPx = (num: number | undefined): string =>
  num !== undefined ? `${num}px` : "auto";

export const generateStyleString = (styleObj: {
  [key: string]: string | undefined;
}): string => {
  return Object.entries(styleObj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(", ");
};
