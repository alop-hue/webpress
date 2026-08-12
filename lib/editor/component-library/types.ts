/**
 * Shared types for the pre-made component library.
 */
export interface LibraryComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

/** Compact builder so each component stays one object literal. */
export function c(
  id: string,
  name: string,
  category: string,
  description: string,
  html: string,
  css: string,
  js = ""
): LibraryComponent {
  return { id, name, category, description, html, css, js };
}
