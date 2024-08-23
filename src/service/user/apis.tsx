import { setCookie } from "cookies-next";
import {CookieValueTypes, getCookie} from "cookies-next";
import api from "../ApiClient"

export const userLogin = async (id: string, password: string) => {
    const result = await api.post(`/user/login`, {
        type: "login",
        userId: id,
        password: password
    }).then(response => {
        setCookie("access_token", response.data.token, {
            maxAge: 60 * 30,
        });

        window.location.reload();
        // let path = sessionStorage.getItem("lastPath");
        // if (path) {
        //     window.location.href = path;
        // }

        return response;
    })
    .catch(error => {
        error.message
        window.location.href = "/user/login";
    });
};

export async function getUserInfo(token?:CookieValueTypes) {
    if(!token && !getCookie("access_token")){
        return null;
    }

    const response = await api.get('/user/info')
    return response.data;
}