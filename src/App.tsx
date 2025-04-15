import { useEffect, useState } from "react";

import services from "./infrastructure/services";

import type { AppProfileBodyResponse } from "./interface-adapters/external-types/app-profile";
import { adaptAppProfileResponse } from "./interface-adapters/gateways/app-profile/response-adapter";
import type { AppProfileInterface } from "./domain/types/app-profile";
import type {
  AppData,
  DynamicNestedObject,
  LabelValue,
} from "./domain/types/app-data";
import { hasValue } from "./domain/type-helpers/app-data/has-value";

function getValueAtPath(
  obj: DynamicNestedObject,
  path: string
): unknown | undefined {
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
}

function App() {
  const [state, setState] = useState<AppProfileInterface | null>(null);
  const [bindings, setBindings] = useState<AppData["xData"] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await services.dummy.get.auth();
        const { data: appProfile } =
          await services.wag12.get.parameters<AppProfileBodyResponse>();
        const adaptedProfile = adaptAppProfileResponse(appProfile);
        console.log(adaptedProfile);
        setState(adaptedProfile);
        const { data: appData } = await services.wag12.get.data<AppData>();
        console.log(appData);
        setBindings(appData.xData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(true);
      }
    };

    init();
  }, []);

  return (
    <>
      {state ? (
        <span>
          <h1>{state.app.name[state.user.lang[0]]}</h1>
          <br />
          {state.profile.parameters.display.value.displayDetail.content.layout?.items.map(
            (chapter, index) => (
              <div
                className="chapter"
                key={`chapter-item-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
              >
                <h2>
                  [{chapter.title?.alias}] {chapter.title?.defaultTxt}
                </h2>
                <hr />
                {chapter.layout?.items.map((group, index) => (
                  <div
                    className="group"
                    key={`group-item${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                  >
                    <h3>
                      [{group.title?.alias}] {group.title?.defaultTxt}
                    </h3>
                    <div className="binding">
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
                                      [{bind}] {data.label} : {data.value}
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
                      <br />
                    </div>
                  </div>
                ))}
                <br />
              </div>
            )
          )}
        </span>
      ) : error ? (
        "error: app couldn't load."
      ) : (
        "loading ..."
      )}
    </>
  );
}

export default App;
