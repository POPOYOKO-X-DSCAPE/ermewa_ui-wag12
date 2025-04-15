import type { FlagValue } from "../../types/app-data";

export function isFlagValue(val: unknown): val is FlagValue {
  if (typeof val !== "object" || val === null) return false;
  const obj = val as { [key: string]: unknown };
  return "label" in obj && "value" in obj && typeof obj.value === "boolean";
}
