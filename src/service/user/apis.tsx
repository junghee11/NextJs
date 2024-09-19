import { CookieValueTypes, getCookie, setCookie } from "cookies-next";
import api from "../ApiClient"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const userLogin = async (id: string, password: string) => {
    const result = await api.post(`/user/login`, {
        type: "login",
        userId: id,
        password: password
    }).then(response => {
        setCookie("access_token", response.token, {
            maxAge: 60 * 30,
        });

        // let path = sessionStorage.getItem("lastPath");
        // if (path) {
        //     window.location.href = path;
        // }
        window.location.reload();

        return response;
    })
    .catch(error => {
        alert(error.response.data.message);
    });
};

export async function getUserInfo(request?:RequestCookie) {
    if(request != undefined && typeof request.value === "string" && request.value !== ""){
        return await api.get("/user/info", {
            private: true,
            headers: {
                Authorization: `Bearer ${request.value}`
            }
        })
    } else if(getCookie("access_token") != undefined && typeof getCookie("access_token") === "string" && getCookie("access_token") !== ""){
        return await api.get("/user/info", {
            private: true,
            headers: {
                Authorization: `Bearer ${request.value}`
            }
        })
    }

    return null;
}