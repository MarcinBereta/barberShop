import axios from "axios"
const API_URL = "http://127.0.0.1:4000"
export const login = async (data:any, token?:string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: "127.0.0.1:4000/auth/login",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (token ? token : "")
            },
            data: data
        })
            .then((result:any) => resolve(result.data))
            .catch((error:any) => resolve(error))
    })
}

export const getShopItems = async ( token?:string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: `${API_URL}/shop/getItems`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (token ? token : "")
            }
        })
            .then((result:any) => resolve(result.data))
            .catch((error:any) => resolve(error))
    })
}
