// src/consts.ts

import { version, homepage } from '../package.json';

// Brand identity and default values used across the site
export const brand = {
  name: 'Sinaps·is',
  description: 'Plataforma académica para profesionales de la salud con artículos rigurosos y bien estructurados, pensados para facilitar el aprendizaje.',
} as const;

// Project-level metadata and configuration
export const project = {
  url: homepage,
  version,
} as const;

// Supported internationalization (single source of truth)
export const languages = {
  es: { lang: 'es', dir: 'ltr' },
  en: { lang: 'en', dir: 'ltr' },
} as const;

export type LangKey = keyof typeof languages;
export type LangCode = typeof languages[LangKey]['lang'];
export type Dir = typeof languages[LangKey]['dir'];

export const i18n = {
  default: 'es' as LangKey,
} as const;

// Centralized internal routes to avoid hardcoded paths throughout the codebase
export const routes = {
  home: '/',
} as const;

export type Route = typeof routes[keyof typeof routes];