// src/core/seo/robots.ts

const ROBOTS_TOKENS = ['index', 'follow', 'archive', 'snippet', 'cache'] as const;

const ROBOTS_PRESETS = { 
  all: ['index', 'follow'] as const,
  none: ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'nocache'] as const,
} as const;

type RobotsToken = typeof ROBOTS_TOKENS[number];
type RobotsDirective = RobotsToken | `no${RobotsToken}`;
type RobotsPreset = keyof typeof ROBOTS_PRESETS;

export type Robots = RobotsPreset | RobotsDirective | RobotsDirective[];

const ROBOTS_DIRECTIVES = new Set <string> (
  ROBOTS_TOKENS.flatMap (token => [token, `no${token}`]),
);

export function resolveRobots (value: Robots = 'all'): string {
  const directives = typeof value === 'string' ? value in ROBOTS_PRESETS ? [ ... ROBOTS_PRESETS[value as RobotsPreset]] : [value] : value;
  const unique = [ ... new Set (directives)];

  for (const token of unique) {
    if ( ! ROBOTS_DIRECTIVES.has (token)) {
      throw new Error (`Invalid robots directive: ${token} is not a recognized`);
    }
  }

  for (const token of ROBOTS_TOKENS) {
    if (unique.includes (token) && unique.includes (`no${token}`)) {
      throw new Error (`Conflicting robots directives: ${token} and no${token} cannot be used together`);
    }
  }

  return unique.join (', ');
}