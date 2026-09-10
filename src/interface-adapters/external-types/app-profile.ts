export type LayoutItem = {
	tag?: string[] | "*";
	title?: {
		group: string;
		alias: string;
		defaultTxt: string;
	};
	category: string;
	layout?: {
		items: LayoutItem[];
	};
	bind?: (string | Record<string, unknown>)[];
	request?: string;
	link?: string;
	headerType?: number;
	textra?: number;
};

export type AppProfileBodyResponse = {
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
	APP: {
		ANAME: {
			[lang: string]: string;
		};
		ASID: string;
		AVER: string;
		ATT?: Record<string, unknown>;
	};
	PRF: {
		PNAME: {
			[lang: string]: string;
		};
		PPID: string;
		PSID: string;
		PRM: {
			XDSP: {
				PRM: string;
				TYP: string;
				VAL: {
					$SHEET?: string;
					$VERSION?: string;
					$REM?: string;
					dspDetail: {
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
			DSPSEL?: {
				PRM: string;
				TYP: string;
				VAL: Record<string, unknown>;
			};
		};
	};
	USER: {
		APP: {
			[appName: string]: {
				PRF: Record<string, Record<string, unknown>>;
			};
		};
		UID: string;
		UMAIL: string;
		UNAME: string;
		LAN: string[];
	};
	MSG: Record<string, unknown>;
	Name: string;
};

export type AppProfileResponse = {
	json(): Promise<AppProfileBodyResponse>;
} & Response;
