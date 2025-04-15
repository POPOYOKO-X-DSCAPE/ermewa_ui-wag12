export type LayoutItem = {
  title?: {
    group: string;
    alias: string;
    defaultTxt: string;
  };
  category: string;
  layout?: {
    items: LayoutItem[];
  };
  bind?: string[];
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
    xWag: string;
    xPrf: string;
  };
  APP: {
    ANAME: {
      ENG: string;
      FRA: string;
      "": string;
    };
    ASID: string;
    AVER: string;
    ATT: Record<string, unknown>;
  };
  PRF: {
    PNAME: {
      FRA: string;
      "": string;
    };
    PPID: string;
    PSID: string;
    PRM: {
      XDSP: {
        PRM: string;
        TYP: string;
        VAL: {
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
    };
  };
  USER: {
    APP: {
      EDV00: {
        PRF: {
          EVWX: Record<string, unknown>;
        };
      };
      EDX00: {
        PRF: {
          EURL: Record<string, unknown>;
          EHDL: Record<string, unknown>;
        };
      };
      EDM12: {
        PRF: {
          XRMWCON: Record<string, unknown>;
          MNR: Record<string, unknown>;
          WLM: Record<string, unknown>;
          BIS: Record<string, unknown>;
          AUS: Record<string, unknown>;
          BPC: Record<string, unknown>;
          BPR: Record<string, unknown>;
          CLL: Record<string, unknown>;
          CPY: Record<string, unknown>;
          CUR: Record<string, unknown>;
          DEP: Record<string, unknown>;
          EXA: Record<string, unknown>;
          FRM: Record<string, unknown>;
          GAS: Record<string, unknown>;
          INI: Record<string, unknown>;
          OFH: Record<string, unknown>;
          ONH: Record<string, unknown>;
          OPOD: Record<string, unknown>;
          PAY: Record<string, unknown>;
          PIH: Record<string, unknown>;
          POC: Record<string, unknown>;
          POM: Record<string, unknown>;
          RIV: Record<string, unknown>;
          SIH: Record<string, unknown>;
          WRK: Record<string, unknown>;
          XRMWETB: Record<string, unknown>;
          XRMWMAC: Record<string, unknown>;
          YBGI0: Record<string, unknown>;
          YCST: Record<string, unknown>;
          YDC: Record<string, unknown>;
          YDI: Record<string, unknown>;
          YMD: Record<string, unknown>;
          YPO: Record<string, unknown>;
          YRW: Record<string, unknown>;
          ZAH: Record<string, unknown>;
          ZAR: Record<string, unknown>;
          ZDL: Record<string, unknown>;
          ZEE: Record<string, unknown>;
          ZET: Record<string, unknown>;
          ZIN: Record<string, unknown>;
          ZKP: Record<string, unknown>;
        };
      };
      "EPS-WS": {
        PRF: {
          EDI: Record<string, unknown>;
          DUMMY: Record<string, unknown>;
          XDOC: Record<string, unknown>;
        };
      };
      "GED-GWFUPL": {
        PRF: {
          ZOF: Record<string, unknown>;
          POM: Record<string, unknown>;
        };
      };
      "GED-BPCINV": {
        PRF: {
          INV2EDM: Record<string, unknown>;
        };
      };
      OLX12: {
        PRF: {
          ZOF: Record<string, unknown>;
          YPOH: Record<string, unknown>;
          YPO: Record<string, unknown>;
          POM: Record<string, unknown>;
          POH: Record<string, unknown>;
        };
      };
      WAG12: {
        PRF: {
          ATL: Record<string, unknown>;
        };
      };
      WRD12: {
        PRF: {
          ZOF: Record<string, unknown>;
        };
      };
      XGW00: {
        PRF: {
          EDMINV: Record<string, unknown>;
        };
      };
    };
    UID: string;
    UMAIL: string;
    UNAME: string;
    LAN: string[];
  };
  MSG: Record<string, unknown>;
};

export type AppProfileResponse = {
  json(): Promise<AppProfileBodyResponse>;
} & Response;
