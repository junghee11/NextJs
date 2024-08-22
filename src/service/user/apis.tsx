const apiUrl = process.env.NEXT_DEV_API_URL;
import { setCookie } from "cookies-next";
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

        return response;
    })
    .catch(error => {
        error.message
        window.location.href = "/user/login";
    });
};

export async function getUserInfo() {
    const response = await api.get('/user/info')
    return response.data;
}