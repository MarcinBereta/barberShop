import React from 'react'
import Link from 'next/link'
import { buyShopItem } from '../../services/shopService'
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
        let response: any = await buyShopItem(product._id as string, token)
        console.log(response)
        if (response.status == 'OK') {
            console.log('OK')
            refreshSite()
        }
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
