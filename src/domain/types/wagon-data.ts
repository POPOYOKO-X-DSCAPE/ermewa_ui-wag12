export type WagonZone = {
	code: string;
	label: string;
	type: string;
	value: string | number | boolean | null;
	description?: string;
};

export type WagonDataGroup = {
	type: string;
	context?: unknown;
	zones: Record<string, WagonZone>;
	subGroups: Record<string, WagonDataGroup[]>;
};

export type BaseValue = string | number | boolean | null;

export interface LabelValue<T = BaseValue> {
	label: string;
	typeX3: string;
	type: string;
	listcod: string;
	description: string;
	zonsel: boolean;
	value: T;
}

export interface FlagValue {
	label: string;
	value: boolean;
}

export interface DynamicNestedObject {
	[key: string]:
		| BaseValue
		| LabelValue
		| FlagValue
		| DynamicNestedObject
		| Array<BaseValue | LabelValue | FlagValue | DynamicNestedObject>;
}

export type WagonDataInterface = {
	meta: {
		className: string;
		classVer: string;
		uid: string;
		stamp: string;
	};
	headers: Record<string, string>;
	data: Record<string, WagonDataGroup>;
};
