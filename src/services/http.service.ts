import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { Service } from "typedi";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

@Service()
export class HttpService {
    private _baseUrl = `${process.env.APP_BACKEND_BASE_URL}:${process.env.APP_BACKEND_PORT}`;

    public getRequset = async (route: string, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.get(`${this._baseUrl}${route}`, config);
    };
    public postRequest = async (route: string, data: unknown, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.post(`${this._baseUrl}${route}`, data, config);
    };
    public deleteRequest = async (route: string, id: unknown, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.post(`${this._baseUrl}${route}`, id, config);
    };
    public putRequest = async (route: string, data: unknown, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.post(`${this._baseUrl}${route}`, data, config);
    };
}
