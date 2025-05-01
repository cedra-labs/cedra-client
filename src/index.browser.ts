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
  const headers = new Headers();
  Object.entries(options?.headers ?? {}).forEach(([key, value]) => {
    headers.append(key, String(value));
  });
  if (options.method === "POST") {
    headers.append("Content-Type", "application/json");
  }

  const requestConfig: RequestInit = {
    method: options.method,
    headers,
    body: JSON.stringify(options.body),
    credentials: options.overrides?.WITH_CREDENTIALS ?? "include",
  };

  const params = new URLSearchParams();
  Object.entries(options.params).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  const res = await fetch(`${options.url}?${params}`, requestConfig);
  const data = await res.json();

  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig,
  };
}

/**
 * Used for binary responses, such as BCS outputs
 *
 * @experimental
 * @param options
 */
export async function bcsRequest(
  options: AptosClientRequest,
): Promise<AptosClientResponse<ArrayBuffer>> {
  const headers = new Headers();
  Object.entries(options?.headers ?? {}).forEach(([key, value]) => {
    headers.append(key, String(value));
  });
  if (options.method === "POST") {
    headers.append("Content-Type", "application/json");
  }

  const requestConfig: RequestInit = {
    method: options.method,
    headers,
    body: JSON.stringify(options.body),
    credentials: options.overrides?.WITH_CREDENTIALS ?? "include",
  };

  const params = new URLSearchParams();
  Object.entries(options.params).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  const res = await fetch(`${options.url}?${params}`, requestConfig);
  const data = await res.arrayBuffer();

  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig,
  };
}
