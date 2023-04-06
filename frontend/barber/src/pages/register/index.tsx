import { Inter } from 'next/font/google'
import { notAuthenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { RegisterMain } from '@/components/Register/RegisterMain'
const inter = Inter({ subsets: ['latin'] })

const Home = (props: any) => {
    return <RegisterMain {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await notAuthenticatedVerification(context.req, {}, 1)
    // if (data.props.xusr != null && data.props.xusr) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: '/',
    //         },
    //         props: {
    //             ...data.props,
    //         },
    //     }
    // }
    return data
}
