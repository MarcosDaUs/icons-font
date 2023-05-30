export const ICONS_API_BASE_PATHS = "api/icons";

export enum IconsApiEndpoints {
  icons = "/",
  checkIcon = "/font",
}

const getBaseIconsApiUrl = (path: string) => {
  const urlIconsApi = String(process.env.REACT_APP_ICONS_API_URL) ?? "";
  return `${urlIconsApi}/${path}`;
};

export const getIconsApiUrl = () => getBaseIconsApiUrl(ICONS_API_BASE_PATHS);
