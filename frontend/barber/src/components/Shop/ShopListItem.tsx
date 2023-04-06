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
        <tr className="userListTr">
            <td className="userListItem">{product.name}</td>
            <td className="userListItem">{product.price}</td>
            <td className="userListItem">{product.quantity}</td>
            <td className="userListItem">{product.category}</td>

            <td className="userListItem">
                {/* <Link href={`/admin/app/groups/${item.id}`}> */}
                Buy product
                {/* </Link> */}
            </td>
        </tr>
    )
}

export { ShopListItem }
