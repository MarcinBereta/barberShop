import React from 'react'
import Link from 'next/link'

const ShopListItem = ({
    product,
}: {
    product: {
        _id: number | string
        name: string
        price: number
        quantity: number
        category: string
    }
}) => {
    return (
        <tr className="productItem">
            <td className="productListItem">{product.name}</td>
            <td className="productListItem">{product.price}</td>
            <td className="productListItem">{product.quantity}</td>
            <td className="productListItem">{product.category}</td>

            <td className="productListItemButton">
                {/* <Link href={`/admin/app/groups/${item.id}`}> */}
                Buy product
                {/* </Link> */}
            </td>
        </tr>
    )
}

export { ShopListItem }
