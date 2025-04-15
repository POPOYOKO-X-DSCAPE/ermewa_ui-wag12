// Types de base pour les valeurs basiques
export type BaseValue = string | number | boolean | null;

// Type pour une valeur avec étiquette (labelée)
export interface LabelValue<T = BaseValue> {
  label: string;
  typeX3: string;
  type: string;
  listcod: string;
  description: string;
  zonsel: boolean;
  value: T;
}

// Type pour une valeur booléenne avec étiquette
export interface FlagValue {
  label: string;
  value: boolean;
}

// Type pour un objet dynamique pouvant contenir des clés inconnues et des valeurs hétérogènes
export interface DynamicNestedObject {
  [key: string]:
    | BaseValue
    | LabelValue
    | FlagValue
    | DynamicNestedObject
    | Array<BaseValue | LabelValue | FlagValue | DynamicNestedObject>;
}

// Type global pour votre structure, entièrement dynamique pour xData
export type AppData = {
  $ClassName: string;
  $ClassVer: string;
  $uid: string;
  $stamp: string;
  headers: {
    login: string;
    uPid: string;
    uSid: string;
    xPrf: string;
    xSid: string;
  };
  xData: DynamicNestedObject;
};
