import React from 'react'
import { buyShopItem } from '../../services/shopService'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ShopListItem = ({
    product,
    token,
    refreshSite,
}: {
    product: {
        _id: number | string
        name: string
        price: number
        quantity: number
        category: string
    }
    token: string
    refreshSite: () => void
}) => {
    const handlePress = async () => {
        let basket = await AsyncStorage.getItem('basket')
        if (basket == null) 
            basket = JSON.stringify([])
        let basketArray = JSON.parse(basket)
        let itemExits = basketArray.find((item: any) => {
            return item._id == product._id
        })
        if (itemExits) {
            itemExits.quantity++
        } else {
           let tempProduct = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
           } 
              basketArray.push(tempProduct)
        }
        
        await AsyncStorage.setItem('basket', JSON.stringify(basketArray))
    }

    return (
        <tr className="productItem">
            <td className="productListItem">{product.name}</td>
            <td className="productListItem">{product.price}</td>
            <td className="productListItem">{product.quantity}</td>
            <td className="productListItem">{product.category}</td>

            <td
                className="productListItemButton"
                style={{ cursor: 'pointer' }}
                onClick={handlePress}
            >
                {/* <Link href={`/admin/app/groups/${item.id}`}> */}
                Buy product
                {/* </Link> */}
            </td>
        </tr>
    )
}

export { ShopListItem }
