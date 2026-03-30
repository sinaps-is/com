// src/core/seo/title.ts

import { brand } from '@/consts';
import { normalize } from '@/core/utils/string';

type Part = string | false | null | undefined;

type Input = {
  title?: Part;
  section?: Part | Part[];
  separator?: string;
};

export function resolveTitle (input: string | Input = {}): string {
  let { title, section, separator = '»' } = typeof input === 'string' ? { title: input } : input;

  const main = normalize (title || '');
  const sections = (Array.isArray (section) ? section : [section]).filter ((s): s is string => typeof s === 'string').map (normalize).filter (Boolean);
  separator = ` ${separator} `;

  if (main === brand.name) return brand.name;
  if ( ! main) return sections.length ? `${brand.name} — ${sections.join(separator)}` : brand.name;
  return sections.length ? `${brand.name} — ${sections.join(separator)}${separator}${main}` : `${brand.name} — ${main}`;
}