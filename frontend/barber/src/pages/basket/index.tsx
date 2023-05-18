import { authenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { BasketMain } from '@/components/Basket/BasketMain'

const Home = (props: any) => {
    return <BasketMain {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await authenticatedVerification(context.req, {}, 1)
   
    // data.props.shopItems = shopItems.items;
    return data
}
