type ICompasConfig = {
  url: string;
  develUrl?: string;
  api: (data: any) => Promise<any>;
  apiCustomRootPath?: string;
  compasF7?: any;
  colors?: { blue: string };
};

class Compas {
  url: string | (() => string) = "";
  develUrl: string = "";
  api: any;
  apiCustomRootPath?: string = "api/";
  colors: {
    blue: string;
  } = {
    blue: "#2196f3",
  };
  compasF7: any;

  init(config: ICompasConfig) {
    this.url = config.url;
    this.develUrl = config.url;
    this.apiCustomRootPath = config.apiCustomRootPath;
    this.api = config.api;
    this.compasF7 = config.compasF7;
  }
}

export const CompasProvider = new Compas();
