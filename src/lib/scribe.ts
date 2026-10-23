import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

export interface ScribeField {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  hidden?: boolean;
}

export interface ScribeCollection {
  name: string;
  label?: string;
  description?: string;
  form?: boolean;
  fields: ScribeField[];
}

export interface ScribeSchema {
  site: string;
  siteName?: string;
  turnstileSiteKey?: string;
  umamiWebsiteId?: string;
  umamiScriptUrl?: string;
  collections: ScribeCollection[];
}

let cached: ScribeSchema | undefined;

/** Build-time only — reads the repo's own `.scribe.yml`. */
export function loadScribeSchema(): ScribeSchema {
  cached ??= parse(readFileSync(resolve(process.cwd(), '.scribe.yml'), 'utf-8')) as ScribeSchema;
  return cached;
}
