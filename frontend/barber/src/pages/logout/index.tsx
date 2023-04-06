import React from 'react';
import { logoutVerification } from '@/components/Authorization/AuthorizationUtils';

const Index = () => {
    return (
        <div></div>
    )
}

export default Index;

export const getServerSideProps = async (context:any) => {
    return logoutVerification(context.req, context.res, {});
}