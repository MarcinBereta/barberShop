//@ts-ignore
import { serialize, parse } from 'cookie'
import { verify } from "@/services/authService"

const comparePermissions = (userPermissions:any, requiredPermissions:any) => {
    let binaryUser = parseInt(userPermissions).toString(2);
    let binaryRequired = parseInt(requiredPermissions).toString(2);

    while (binaryUser.length != binaryRequired.length) {
        if (binaryUser.length < binaryRequired.length) {
            binaryUser = "0" + binaryUser;
        } else {
            binaryRequired = "0" + binaryRequired;
        }
    }

    let authenticationSuccess = false;

    for (let i = 0; i < binaryUser.length; i++) {
        if (binaryUser[i] == binaryRequired[i] && binaryUser[i] == "1") {
            authenticationSuccess = true;
        }
    }

    return authenticationSuccess;
}


export const notAuthenticatedVerification = async (
    req:any,
    pageProps:any,
    permissions?:number
) => {
    let cookies = parse(req.headers?.cookie || '')

    if (!cookies.jwt_token) {
        return {
            props: {
                ...pageProps,
                xuser: null,
            },
        }
    }

    let response: any = await verify(cookies.jwt_token)
    if (!response.errors) {
        return {
            redirect: {
                permanent: false,
                destination: '/dashboard/panel',
            },
            props: {
                ...pageProps,
                xuser: null,
            },
        }
    }

    return {
        props: {
            ...pageProps,
            xuser: null,
        },
    }
}

export const authenticatedVerification = async (
    req:any,
    pageProps:any,
    permissions?:number
) => {
    let cookies = parse(req.headers?.cookie || '')

    if (!cookies.jwt_token) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
            props: {
                ...pageProps,
                xuser: null,
            },
        }
    }

    let verification: any = await verify(cookies.jwt_token)
    if (verification.errors) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
            props: {
                ...pageProps,
                xuser: null,
            },
        }
    }

    if (permissions && permissions > 0) {
        let authorized = comparePermissions(
            verification.data.verify.user.permissions,
            permissions
        )
        if (authorized == false) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/login',
                },
                props: {
                    ...pageProps,
                    xuser: null,
                },
            }
        }
    }

    return {
        props: {
            xuser: verification.data.verify.user,
            token: cookies.jwt_token,
            ...pageProps,
        },
    }
}