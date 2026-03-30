// src/core/seo/lang.ts

import { type LangKey, languages, i18n } from '@/consts';
import { ENV } from '@/core/env';

export type { LangCode } from '@/consts';

function isLangKey (value: string): value is LangKey {
  return value in languages;
}

export function resolveLang (input?: string) {
  const value = String (input ?? '').trim ().toLowerCase ();

  const key = value && isLangKey (value) ? value : i18n.default;

  if (ENV === 'dev' && value && key !== value) {
    console.warn (`[i18n] Unsupported language: ${input}`);
  }

  return { key, ... languages[key] };
}