// src/core/utils/string.ts

// Normalize whitespace and common invisible characters
export function normalize (value: unknown): string {
  return String (value ?? '').replace (/\u00A0/g, ' ').replace (/\s+/g, ' ').trim ();
}

// Check if a value is effectively empty (after normalization)
export function empty (value: unknown): boolean {
  return normalize (value) === '';
}

// Join multiple parts into a single string ignoring empty values
export function join (parts: unknown[], separator = ' '): string {
  return parts.map (normalize).filter (Boolean).join (separator);
}

// Remove diacritics from a string (e.g., 'ṁ' becomes 'm')
function stripdiacritics (value: string): string {
  return value.normalize ('NFD').replace (/[\u0300-\u036f]/g, '');
}

// Return the first non-empty value from a list of string candidates
export function coalesce ( ... values: unknown[]): string {
  for (let v of values) {
    if (v = normalize (typeof v === 'string' ? v : '')) return <string> v;
  }

  return '';
}

// Convert a string to URL-friendly slug format
export function slugify (value: unknown): string {
  const text = normalize (value).toLowerCase ();

  // Return early if empty
  if (0 === text.length) return '';

  // Replace anything not alphanumeric with spaces and hyphenize the result
  return stripdiacritics (text).replace (/[^a-z0-9]+/g, ' ').trim ().replace (/\s+/g, '-').replace (/-+/g, '-');
}