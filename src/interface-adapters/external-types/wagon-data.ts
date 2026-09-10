export type ZoneResponse = {
	colnam: string;
	dynamicPath: string;
	label: string;
	zonpath: string;
	pathabs: string;
	zoncod: string;
	dynamicpathabs: string;
	dynamicpathabsalias: string;
	typeX3: string;
	type: string;
	listcod: string;
	description: string;
	zonsel: boolean;
	zonexp: string;
	value: string | number | boolean | null;
};

export type GroupResponse = {
	OBJECTTYPE: string;
	ACTX?: unknown;
	[zoneCode: string]: ZoneResponse | GroupResponse[] | string | unknown;
};

export type WagonDataBodyResponse = {
	$ClassName: string;
	$ClassVer: string;
	$uid: string;
	$stamp: string;
	headers: Record<string, string>;
	xData: Record<string, GroupResponse | ZoneResponse>;
};

export type WagonDataResponse = {
	json(): Promise<WagonDataBodyResponse>;
} & Response;
