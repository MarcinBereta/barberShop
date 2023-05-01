//@ts-ignore
import { serialize, parse } from 'cookie'
import { verify } from '@/services/authService'

const comparePermissions = (userPermissions: any, requiredPermissions: any) => {
    let binaryUser = parseInt(userPermissions).toString(2)
    let binaryRequired = parseInt(requiredPermissions).toString(2)

    while (binaryUser.length != binaryRequired.length) {
        if (binaryUser.length < binaryRequired.length) {
            binaryUser = '0' + binaryUser
        } else {
            binaryRequired = '0' + binaryRequired
        }
    }

    let authenticationSuccess = false

    for (let i = 0; i < binaryUser.length; i++) {
        if (binaryUser[i] == binaryRequired[i] && binaryUser[i] == '1') {
            authenticationSuccess = true
        }
    }

    return authenticationSuccess
}

export const notAuthenticatedVerification = async (
    req: any,
    pageProps: any,
    permissions?: number
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
    console.log(response)
    // console.log(req)
    // if (!response.errors && response.status != 'OK') {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: '/',
    //         },
    //         props: {
    //             ...pageProps,
    //             xuser: null,
    //         },
    //     }
    // }

    return {
        props: {
            ...pageProps,
            xuser: response.user || null,
            token: cookies.jwt_token,
        },
    }
}

export const authenticatedVerification = async (
    req: any,
    pageProps: any,
    permissions?: number
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

export const loginVerification = async (
    req: any,
    res: any,
    pageProps: any,
    permissions?: any
) => {
    let cookies = parse(req.headers?.jwt_token || '')

    if (!cookies.jwt_token) {
        const cookie = serialize('jwt_token', pageProps.token, {
            maxAge: 24 * 7 * 60 * 60,
            expires: new Date(Date.now() + 24 * 7 * 60 * 60 * 1000),
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
        })
        res.setHeader('Set-Cookie', cookie)
        let verification: any = await verify(pageProps.token)
        console.log(verification)
        if (verification.status != 'OK') {
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
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
            props: {
                xuser: verification.user,
                token: pageProps.token,
            },
        }
    }

    return {
        redirect: {
            permanent: false,
            destination: '/login',
        },
        props: {
            token: pageProps.token,
            xuser: null,
        },
    }
}

export const logoutVerification = async (
    req: any,
    res: any,
    pageProps: any
) => {
    const cookie = serialize('jwt_token', 'deleted', {
        maxAge: -1,
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })

    res.setHeader('Set-Cookie', cookie)

    return {
        redirect: {
            permanent: false,
            destination: '/login',
        },
        props: {
            xuser: null,
        },
    }
}
