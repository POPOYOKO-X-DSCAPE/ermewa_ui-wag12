export type WagonSelectionItemInterface = {
	uuid: string;
	etag: string;
	requestNumber: string;
	requestOrder: number;
	requestStatus: string;
	BPSNUM: string;
	ETBNUM: string;
	YME06: string;
	WSHCOD: string;
	MACNUM: string;
	COPHID: string;
	WYSA01: string;
	requestRoot: string;
	requestFather: string;
	requestType: string;
	contractRevision: string;
};

export type WagonSelectionInterface = {
	className: string;
	classVersion: string;
	uid: string;
	stamp: string;
	headers: {
		login: string;
		userPid: string;
		userSid: string;
	};
	selection: WagonSelectionItemInterface[];
};
