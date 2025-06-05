import { Heading, HeadingLevel } from "@ariakit/react";
import { useEffect, useState } from "react";

import { App as AbstractApp, Header } from "@popoyoko/ui";

import services from "./infrastructure/services";

import type { AppData } from "./domain/types/app-data";
import type { AppProfileInterface } from "./domain/types/app-profile";
import type {
	AppProfileBodyResponse,
	LayoutItem,
} from "./interface-adapters/external-types/app-profile";
import { adaptAppProfileResponse } from "./interface-adapters/gateways/app-profile/response-adapter";

import { Stack } from "@popoyoko/ui/abstract/stack";
import { SideBar } from "@popoyoko/ui/components";
import type { SideBarItems } from "@popoyoko/ui/components/sidebar";
import { Sheet } from "./components/sheet";
import dataMock from "./infrastructure/mocks/xdata-response.json" with {
	type: "json",
};
import parametersMock from "./infrastructure/mocks/xprm-response.json" with {
	type: "json",
};

const App = () => {
	const [state, setState] = useState<AppProfileInterface | null>(null);
	const [bindings, setBindings] = useState<AppData["xData"] | null>(
		null,
	);
	const [error, setError] = useState(false);

	useEffect(() => {
		const init = async () => {
			try {
				if (import.meta.env.DEV) {
					setTimeout(() => {
						// @ts-ignore
						setState(adaptAppProfileResponse(parametersMock));
					}, 500);

					setTimeout(() => {
						// @ts-ignore
						setBindings(dataMock.xData);
					}, 1000);
				} else {
					await services.dummy.get.auth();
					const { data: appProfile } =
						await services.wag12.get.parameters<AppProfileBodyResponse>();
					const adaptedProfile = adaptAppProfileResponse(appProfile);
					console.log(adaptedProfile);
					setState(adaptedProfile);
					const { data: appData } =
						await services.wag12.get.data<AppData>();
					console.log(appData);
					setBindings(appData.xData);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des données :",
					error,
				);
				setError(true);
			}
		};

		init();
	}, []);

	const renderSideBarItems = (): SideBarItems | undefined => {
		const items =
			state?.profile.parameters.display.value.displayDetail.content
				.layout?.items;

		if (items) {
			const proc = (items: LayoutItem[]): SideBarItems =>
				items
					.map((item) =>
						!item.layout
							? {
									name: item.title?.defaultTxt,
									trigger: () => console.log(item),
								}
							: {
									name: item.title?.defaultTxt,
									trigger: () => console.log(item),
									children: item.layout.items.map((item) => ({
										name: item.title?.defaultTxt,
										trigger: () => console.log(item),
									})),
								},
					)
					.filter((item) => item.name !== undefined) as SideBarItems;

			return proc(items);
		}
		return undefined;
	};

	const sideBarItems = renderSideBarItems();

	return (
		<AbstractApp>
			{state ? (
				<HeadingLevel>
					<Header>
						<Heading>{state.app.name[state.user.lang[0]]}</Heading>
					</Header>
					<Stack direction="row">
						{sideBarItems && <SideBar content={sideBarItems} />}
						{state.profile.parameters.display.value.displayDetail
							.content.layout?.items && (
							<Sheet
								bindings={bindings}
								items={
									state.profile.parameters.display.value.displayDetail
										.content.layout?.items
								}
							/>
						)}
					</Stack>
				</HeadingLevel>
			) : error ? (
				"error: app couldn't load."
			) : (
				"loading ..."
			)}
		</AbstractApp>
	);
};

export default App;
