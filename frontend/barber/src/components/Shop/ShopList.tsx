import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import { useDebounce } from '../utils/useDebounce'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Pagination } from '../utils/Pagination'
import { ShopListItem } from './ShopListItem'

const ShopList = (props: any) => {
    console.log(props)
    const router = useRouter()

    let [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        refreshSite(1)
    }, [debouncedSearch])

    const refreshSite = (page: number) => {
        router.replace(
            router.pathname +
                '?page=' +
                page +
                '&debouncedsearch=' +
                debouncedSearch
        )
    }

    const setPage = (newPage: number): void => {
        router.replace(
            router.pathname +
                '?page=' +
                newPage +
                '&debouncedsearch=' +
                debouncedSearch
        )
    }

    const generateHeader = (): React.ReactElement[] => {
        let headerArr: React.ReactElement[] = []

        let headerItems: string[] = [
            'name',
            'price',
            'quantity',
            'category',
            'actions',
        ]

        headerItems.forEach((item: string, index: number) => {
            headerArr.push(
                <th className="productListHeaderItem">
                    <div>{item}</div>
                </th>
            )
        })
        return headerArr
    }

    const generateUserItems = (): React.ReactElement[] => {
        let userItemsArr: React.ReactElement[] = []
        console.log(props)
        for (let product of props.shopItems) {
            userItemsArr.push(<ShopListItem product={product} />)
        }
        return userItemsArr
    }

    return (
        <Layout user={props.xuser}>
            <div className="products">
                <div className="header-input">
                    <input
                        type="text"
                        className="search-inpu"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <PerfectScrollbar>
                    <table className="productsTable">
                        <thead>
                            <tr className="productItem">{generateHeader()}</tr>
                        </thead>
                        <tbody>{generateUserItems()}</tbody>
                    </table>
                </PerfectScrollbar>
                <div
                    className="paginationContainer"
                    style={{ marginTop: '10px' }}
                >
                    <Pagination
                        inside={true}
                        maxPages={
                            props.page.itemCount / 25 == 0
                                ? 1
                                : props.itemCount / 25
                        }
                        currentPage={parseInt(props.page)}
                        setPage={setPage}
                    />
                </div>
            </div>
        </Layout>
    )
}

export { ShopList }
