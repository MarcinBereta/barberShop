import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ShopList } from '@/components/Shop/ShopList'
import { notAuthenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { getShopItems } from '@/services/shopService'
const inter = Inter({ subsets: ['latin'] })

const  Home = (props:any)=> {
  return (
   <ShopList {...props}/>
  )
}

export default Home


export const getServerSideProps = async (context:any) => {
  let data = await notAuthenticatedVerification(context.req,  {}, 1);
  let shopItems:any = await getShopItems();
  // return data
  if(shopItems.status == 'OK'){
    console.log(shopItems)
    data.props.shopItems = shopItems.items;    
  }
      // data.props.shopItems = shopItems.items;
  return data;
}