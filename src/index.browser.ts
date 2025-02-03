import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { AptosClientRequest, AptosClientResponse } from "./types";

/**
 * Used for JSON responses
 *
 * @param options
 */
export default async function aptosClient<Res>(
  options: AptosClientRequest,
): Promise<AptosClientResponse<Res>> {
  return jsonRequest<Res>(options);
}

export async function jsonRequest<Res>(
    options: AptosClientRequest,
): Promise<AptosClientResponse<Res>> {
  const { params, method, url, headers, body, overrides } = options;
  const requestConfig: AxiosRequestConfig = {
    headers,
    method,
    url,
    params,
    data: body,
    withCredentials: overrides?.WITH_CREDENTIALS ?? true,
  };

  try {
    const response = await axios(requestConfig);
    return {
      status: response.status,
      statusText: response.statusText!,
      data: response.data,
      headers: response.headers,
      config: response.config,
    };
  } catch (error) {
    const axiosError = error as AxiosError<Res>;
    if (axiosError.response) {
      return axiosError.response;
    }
    throw error;
  }
}


/**
 * Used for binary responses, such as BCS outputs
 *
 * @experimental
 * @param options
 */
export async function bcsRequest(
  options: AptosClientRequest,
): Promise<AptosClientResponse<Buffer>> {
  const { params, method, url, headers, body, overrides } = options;
  const requestConfig: AxiosRequestConfig = {
    headers,
    method,
    url,
    params,
    data: body,
    withCredentials: overrides?.WITH_CREDENTIALS ?? true,
  };

  try {
    const response = await axios(requestConfig);
    return {
      status: response.status,
      statusText: response.statusText!,
      data: response.data,
      headers: response.headers,
      config: response.config,
    };
  } catch (error) {
    const axiosError = error as AxiosError<Buffer>;
    if (axiosError.response) {
      return axiosError.response;
    }
    throw error;
  }
}
