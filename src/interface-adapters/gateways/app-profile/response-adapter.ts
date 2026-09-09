import type { AppProfileInterface } from "../../../domain/types/app-profile";
import type { AppProfileBodyResponse } from "../../external-types/app-profile";

export const adaptAppProfileResponse = (
  input: AppProfileBodyResponse
): AppProfileInterface => {
  const adaptedUserApps: AppProfileInterface["user"]["app"] = (
    Object.keys(input.USER.APP) as Array<keyof typeof input.USER.APP>
  ).reduce((acc, appKey) => {
    const appValue = input.USER.APP[appKey];
    acc[appKey] = {
      profile: { ...appValue.PRF },
    };
    return acc;
  }, {} as AppProfileInterface["user"]["app"]);

  return {
    $ClassName: input.$ClassName,
    $ClassVer: input.$ClassVer,
    $uid: input.$uid,
    $stamp: input.$stamp,
    headers: input.headers,
    app: {
      name: input.APP.ANAME,
      sid: input.APP.ASID,
      version: input.APP.AVER,
      attributes: input.APP.ATT,
    },
    profile: {
      name: input.PRF.PNAME,
      pid: input.PRF.PPID,
      sid: input.PRF.PSID,
      parameters: {
        display: {
          parameter: input.PRF.PRM.XDSP.PRM,
          type: input.PRF.PRM.XDSP.TYP,
          value: {
            displayDetail: input.PRF.PRM.XDSP.VAL.dspDetail,
            rpQuery: input.PRF.PRM.XDSP.VAL.rpQuery,
          },
        },
      },
    },
    user: {
      app: adaptedUserApps,
      id: input.USER.UID,
      email: input.USER.UMAIL,
      name: input.USER.UNAME,
      lang: input.USER.LAN,
    },
    messages: input.MSG,
  };
};
