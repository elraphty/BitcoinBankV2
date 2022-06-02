import axios, { AxiosResponse } from "axios";

export const BASE_URL = 'http://localhost:5005/api/v1/';

axios.defaults.baseURL = BASE_URL;

export const postWithToken = async (url: string, body: Object, token: string | null): Promise<AxiosResponse> => {
    return axios.post(url, body, {
        headers: {
            Authorization: `BEARER ${token}`,
            'Content-type': 'application/json'
        }
    })
};
export const getWithToken = async (url: string, token: string | null): Promise<AxiosResponse>  => {
    return axios.get(url, {
        headers: {
            Authorization: `BEARER ${token}`,
            'Content-type': 'application/json'
        }
    });
};

export default axios;