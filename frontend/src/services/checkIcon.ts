import { CheckIconRequest, CheckIconResponse } from "../types/icon";
import { get } from "./fetcher";
import { getJsonApiHeaders } from "./requestHeaders";
import { getIconsApiUrl, IconsApiEndpoints } from "./endpoints";

const checkIcon = async ({ icon }: CheckIconRequest) => {
  return get<CheckIconResponse>({
    url: IconsApiEndpoints.checkIcon,
    baseURL: getIconsApiUrl(),
    headers: getJsonApiHeaders(),
    params: { icon },
  })
    .then((response) => {
      if (typeof response?.data?.data === "boolean") {
        return Promise.resolve(response.data.data);
      } else {
        return Promise.resolve(undefined);
      }
    })
    .catch((error) => {
      console.log("error: ", error);
      return Promise.reject(undefined);
    });
};

export default checkIcon;
