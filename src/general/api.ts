import { CompasProvider } from "../../index";

const api: any = (...args: any) => {
  return CompasProvider.api(...args);
};

export default api;
