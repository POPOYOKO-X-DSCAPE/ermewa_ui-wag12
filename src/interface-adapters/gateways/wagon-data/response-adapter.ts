import type {
	WagonDataGroup,
	WagonDataInterface,
	WagonZone,
} from "../../../domain/types/wagon-data";
import type {
	GroupResponse,
	WagonDataBodyResponse,
	ZoneResponse,
} from "../../../interface-adapters/external-types/wagon-data";

function adaptZone(zone: ZoneResponse): WagonZone {
	return {
		code: zone.zoncod,
		label: zone.label,
		type: zone.type,
		value: zone.value ?? null,
		description: zone.description || undefined,
	};
}

function adaptGroup(group: GroupResponse): WagonDataGroup {
	const zones: Record<string, WagonZone> = {};
	const subGroups: Record<string, WagonDataGroup[]> = {};

	for (const [key, val] of Object.entries(group)) {
		if (key === "OBJECTTYPE" || key === "ACTX") {
			continue;
		}

		if (Array.isArray(val)) {
			const nestedGroups: WagonDataGroup[] = [];
			for (const sg of val) {
				if (
					typeof sg === "object" &&
					sg !== null &&
					"OBJECTTYPE" in sg
				) {
					nestedGroups.push(adaptGroup(sg as GroupResponse));
				}
			}
			subGroups[key] = nestedGroups;
		} else if (
			typeof val === "object" &&
			val !== null &&
			"zoncod" in val &&
			"label" in val
		) {
			zones[key] = adaptZone(val as ZoneResponse);
		}
	}

	return {
		type: group.OBJECTTYPE,
		context: group.ACTX ?? undefined,
		zones,
		subGroups,
	};
}

export function adaptWagonDataResponse(
	input: WagonDataBodyResponse,
): WagonDataInterface {
	const data: Record<string, WagonDataGroup> = {};

	for (const [key, value] of Object.entries(input.xData)) {
		if (
			typeof value === "object" &&
			value !== null &&
			"OBJECTTYPE" in value
		) {
			data[key] = adaptGroup(value as GroupResponse);
		}
	}

	return {
		meta: {
			className: input.$ClassName,
			classVer: input.$ClassVer,
			uid: input.$uid,
			stamp: input.$stamp,
		},
		headers: input.headers,
		data,
	};
}

export default adaptWagonDataResponse;
