import { UpdateIconRequest, UpdateIconResponse } from "../types/icon";
import { put } from "./fetcher";
import { getFormDataApiHeaders } from "./requestHeaders";
import { getIconsApiUrl, IconsApiEndpoints } from "./endpoints";

const updateIcon = async ({ name, oldPath, file }: UpdateIconRequest) => {
  let formData = new FormData();

  formData.append("name", name);
  formData.append("oldPath", oldPath);
  if (file instanceof File) formData.append("file", file);

  return put<UpdateIconResponse>({
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

export default updateIcon;
