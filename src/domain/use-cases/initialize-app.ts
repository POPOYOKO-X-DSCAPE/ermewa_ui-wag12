import services from "../../infra-structures/services";

import type {
	AppProfileResponse,
	WagonDataResponse,
	WagonSelectionResponse,
} from "../../interface-adapters/external-types";

import {
	adaptAppProfileResponse,
	adaptWagonDataResponse,
	adaptWagonSelectionResponse,
} from "../../interface-adapters/gateways/";

import type {
	AppProfileInterface,
	WagonDataInterface,
	WagonSelectionInterface,
} from "../types/";

const initializeApp = async () => {
	const currentPath = window.location.pathname
		.replace(/^\/+/, "")
		.split("/")
		.filter(Boolean);

	const [profileSegment, macNumber] = currentPath;
	const isSelectionOnly = !macNumber;

	if (
		import.meta.env.DEV &&
		import.meta.env.VITE_ENABLE_OFFLINE_SERVICES !== "true"
	) {
		await services.dummy.get.auth();
	}

	let appProfile: AppProfileInterface | null = null;
	let wagonData: WagonDataInterface | null = null;
	let wagonSelection: WagonSelectionInterface | null = null;

	if (isSelectionOnly) {
		const wagonSelectionResponse =
			// @ts-ignore explanation<typescript technical debt [services layer]>
			await services.wag12.get.wagons<WagonSelectionResponse>();
		const wagonSelectionJson = await wagonSelectionResponse.data.json();
		wagonSelection = adaptWagonSelectionResponse(wagonSelectionJson);
	} else {
		const [appProfileResponse, wagonDataResponse] = await Promise.all([
			// @ts-ignore explanation<typescript technical debt [services layer]>
			services.wag12.get.parameters<AppProfileResponse>({
				params: { macNumber },
			}),
			// @ts-ignore explanation<typescript technical debt [services layer]>
			services.wag12.get.data<WagonDataResponse>({
				params: { macNumber },
			}),
		]);

		const [appProfileJson, wagonDataJson] = await Promise.all([
			appProfileResponse.data.json(),
			wagonDataResponse.data.json(),
		]);

		appProfile = adaptAppProfileResponse(appProfileJson);
		wagonData = adaptWagonDataResponse(wagonDataJson);
	}

	const payload = {
		appProfile,
		wagonData,
		wagonSelection,
	};

	console.log("🚂 initializeApp (Wagon):", payload);

	return payload;
};

export default initializeApp;
