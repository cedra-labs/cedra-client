import got, {
  OptionsOfBufferResponseBody,
  OptionsOfJSONResponseBody,
  RequestError,
  Response,
} from "got";
import { CookieJar } from "./cookieJar";
import { CedraClientRequest, CedraClientResponse } from "./types";

const cookieJar = new CookieJar();

/**
 * Used for JSON responses
 * @param requestOptions
 */
export default async function cedraClient<Res>(
  requestOptions: CedraClientRequest,
): Promise<CedraClientResponse<Res>> {
  return jsonRequest<Res>(requestOptions);
}

export async function jsonRequest<Res>(
  requestOptions: CedraClientRequest,
): Promise<CedraClientResponse<Res>> {
  const { params, method, url, headers, body } = requestOptions;

  const request: OptionsOfJSONResponseBody = {
    http2: true,
    searchParams: convertBigIntToString(params),
    method,
    url,
    responseType: "json",
    headers,
    hooks: {
      beforeRequest: [
        (options) => {
          const cookies = cookieJar.getCookies(new URL(options.url!));

          if (cookies?.length > 0 && options.headers) {
            /* eslint-disable no-param-reassign */
            options.headers.cookie = cookies
              .map((cookie: any) => `${cookie.name}=${cookie.value}`)
              .join("; ");
          }
        },
      ],
      afterResponse: [
        (response) => {
          if (Array.isArray(response.headers["set-cookie"])) {
            response.headers["set-cookie"].forEach((c) => {
              cookieJar.setCookie(new URL(response.url!), c);
            });
          }
          return response;
        },
      ],
    },
  };

  if (body) {
    if (body instanceof Uint8Array) {
      request.body = Buffer.from(body);
    } else {
      request.body = Buffer.from(JSON.stringify(body));
    }
  }

  try {
    const response = await got<Res>(request);
    return parseResponse<Res>(response);
  } catch (error) {
    const gotError = error as RequestError;
    if (gotError.response) {
      return parseResponse<Res>(gotError.response as Response<Res>);
    }
    throw error;
  }
}

/**
 * Used for binary responses, such as BCS outputs
 *
 * @experimental
 * @param requestOptions
 */
export async function bcsRequest(
  requestOptions: CedraClientRequest,
): Promise<CedraClientResponse<Buffer>> {
  const { params, method, url, headers, body } = requestOptions;

  const request: OptionsOfBufferResponseBody = {
    http2: true,
    searchParams: convertBigIntToString(params),
    method,
    url,
    responseType: "buffer",
    headers,
    hooks: {
      beforeRequest: [
        (options) => {
          const cookies = cookieJar.getCookies(new URL(options.url!));

          if (cookies?.length > 0 && options.headers) {
            /* eslint-disable no-param-reassign */
            options.headers.cookie = cookies
              .map((cookie: any) => `${cookie.name}=${cookie.value}`)
              .join("; ");
          }
        },
      ],
      afterResponse: [
        (response) => {
          if (Array.isArray(response.headers["set-cookie"])) {
            response.headers["set-cookie"].forEach((c) => {
              cookieJar.setCookie(new URL(response.url!), c);
            });
          }
          return response;
        },
      ],
    },
  };

  if (body) {
    if (body instanceof Uint8Array) {
      request.body = Buffer.from(body);
    } else {
      request.body = Buffer.from(JSON.stringify(body));
    }
  }

  try {
    switch (method) {
      case "GET":
        return parseResponse<Buffer>(await got.get(request));
      case "POST":
        return parseResponse<Buffer>(await got.post(request));
      default:
      // Do nothing, fall through
    }
  } catch (error) {
    const gotError = error as RequestError;
    if (gotError.response) {
      return parseResponse<Buffer>(gotError.response as Response<Buffer>);
    }
    throw error;
  }

  throw new Error(`Unsupported method: ${method}`);
}

function parseResponse<Res>(response: Response<Res>): CedraClientResponse<Res> {
  return {
    status: response.statusCode,
    statusText: response.statusMessage || "",
    data: response.body,
    config: response.request.options,
    request: response.request,
    response,
    headers: response.headers,
  };
}

/**
 * got supports only - string | number | boolean | null | undefined as searchParam value,
 * so if we have bigint type, convert it to string
 */
function convertBigIntToString(obj: any): any {
  const result: any = {};
  if (!obj) return result;

  Object.entries(obj).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof value === "bigint") {
        result[key] = String(value);
      } else {
        result[key] = value;
      }
    }
  });

  return result;
}
