type ICompasConfig = {
  url: string;
  develUrl?: string;
  api: (data: any) => Promise<any>;
  compasF7?: any;
  colors?: { blue: string };
};

class Compas {
  url: string | (() => string) = "";
  develUrl: string = "";
  api: any;
  colors: {
    blue: string;
  } = {
    blue: "#2196f3",
  };
  compasF7: any;

  init(config: ICompasConfig) {
    this.url = config.url;
    this.develUrl = config.url;
    this.api = config.api;
    this.compasF7 = config.compasF7;
  }
}

export const CompasProvider = new Compas();
