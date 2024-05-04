/**
 * Escapes the '.
 * @param value A string to sanitize.
 * @returns The same string, but with ' escaped with '\'.
 */
export const escapeQuote = (value: string): string | null => {
  const sanitized = value.replace(new RegExp("'", 'g'), "\\'");
  return sanitized !== '' ? sanitized : null;
};
