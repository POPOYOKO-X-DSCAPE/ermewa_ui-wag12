import type { LabelValue } from "../../types/app-data";

export function isLabelValue(val: unknown): val is LabelValue {
  if (typeof val !== "object" || val === null) return false;
  const obj = val as { [key: string]: unknown };
  return (
    "label" in obj &&
    "typeX3" in obj &&
    "type" in obj &&
    "listcod" in obj &&
    "description" in obj &&
    "zonsel" in obj &&
    "value" in obj
  );
}
