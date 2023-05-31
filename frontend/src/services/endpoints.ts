export const ICONS_API_BASE_PATHS = "api/icons";

export enum IconsApiEndpoints {
  icons = "/",
  checkIcon = "/font",
}

const getBaseIconsApiUrl = (path: string) => {
  const urlIconsApi = "";
  return `${urlIconsApi}/${path}`;
};

export const getIconsApiUrl = () => getBaseIconsApiUrl(ICONS_API_BASE_PATHS);
