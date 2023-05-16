import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import { useDebounce } from '../utils/useDebounce'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Pagination } from '../utils/Pagination'
import { register } from '../../services/authService'
const RegisterMain = (props: any) => {
    console.log(props)
    const router = useRouter()
    const [userName, setUserName] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [confirmPassword, setConfirmPassword] = useState<string>()
    const handleRegister = async () => {
        console.log(userName)
        console.log(password)
        console.log(confirmPassword)
        if (
            userName == '' ||
            password == '' ||
            email == '' ||
            confirmPassword == ''
        )
            return
        if (password != confirmPassword) return
        console.log('SENDING REGISTER')
        let res: any = await register({
            username: userName,
            password: password,
            email: email,
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
                    UserName:
                    <input
                        type="text"
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Email:
                    <input
                        type="text"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Password:
                    <input
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Confirm Password:
                    <input
                        type="password"
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                    />
                </div>
                <button onClick={handleRegister}>Register</button>
                <button
                    onClick={() => {
                        router.push('/login')
                    }}
                >
                    login
                </button>
            </div>
        </Layout>
    )
}

export { RegisterMain }
