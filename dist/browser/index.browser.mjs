// src/index.browser.ts
async function cedraClient(options) {
  return jsonRequest(options);
}
async function jsonRequest(options) {
  const { requestUrl, requestConfig } = buildRequest(options);
  const res = await fetch(requestUrl, requestConfig);
  const data = await res.json();
  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig
  };
}
async function bcsRequest(options) {
  const { requestUrl, requestConfig } = buildRequest(options);
  const res = await fetch(requestUrl, requestConfig);
  const data = await res.arrayBuffer();
  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig
  };
}
function buildRequest(options) {
  var _a, _b, _c;
  const headers = new Headers();
  Object.entries((_a = options == null ? void 0 : options.headers) != null ? _a : {}).forEach(([key, value]) => {
    headers.append(key, String(value));
  });
  const body = options.body instanceof Uint8Array ? options.body : JSON.stringify(options.body);
  const withCredentialsOption = (_b = options.overrides) == null ? void 0 : _b.WITH_CREDENTIALS;
  let credentials;
  if (withCredentialsOption === false) {
    credentials = "omit";
  } else if (withCredentialsOption === true) {
    credentials = "include";
  } else {
    credentials = withCredentialsOption != null ? withCredentialsOption : "include";
  }
  const requestConfig = {
    method: options.method,
    headers,
    body,
    credentials
  };
  const params = new URLSearchParams();
  Object.entries((_c = options.params) != null ? _c : {}).forEach(([key, value]) => {
    if (value !== void 0) {
      params.append(key, String(value));
    }
  });
  const requestUrl = options.url + (params.size > 0 ? `?${params.toString()}` : "");
  return { requestUrl, requestConfig };
}
export {
  bcsRequest,
  cedraClient as default,
  jsonRequest
};
//# sourceMappingURL=index.browser.mjs.map