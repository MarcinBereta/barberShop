import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import { useDebounce } from '../utils/useDebounce'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Pagination } from '../utils/Pagination'
import { login } from '../../services/authService'
const LoginMain = (props: any) => {
    console.log(props)
    const router = useRouter()
    const [userName, setUserName] = useState<string>()
    const [password, setPassword] = useState<string>()

    const handleLogin = async () => {
        if (userName == '' || password == '') return
        let res: any = await login({
            username: userName,
            password: password,
        })
        if (res.status == 'OK') {
            router.push({
                pathname: '/auth',
                query: { token: res.data.token.toString() },
            })
        }
    }

    return (
        <Layout>
            <div className="loginForm">
                <div>
                    Username:
                    <input
                        type="text"
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Password:
                    <input
                        type="text"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>
                <button onClick={handleLogin}>Login</button>
                <button
                    onClick={() => {
                        router.push('/register')
                    }}
                >
                    Register
                </button>
            </div>
        </Layout>
    )
}

export { LoginMain }
