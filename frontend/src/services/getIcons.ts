import { GetIconsResponse } from "../types/icon";
import { get } from "./fetcher";
import { getJsonApiHeaders } from "./requestHeaders";
import { getIconsApiUrl, IconsApiEndpoints } from "./endpoints";

const getIcons = async () => {
  return get<GetIconsResponse>({
    url: IconsApiEndpoints.icons,
    baseURL: getIconsApiUrl(),
    headers: getJsonApiHeaders(),
  })
    .then((response) => {
      if (response?.data?.data) {
        return Promise.resolve([...response.data.data]);
      } else {
        return Promise.resolve(undefined);
      }
    })
    .catch((error) => {
      console.log("error: ", error);
      return Promise.reject(undefined);
    });
};

export default getIcons;
