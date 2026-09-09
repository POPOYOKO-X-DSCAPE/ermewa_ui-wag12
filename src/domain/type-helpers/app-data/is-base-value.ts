import type { BaseValue } from "../../types/app-data";

export function isBaseValue(val: unknown): val is BaseValue {
  return (
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean" ||
    val === null
  );
}
