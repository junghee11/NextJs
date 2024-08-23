import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {CookieValueTypes, getCookie, setCookie} from "cookies-next";
const apiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;

class ApiClient {
    private client : AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL : apiUrl,
            timeout : 10000, 
            headers : {
                'Content-Type' : 'application/json', 
            }
        });

        this.initializeInterceptors();
        
    }

    private initializeInterceptors() {
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const accessToken = getCookie("access_token");
                const refreshToken = getCookie("refresh_token");
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                    return config;
                } else if (refreshToken) {
                    // const body = {
                    //   type: "refresh",
                    // };

                    config.headers.Authorization = `Bearer ${refreshToken}`;
                    config.params.type = "refresh";

                    return config;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
              return response;
            },
            (error) => {
                console.log(error.response.data.message)
                return Promise.reject(error.response.data);
            }
          );
    }

    public get<T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> {
        return this.client.get<T>(url, { params });
    }

    public post<T>(url: string, body?:any): Promise<AxiosResponse<T>> {
        return this.client.post<T>(url, body);
    }

    public put<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
        return this.client.put<T>(url, data);
    }

    public delete<T>(url: string): Promise<AxiosResponse<T>> {
        return this.client.delete<T>(url);
    }
}

export default new ApiClient();