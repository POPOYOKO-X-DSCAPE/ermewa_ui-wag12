import type { LayoutItem } from "../../interface-adapters/external-types/app-profile";

export type AppProfileInterface = {
  $ClassName: string;
  $ClassVer: string;
  $uid: string;
  $stamp: string;
  headers: {
    login: string;
    uPid: string;
    xWag: string;
    xPrf: string;
  };
  app: {
    name: {
      [lang: string]: string;
    };
    sid: string;
    version: string;
    attributes: Record<string, unknown>;
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
};
