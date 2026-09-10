import type {
	WagonSelectionInterface,
	WagonSelectionItemInterface,
} from "../../../domain/types/wagon-selection";
import type {
	WagonSelectionBodyResponse,
	WagonSelectionItem,
} from "../../../interface-adapters/external-types";

export const adaptWagonSelectionResponse = (
	input: WagonSelectionBodyResponse,
): WagonSelectionInterface => {
	const selection: WagonSelectionItemInterface[] = input.xSel.map(
		(item: WagonSelectionItem) => ({
			uuid: item.$uuid,
			etag: item.$etag,
			requestNumber: item.REQNUM,
			requestOrder: item.REQORD,
			requestStatus: item.REQSTA,
			BPSNUM: item.BPSNUM,
			ETBNUM: item.ETBNUM,
			YME06: item.YME06,
			WSHCOD: item.WSHCOD,
			MACNUM: item.MACNUM,
			COPHID: item.COPHID,
			WYSA01: item.WYSA01,
			requestRoot: item.REQROOT,
			requestFather: item.REQFATHER,
			requestType: item.REQTYP,
			contractRevision: item.CONREV,
		}),
	);

	return {
		className: input.$ClassName,
		classVersion: input.$ClassVer,
		uid: input.$uid,
		stamp: input.$stamp,
		headers: {
			login: input.headers.login,
			userPid: input.headers.uPid,
			userSid: input.headers.uSid,
		},
		selection,
	};
};
