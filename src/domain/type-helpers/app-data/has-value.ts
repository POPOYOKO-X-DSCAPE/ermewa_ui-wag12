import type { DynamicNestedObject } from "../../types/app-data";

export function hasValue(obj: DynamicNestedObject, path: string): boolean {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return false;
    }
    const currentObj = current as DynamicNestedObject;
    if (!(part in currentObj)) {
      return false;
    }
    current = currentObj[part];
  }
  return current !== undefined && current !== null;
}
