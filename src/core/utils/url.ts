// src/core/utils/url.ts

import { project } from '@/consts';
import { normalize } from './string';

type QueryScalar = string | number | boolean;
type QueryValue = null | undefined | QueryScalar | QueryScalar[];

const EXTERNAL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;
const PROJECT_URL = project.url ? new URL (project.url) : null;

// Join multiple path segments into a single normalized path
function joinPath ( ... parts: Array <string | null | undefined>): string {
  const output = parts.filter ((part): part is string => typeof part === 'string').map ((part) => normalize (part).replace (/^\/+|\/+$/g, '')).filter (Boolean).join ('/');

  return `/${output}`;
}

function isExternalProtocol (value: string): value is (typeof EXTERNAL_PROTOCOLS)[number] {
  return EXTERNAL_PROTOCOLS.includes (value as (typeof EXTERNAL_PROTOCOLS)[number]);
}

function requireProjectUrl (): URL {
  if ( ! PROJECT_URL) throw new Error ('Project url is not defined');
  return PROJECT_URL;
}

// Resolve an internal path from arbitrary user input
export function path (value = ''): string {
  return joinPath (value);
}

// Resolve an absolute same-origin URL from an internal path
export function absolute (value = ''): string {
  return new URL (path (value), requireProjectUrl ()).toString ();
}

// Resolve a same-origin path from an absolute or relative URL-like input
export function relative (value = ''): string {
  const base = requireProjectUrl ();
  const url = new URL (normalize (value), base);

  if (url.origin !== base.origin) {
    throw new Error (`External URL is not allowed: "${value}"`);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

// Validate an absolute external URL and preserve the normalized input
export function external (value: string): string {
  const href = normalize (value);
  let url: URL;

  if ( ! /^(https?:|mailto:|tel:)/.test (href)) {
    throw new Error (`External URL must be absolute: "${value}"`);
  }

  try {
    url = new URL (href);
  } catch {
    throw new Error (`Invalid external URL: "${value}"`);
  }

  if (PROJECT_URL && url.origin === PROJECT_URL.origin) {
    throw new Error (`Same-origin link is not allowed: "${value}"`);
  }

  if ( ! isExternalProtocol (url.protocol)) {
    throw new Error (`Unsupported URL protocol: "${url.protocol}" in "${value}"`);
  }

  return href;
}

// Apply query parameters to a URL object, supporting scalar and array values
function applyQuery (url: URL, params?: Record <string, QueryValue>): URL {
  if ( ! params) return url;

  for (const [key, value] of Object.entries (params)) {
    if (value == null) continue;

    if (Array.isArray (value)) {
      for (const item of value) url.searchParams.append (key, String (item));
      continue;
    }

    url.searchParams.set (key, String (value));
  }

  return url;
}

// Apply a hash fragment to a URL object, ensuring it is properly formatted
function applyHash (url: URL, hash?: string): URL {
  url.hash = hash ? `#${normalize (hash).replace (/^#+/, '')}` : '';
  return url;
}

// Resolve a canonical absolute URL from a path with optional query params and hash
export function canonical (value: string | { path: string; params?: Record <string, QueryValue>; hash?: string } = ''): string {
  const { path, params, hash } = typeof value === 'string' ? { path: value, params: undefined, hash: '' } : value;

  const url = new URL (absolute (path));
  applyQuery (url, params);
  applyHash (url, hash);

  return url.toString ();
}

// Check whether a value is a valid external URL
export function isExternal (value: string): boolean {
  try {
    external (value);
    return true;
  } catch {
    return false;
  }
}

// Check whether a URL resolves to the same origin as the project URL
export function sameOrigin (value: string): boolean {
  if ( ! PROJECT_URL) return false;

  try {
    return new URL (value, PROJECT_URL).origin === PROJECT_URL.origin;
  } catch {
    return false;
  }
}

export const link = {
  canonical,
  external,
  internal: path,
} as const;