// src/core/seo/description.ts

import { brand } from '@/consts';
import { coalesce } from '@/core/utils/string';

type Part = string | false | null | undefined;

type Input = {
  description?: Part;
  fallback?: string;
};

export function resolveDescription (input: string | Input = {}): string {
  let { description, fallback = brand.description } = typeof input === 'string' ? { description: input } : input;

  return coalesce (description, fallback);
}