import axios from "axios"

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

export const verify = async ( token?:string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: "127.0.0.1:4000/auth/verify",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (token ? token : "")
            }
        })
            .then((result:any) => resolve(result.data))
            .catch((error:any) => resolve(error))
    })
}
