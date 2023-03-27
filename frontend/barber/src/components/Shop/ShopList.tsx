import React from 'react'
import { Layout } from '../Layout/Layout'

const ShopList = (props:any)=> {
    console.log(props)
    return (
        <Layout>
            <div className='products'>
                {props.shopItems.map((item:any, index:number)=>{
                    return (
                        <div className='product'>
                            <div className='product_image'>
                                <img src={item.image} />
                            </div>
                            <div className='product_name'>
                                {item.name}
                            </div>
                            <div className='product_price'>
                                {item.price}
                            </div>
                            <div className='product_description'>
                                {item.description}
                            </div>
                        </div>
                    )
                })
                }
            </div>
        </Layout>
    )
}

export { ShopList }