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

const compas = new Compas();

export default compas;
