import React from 'react'
import { Header } from './Header'

const Layout = (props: any) => {
    return (
        <div className="site">
            <Header user={props.user} />
            {props.children}
        </div>
    )
}

export { Layout }
