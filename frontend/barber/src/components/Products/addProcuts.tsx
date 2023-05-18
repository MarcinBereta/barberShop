import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Layout } from '../Layout/Layout'
import { addProduct } from '../../services/authService'

const AddProduct = (props: any) => {
    console.log(props)
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [category, setCategory] = useState<string>('')
    const handleAddProduct = async () => {
        if (name == '' || category == '') return
        if (price < 0 || quantity < 0) return
        console.log(name, price, quantity, category)
        let res: any = await addProduct(
            {
                name: name,
                price: price,
                quantity: quantity,
                category: category,
            },
            props.token
        )
        if (res.status == 'OK') {
            router.push({
                pathname: '/',
            })
        }
    }

    return (
        <Layout>
            <div className="loginForm">
                <div>
                    Name:
                    <input
                        type="text"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Price:
                    <input
                        type="number"
                        onChange={(e) => {
                            setPrice(parseInt(e.target.value))
                        }}
                    />
                </div>
                <div>
                    Quantity:
                    <input
                        type="number"
                        onChange={(e) => {
                            setQuantity(parseInt(e.target.value))
                        }}
                    />
                </div>
                <div>
                    Category:
                    <select onChange={(e) => setCategory(e.target.value)}>
                        <option value="shampoo">Shampoo</option>
                        <option value="conditioner">Hair conditioner</option>
                        <option value="mask">Mask</option>
                        <option value="oils">Oils</option>
                    </select>
                </div>
                <button onClick={handleAddProduct}>Add product</button>
            </div>
        </Layout>
    )
}

export { AddProduct }
