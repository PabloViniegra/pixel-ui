type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tiny on purpose: no objects, no arrays. */
export function cx(...classes: ClassValue[]): string {
  let out = '';
  for (const c of classes) {
    if (c) out = out ? `${out} ${c}` : c;
  }
  return out;
}
