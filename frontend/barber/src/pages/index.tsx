import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ShopList } from '@/components/Shop/ShopList'
import { notAuthenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { getShopItems } from '@/services/shopService'
const inter = Inter({ subsets: ['latin'] })

const  Home = (props:any)=> {
  return (
   <ShopList />
  )
}

export default Home


export const getServerSideProps = async (context:any) => {
  let data = await notAuthenticatedVerification(context.req,  {}, 1);
  let shopItems:any = await getShopItems();
  console.log(shopItems)
  return data
  // if(shopItems.status == 'OK')
  //   // data.props.shopItems = shopItems.items;
  return data;
}