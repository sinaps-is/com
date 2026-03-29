// src/core/env.ts

export const ENV = env ();

function getMetaEnv () {
  return typeof import.meta !== 'undefined' ? import.meta.env : undefined;
}

function getProcessEnv () {
  return typeof process !== 'undefined' ? process.env : undefined;
}

export function env (): 'dev' | 'prod' | 'test' {
  const m = getMetaEnv ();
  const p = getProcessEnv ();
  const vitest = p?.['VITEST'];
  const node = p?.['NODE_ENV'];

  // (1) Test runners may set development and production modes
  if (m?.MODE === 'test') return 'test';
  if (vitest === 'true') return 'test';
  if (node === 'test') return 'test';

  // (2) Vite should take precedence as the primary source of truth after test runners modes
  if ('boolean' === typeof m?.DEV) return m.DEV ? 'dev' : 'prod';

  // (3) Fallback to NODE_ENV for legacy support
  if (node === 'development') return 'dev';

  return 'prod';
}