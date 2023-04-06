import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import { useRouter } from 'next/router'

const Header = (props: any) => {
    const router = useRouter()
    const options = [
        [
            { value: 'products', label: 'Products' },
            { value: 'basket', label: 'basket' },
            { value: 'logout', label: 'Logout' },
            { value: 'shopHistory', label: 'history' },
        ],
        [
            { value: 'products', label: 'Products' },
            { value: 'basket', label: 'basket' },
            { value: 'login', label: 'Login' },
            { value: 'register', label: 'Register' },
        ],
    ]

    const [currentValue, setCurrentValue] = useState(0)
    const [userType, setUserType] = useState(0)
    useEffect(() => {
        console.log(props.user)
        if (props.user != null && props.user != undefined) {
            console.log(`User ${props.user}`)
            setUserType(0)
            if (router.pathname == '/products' || router.pathname == '/') {
                setCurrentValue(0)
            } else if (router.pathname == '/basket') {
                setCurrentValue(1)
            } else if (router.pathname == '/shopHistory') {
                setCurrentValue(3)
            }
        } else {
            setUserType(1)
            if (router.pathname == '/products' || router.pathname == '/') {
                setCurrentValue(0)
            } else if (router.pathname == '/basket') {
                setCurrentValue(1)
            } else if (router.pathname == '/login') {
                setCurrentValue(2)
            } else if (router.pathname == '/register') {
                setCurrentValue(3)
            }
        }
    }, [])

    return (
        <div className="header">
            <div className="header_logo">LOGO</div>
            <div className="header_dropdown">
                <div
                    style={{
                        width: '60%',
                        backgroundColor: 'transparent',
                    }}
                ></div>
                <Dropdown
                    options={options[userType]}
                    onChange={(e) => {
                        router.push(`/${e.value}`)
                    }}
                    value={options[userType][currentValue]}
                    placeholder="Menu"
                    className="dropdownMain"
                    menuClassName="dropDownMenu"
                />
            </div>
        </div>
    )
}

export { Header }
