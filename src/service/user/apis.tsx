import { CookieValueTypes, getCookie, setCookie } from "cookies-next";
import api from "../ApiClient"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import axios from "axios";

export const userLogin = async (id: string, password: string) => {
    const result = await api.post(`/user/login`, {
        type: "login",
        userId: id,
        password: password
    }).then(response => {
        setCookie("access_token", response.token, {
            maxAge: 60 * 30,
        });

        window.location.reload();

        return response;
    })
    .catch(error => {
        alert(error.response.data.message);
    });
};

export const userSignUp = async ({ userId, password, name, nickname, phone, country, ip }: PostSignUp) => {
    const result = await api.post(`/user/signup`, {
        userId: userId,
        password: password,
        name : name,
        nickname : nickname,
        phone : phone,
        country : country,
        ip : ip
    }).then(response => {
        alert("회원가입이 완료되었습니다. 로그인 후 이용해주세요")

        // let path = sessionStorage.getItem("lastPath");
        // if (path) {
        //     window.location.href = path;
        // }
        window.location.href = "/";

        return response;
    })
    .catch(error => {
        alert(error.response.data.message);
    });
};

interface PostSignUp {
    userId:string
    password:string
    name:string
    nickname:string
    phone:string
    country:string
    ip:string
}

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

export const getClientInfo = async () => {
    const response = await axios.get('https://geolocation-db.com/json/');
    return response.data
}

export const checkUserId = async ( userId : string) => {
    const result = await api.get(`/user/check/id?userId=${userId}`).then(response => {
        alert(response.message);
        return true;
    })
    .catch(error => {
        alert(error.response.data.message);
        return false;
    });

    return result;
};

export const checkNickname = async ( nickname : string) => {
    const result = await api.get(`/user/check/nickname?nickname=${nickname}`).then(response => {
        alert(response.message);
        return true;
    })
    .catch(error => {
        alert(error.response.data.message);
        return false;
    });

    return result;
};

export const sendSmsUserPhone = async ( phone : string, type : string) => {
    const result = await api.post(`/user/phone-sms/verification-code`, {
        phone: phone,
        type : type
    }).then(response => {
        alert(response.message);
        return true;
    })
    .catch(error => {
        alert(error.response.data.message);
        return false;
    });

    return result;
};

export const checkUserPhone = async ( phone : string, code : string) => {
    const result = await api.post(`/user/check/phone`, {
        phone: phone,
        code : code
    }).then(response => {
        alert(response.message);
        return true;
    })
    .catch(error => {
        alert(error.response.data.message);
        return false;
    });

    return result;
};