import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BuyProducts } from '../../services/shopService'
interface basketItem {
    _id: number | string
    name: string
    price: number
    quantity: number
}

const BasketMain = (props: any) => {
    const router = useRouter()
    const [basket, setBasket] = useState<basketItem[]>([])

    useEffect(() => {
        getBasket()
    }, [])

    const getBasket = async () => {
        let basketData = await AsyncStorage.getItem('basket')
        if (basketData == null) basketData = JSON.stringify([])
        let basketArray = JSON.parse(basketData)
        setBasket(basketArray)
    }

    const handleProductBuy = async (productIndex: number) => {
        let sendData = {
            price: basket[productIndex].price * basket[productIndex].quantity,
            products: [
                {
                    _id: basket[productIndex]._id,
                    quantity: basket[productIndex].quantity,
                },
            ],
        }

        let response: any = await BuyProducts(sendData, props.token)
        if (response.status == 'OK') {
            router.push({
                pathname: '/',
            })
        } else {
            alert(response.response.data.message)
        }
    }

    const handleRemoveProduct = async (productIndex: number) => {
        let basketData = await AsyncStorage.getItem('basket')
        if (basketData == null) basketData = JSON.stringify([])
        let basketArray = JSON.parse(basketData)
        basketArray.splice(productIndex, 1)
        await AsyncStorage.setItem('basket', JSON.stringify(basketArray))
        setBasket(basketArray)
    }

    const removeBasket = async () => {
        await AsyncStorage.setItem('basket', JSON.stringify([]))
        setBasket([])
    }

    const handleBuyAll = async () => {
        let sendData: {
            price: number
            products: {
                _id: number | string
                quantity: number
            }[]
        } = {
            price: 0,
            products: [],
        }
        basket.forEach((item: basketItem) => {
            sendData.price += item.price * item.quantity
            sendData.products.push({
                _id: item._id,
                quantity: item.quantity,
            })
        })

        let response: any = await BuyProducts(sendData, props.token)
        if (response.status == 'OK') {
            removeBasket()
            router.push({
                pathname: '/',
            })
        } else {
            alert(response.response.data.message)
        }
    }

    return (
        <Layout user={props.xuser}>
            <div className="products">
                {basket.map((item: basketItem, index: number) => (
                    <div key={index} className="basketMain">
                        Name: {item.name}
                        {'\t'}
                        Price: {item.price}
                        {'\t'}
                        Quantity: {item.quantity}
                        <div
                            onClick={() => {
                                handleProductBuy(index)
                            }}
                        >
                            Buy single product
                        </div>
                        <div
                            onClick={() => {
                                handleRemoveProduct(index)
                            }}
                        >
                            Remove product
                        </div>
                    </div>
                ))}
                <div className="basketMain">
                    <div
                        onClick={() => {
                            handleBuyAll()
                        }}
                    >
                        Buy products
                    </div>
                    <div
                        onClick={() => {
                            removeBasket()
                        }}
                    >
                        Remove products
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export { BasketMain }
