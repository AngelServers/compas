import { CompasProvider } from "../../index";

interface ImportMeta {
  env?: {
    VITE_APP_SERVER: string;
  };
}

export function GetUrl(): string {
  let url =
    typeof CompasProvider.url == "function"
      ? CompasProvider.url()
      : CompasProvider.url;

  if ((import.meta as ImportMeta).env?.VITE_APP_SERVER == "local") {
    url = CompasProvider.develUrl || url;
  }

  return url;
}

export function JoinUrl(url: string): string | null {
  if (url === null) return null;
  const parsedUrl = url.substring(0, 1) === "/" ? url.substring(1) : url;

  const root = GetUrl();
  if (root.slice(-1) === "/") {
    return root + parsedUrl;
  } else {
    return `${root}/${parsedUrl}`;
  }
}
