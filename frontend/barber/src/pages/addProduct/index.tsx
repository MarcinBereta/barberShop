import { authenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { AddProduct } from '@/components/Products/addProcuts'

const Home = (props: any) => {
    return <AddProduct {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await authenticatedVerification(context.req, {}, 1)

    // data.props.shopItems = shopItems.items;
    return data
}
