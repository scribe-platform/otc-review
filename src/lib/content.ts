import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

/**
 * Reads a `format: yaml` collection straight off disk at build time.
 *
 * Astro's glob loader would also work, but this keeps the rule the schema
 * actually sets — read the declared `path` — in one obvious place, and means
 * a collection the admin just created renders without a second config file
 * needing to learn about it.
 */
export function loadYamlCollection<T>(path: string): Array<T & { slug: string }> {
  let files: string[];
  try {
    files = readdirSync(resolve(process.cwd(), path));
  } catch {
    return []; // collection folder not created yet — not an error
  }
  return files
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map((f) => ({
      ...(parse(readFileSync(resolve(process.cwd(), path, f), 'utf-8')) as T),
      slug: f.replace(/\.ya?ml$/, ''),
    }));
}

export interface ActionItem {
  title: string;
  detail?: string;
  owner?: string;
  done?: boolean;
  doneOn?: string | Date;
  order?: number;
  slug: string;
}

export function actionItems(): ActionItem[] {
  return loadYamlCollection<ActionItem>('content/action-items').sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100) || a.title.localeCompare(b.title),
  );
}
