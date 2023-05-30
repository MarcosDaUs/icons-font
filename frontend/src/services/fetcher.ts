import axios, { AxiosRequestConfig } from "axios";

export type FetcherType = Omit<AxiosRequestConfig, "method">;

axios.defaults.paramsSerializer = {
  encode: (value) => {
    return encodeURIComponent(value);
  },
};

export const get = <IResponseData = any>(config: FetcherType) => {
  const { data } = config;

  return axios<IResponseData>({
    method: "get",
    data: data ? data : null,

    ...config,
  });
};

export const post = <IResponseData = any>(config: FetcherType) => {
  const { data } = config;
  return axios<IResponseData>({
    method: "post",
    data: data ? data : null,
    ...config,
  });
};

export const put = <IResponseData = any>(config: FetcherType) => {
  const { data } = config;
  return axios<IResponseData>({
    method: "put",
    data: data ? data : null,
    ...config,
  });
};

export const deleteAxios = <IResponseData = any>(config: FetcherType) => {
  const { data } = config;
  return axios<IResponseData>({
    method: "delete",
    data: data ? data : null,
    ...config,
  });
};
