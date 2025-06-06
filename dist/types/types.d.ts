export type CedraClientResponse<Res> = {
    status: number;
    statusText: string;
    data: Res;
    config?: any;
    request?: any;
    response?: any;
    headers?: any;
};
export type CedraClientRequest = {
    url: string;
    method: "GET" | "POST";
    body?: any;
    params?: any;
    headers?: any;
    overrides?: any;
};
