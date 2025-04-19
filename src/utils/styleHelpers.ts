// src/utils/styleHelpers.ts

/**
 * Adds "px" to a number, or returns "auto" if the number is undefined.
 */
export const addPx = (num?: number): string =>
  num !== undefined ? `${num}px` : "auto";

/**
 * Converts a style object with string or number values into a string that
 * can be inserted into a JSX inline style block.
 *
 * This function now accepts values as string | number | undefined.
 */
export const generateStyleString = (
  styleObj: { [key: string]: string | number | undefined }
): string => {
  return Object.entries(styleObj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(", ");
};
