import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import {getCookie, setCookie} from "cookies-next";
const apiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;

const baseURL = apiUrl;
export const Axios = axios.create({
    timeout:7500,
    baseURL
})

interface AxiosCustomConfig extends AxiosRequestConfig {
    private?: boolean;
}

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
                // const accessToken = getCookie("access_token");
                // const refreshToken = getCookie("refresh_token");
                const accessToken = Cookies.get('access_token');
                const refreshToken = Cookies.get('refresh_token');
                console.log("accessToken = ", accessToken);
                
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

    public async get<T>(url: string, config?: AxiosCustomConfig) {
        const result = await Axios.get<T>(url, config);
        return result.data;
    }

    public async post<T>(url: string, body?:any, config?: AxiosCustomConfig) {
        const result = await Axios.post<T>(url, body, config);
        return result.data;
    }

    public async put<T>(url: string, body?:any, config?: AxiosCustomConfig) {
        const result = await Axios.put<T>(url, body, config);
        return result.data;
    }

    public async delete<T>(url: string, config?: AxiosCustomConfig) {
        const result = await Axios.delete<T>(url, config);
        return result.data;
    }
}

export default new ApiClient();