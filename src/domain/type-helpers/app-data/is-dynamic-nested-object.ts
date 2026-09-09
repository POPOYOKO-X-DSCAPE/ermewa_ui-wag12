import type { DynamicNestedObject } from "../../types/app-data";

import { isFlagValue } from "./is-flag-value";
import { isLabelValue } from "./is-label-value";

export function isDynamicNestedObject(
  val: unknown
): val is DynamicNestedObject {
  return (
    typeof val === "object" &&
    val !== null &&
    !isLabelValue(val) &&
    !isFlagValue(val) &&
    !Array.isArray(val)
  );
}
