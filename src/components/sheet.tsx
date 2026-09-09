import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from "@ariakit/react";
import { Stack } from "@packages/ui/abstract/stack";
import { RiArrowDownSLine as RiArrowSLine } from "@remixicon/react";
import classNames from "classnames";
import { hasValue } from "../domain/type-helpers/app-data/has-value";
import type { DynamicNestedObject, LabelValue } from "../domain/types/app-data";
import type { LayoutItem } from "../interface-adapters/external-types/app-profile";

interface sheet {
  items: LayoutItem[];
  bindings: DynamicNestedObject | null;
}

const getValueAtPath = (
  obj: DynamicNestedObject,
  path: string
): unknown | undefined => {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    const currentObj = current as DynamicNestedObject;
    if (!(part in currentObj)) {
      return undefined;
    }
    current = currentObj[part];
  }
  return current;
};

export const Sheet = ({ items, bindings }: sheet) => {
  return (
    <Stack className={classNames("sheet")} scrollable>
      {items.map((chapter, index) => (
        <Stack
          key={`chapter-item-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          alignItems="center"
        >
          <h2>
            <div className="tag">{chapter.title?.alias}</div>{" "}
            {chapter.title?.defaultTxt}
          </h2>
          <hr />
          {chapter.layout?.items.map((group, index) => (
            <Stack
              className="group"
              direction="column"
              key={`group-item${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
            >
              <DisclosureProvider>
                <Disclosure>
                  <Stack direction="row">
                    <RiArrowSLine />
                    <h3>
                      <div className="tag">{group.title?.alias}</div>{" "}
                      {group.title?.defaultTxt}
                    </h3>
                  </Stack>
                </Disclosure>
                <DisclosureContent className="content-wrapper">
                  <ul>
                    {bindings
                      ? group.layout?.items.map((binding, index) => {
                          const groupItems = binding.bind
                            ?.filter((bind) => {
                              if (typeof bind === "object") {
                                console.log(Object.values(bind));
                                return false;
                              }

                              return hasValue(bindings, bind);
                            })
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ?.map((bind) => {
                              const data = getValueAtPath(
                                bindings,
                                bind
                              ) as LabelValue;

                              return (
                                <li key={`${bind}`}>
                                  <div className="tag">{bind}</div> {data.label}{" "}
                                  : {data.value}
                                </li>
                              );
                            });
                          return groupItems?.length ? (
                            groupItems
                          ) : (
                            <li key={`empty-${binding.category}-${index}`}>
                              empty data.
                            </li>
                          );
                        })
                      : "loading ..."}
                  </ul>
                </DisclosureContent>
              </DisclosureProvider>
            </Stack>
          ))}
          <br />
        </Stack>
      ))}
    </Stack>
  );
};
