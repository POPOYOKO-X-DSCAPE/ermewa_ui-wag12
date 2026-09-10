import type { LayoutItem } from "../../interface-adapters/external-types/app-profile";

export type AppProfileInterface = {
	$ClassName: string;
	$ClassVer: string;
	$uid: string;
	$stamp: string;
	headers: {
		login: string;
		uPid: string;
		uSid: string;
		xApp: string;
		xPrf: string;
	};
	app: {
		name: {
			[lang: string]: string;
		};
		sid: string;
		version: string;
		attributes?: Record<string, unknown>;
	};
	profile: {
		name: {
			[lang: string]: string;
		};
		pid: string;
		sid: string;
		parameters: {
			display: {
				parameter: string;
				type: string;
				value: {
					meta?: {
						sheet?: string;
						version?: string;
						remark?: string;
					};
					displayDetail: {
						content: {
							layout?: {
								items: LayoutItem[];
							};
						};
					};
					rpQuery: {
						content: {
							script: string;
						};
					};
				};
			};
			displaySelection?: Record<string, unknown>;
		};
	};
	user: {
		app: {
			[appName: string]: {
				profile: {
					[profileName: string]: Record<string, unknown>;
				};
			};
		};
		id: string;
		email: string;
		name: string;
		lang: string[];
	};
	messages: Record<string, unknown>;
	name: string;
};
