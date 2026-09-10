export type WagonSelectionItem = {
	$uuid: string;
	$etag: string;
	REQNUM: string;
	REQORD: number;
	REQSTA: string;
	BPSNUM: string;
	ETBNUM: string;
	YME06: string;
	WSHCOD: string;
	MACNUM: string;
	COPHID: string;
	WYSA01: string;
	REQROOT: string;
	REQROOT_REF: {
		$title: string;
	};
	REQFATHER: string;
	REQFATHER_REF: {
		$title: string;
	};
	REQTYP: string;
	REQTYP_REF: {
		$title: string;
	};
	CONREV: string;
	CONREV_REF: {
		$title: string;
	};
};

export type WagonSelectionBodyResponse = {
	$ClassName: string;
	$ClassVer: string;
	$uid: string;
	$stamp: string;
	headers: {
		login: string;
		uPid: string;
		uSid: string;
	};
	xSel: WagonSelectionItem[];
};

export type WagonSelectionResponse = {
	json(): Promise<WagonSelectionBodyResponse>;
} & Response;
