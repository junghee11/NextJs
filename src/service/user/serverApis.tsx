import serverApi from "../ServerApiClient"
import { UserInfoResponse } from "../../types/user/user"

export async function getUserInfo() {
    return await serverApi.get<UserInfoResponse>("/user/info")
        .catch(error => {
            return null;
        });
}
