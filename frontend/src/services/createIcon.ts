import { CreateIconRequest, CreateIconResponse } from "../types/icon";
import { post } from "./fetcher";
import { getFormDataApiHeaders } from "./requestHeaders";
import { getIconsApiUrl, IconsApiEndpoints } from "./endpoints";

const createIcon = async ({ name, folderPath, file }: CreateIconRequest) => {
  let formData = new FormData();

  formData.append("name", name);
  formData.append("folderPath", folderPath);
  formData.append("file", file);

  return post<CreateIconResponse>({
    url: IconsApiEndpoints.icons,
    baseURL: getIconsApiUrl(),
    headers: getFormDataApiHeaders(),
    data: formData,
  })
    .then((response) => {
      if (response?.data?.data) {
        return Promise.resolve({ ...response.data.data });
      } else {
        return Promise.reject(undefined);
      }
    })
    .catch((error) => {
      console.log("error: ", error);
      return Promise.reject(undefined);
    });
};

export default createIcon;
