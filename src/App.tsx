import { Heading, HeadingLevel } from "@ariakit/react";
import { App as AbstractApp, Header, Stack } from "@packages/ui";
import { SideBar } from "@packages/ui/components";
import { useMemo } from "react";

import type { LayoutItem } from "./interface-adapters/external-types/app-profile";
import { Sheet } from "./presentation/components/sheet";
import WagonSelect from "./presentation/components/wagon-select"; // ✅ ajout
import { useAppContext } from "./presentation/contexts/app-context";

const buildSideBarItems = (items?: LayoutItem[]) => {
	if (items) {
		const proc = (items: LayoutItem[]) =>
			items
				.map((item) =>
					!item.layout
						? {
								name: item.title?.defaultTxt,
								alias: item.title?.alias,
							}
						: {
								name: item.title?.defaultTxt,
								alias: item.title?.alias,
								children: item.layout.items.map((item) => ({
									name: item.title?.defaultTxt,
									alias: item.title?.alias,
								})),
							},
				)
				.filter((item) => item.name !== undefined);

		return proc(items);
	}
	return undefined;
};

const App = () => {
	const { payload, loading, error, reload } = useAppContext();

	// ✅ Cas de chargement
	if (loading) return <AbstractApp>loading ...</AbstractApp>;
	if (error || !payload) {
		return (
			<AbstractApp>
				<div className="p-4 text-red-600">
					<p>Erreur : {error ?? "app couldn't load."}</p>
					<button
						type="button"
						onClick={() => void reload()}
						className="mt-2 rounded bg-gray-200 px-3 py-1"
					>
						Relancer l'application
					</button>
				</div>
			</AbstractApp>
		);
	}

	// ✅ Scénario 1 : liste de wagons (wagonSelection présent)
	if (
		payload.wagonSelection &&
		!payload.appProfile &&
		!payload.wagonData
	) {
		return (
			<AbstractApp>
				<WagonSelect wagons={payload.wagonSelection.selection} />
			</AbstractApp>
		);
	}

	// ✅ Scénario 2 : données de wagon et profil (détails)
	if (payload.appProfile && payload.wagonData) {
		const layoutItems = useMemo(
			() =>
				payload.appProfile?.profile.parameters.display.value
					.displayDetail.content.layout?.items ?? [],
			[payload],
		);

		const bindings = useMemo(
			() => payload.wagonData?.data || null,
			[payload],
		);

		const sideBarItems = useMemo(
			() => buildSideBarItems(layoutItems),
			[layoutItems],
		);

		const lang = payload.appProfile.user.lang[0];
		const title = payload.appProfile.app.name[lang] ?? "Railcar sheet";

		return (
			<AbstractApp>
				<HeadingLevel>
					<Header>
						<Heading>{title}</Heading>
					</Header>
					<Stack direction="row" grow>
						<SideBar>
							{sideBarItems?.map((item) =>
								item.children ? (
									<SideBar.Group
										key={item.alias ?? item.name}
										href={`#${item.alias}`}
									>
										{item.name}
										{item.children?.map((child) => (
											<SideBar.Element
												key={child.alias ?? child.name}
												href={`#${child.alias}`}
											>
												{child.name}
											</SideBar.Element>
										))}
									</SideBar.Group>
								) : (
									<SideBar.Element
										key={item.alias ?? item.name}
										href={`#${item.alias}`}
									>
										{item.name}
									</SideBar.Element>
								),
							)}
						</SideBar>

						{layoutItems && (
							<Sheet bindings={bindings} items={layoutItems} />
						)}
					</Stack>
				</HeadingLevel>
			</AbstractApp>
		);
	}

	// ✅ Cas fallback (aucun des deux scénarios)
	return (
		<AbstractApp>
			<div className="p-4">Aucune donnée disponible.</div>
		</AbstractApp>
	);
};

export default App;
