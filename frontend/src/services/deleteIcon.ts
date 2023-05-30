import { DeleteIconRequest, DeleteIconResponse } from "../types/icon";
import { deleteAxios } from "./fetcher";
import { getJsonApiHeaders } from "./requestHeaders";
import { getIconsApiUrl, IconsApiEndpoints } from "./endpoints";

const deleteIcon = async ({ path }: DeleteIconRequest) => {
  return deleteAxios<DeleteIconResponse>({
    url: IconsApiEndpoints.icons,
    baseURL: getIconsApiUrl(),
    headers: getJsonApiHeaders(),
    data: { path },
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

export default deleteIcon;
