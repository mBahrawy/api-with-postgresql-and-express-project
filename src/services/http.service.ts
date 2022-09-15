import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { Service } from "typedi";
import * as dotenv from "dotenv";

dotenv.config();

const {
    NODE_ENV,
    APP_BACKEND_BASE_URL_test,
    APP_BACKEND_PORT_TEST,
    APP_BACKEND_BASE_URL_development,
    APP_BACKEND_PORT_DEVELOPMENT,
    APP_BACKEND_BASE_URL_production,
    APP_BACKEND_PORT_PRODUCTION
} = process.env;

@Service()
export class HttpService {
    private _getBaseUrl() {
        if (NODE_ENV === "development") {
            return `${APP_BACKEND_BASE_URL_development}:${APP_BACKEND_PORT_DEVELOPMENT}`;
        }
        if (NODE_ENV === "production") {
            return `${APP_BACKEND_BASE_URL_production}:${APP_BACKEND_PORT_PRODUCTION}`;
        }
        if (NODE_ENV === "test") {
            return `${APP_BACKEND_BASE_URL_test}:${APP_BACKEND_PORT_TEST}`;
        }
    }

    public getRequset = async (route: string, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.get(`${this._getBaseUrl}${route}`, config);
    };
    public postRequest = async (route: string, data: unknown, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.post(`${this._getBaseUrl}${route}`, data, config);
    };
    public deleteRequest = async (route: string, id: unknown, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.post(`${this._getBaseUrl}${route}`, id, config);
    };
    public putRequest = async (route: string, data: unknown, config: AxiosRequestConfig<unknown>): Promise<AxiosPromise> => {
        return await axios.post(`${this._getBaseUrl}${route}`, data, config);
    };
}
