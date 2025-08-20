import serverApi from "../ServerApiClient"

export async function getUserInfo() {
    return await serverApi.get("/user/info")
        .catch(error => {
            console.log(error)
            return null;
        });

    return null;
}
