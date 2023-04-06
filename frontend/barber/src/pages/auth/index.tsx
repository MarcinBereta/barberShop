import React from 'react'
import { loginVerification } from '@/components/Authorization/AuthorizationUtils'

const Index = () => {
    return <div></div>
}

export default Index

export const getServerSideProps = async (context:any) => {
    return loginVerification(context.req, context.res, {
        token: context.query.token,
    })
}