class Compas {
  url: string;
  develUrl: string;
  colors: {
    blue: string;
  } = {
    blue: "#2196f3",
  };

  init(config: { url: string; develUrl?: string; colors?: { blue: string } }) {
    this.url = config.url;
    this.develUrl = config.url;
  }
}

export const compas = new Compas();
