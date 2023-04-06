import React from 'react'
import clsx from 'clsx'

//If use Inside of component set "inside" property in tag to true (ex. <Pagination inside={true} />"

const Pagination = (props: any) => {
    const generateItems = () => {
        let children = []

        for (let i = props.currentPage - 3; i <= props.currentPage + 3; i++) {
            if (i == props.currentPage) {
                children.push(
                    <li key={i} className="active">
                        <a>{i}</a>
                    </li>
                )
            } else if (i >= 1 && i <= props.maxPages) {
                if (Math.abs(props.currentPage - i) <= 2) {
                    children.push(
                        <li
                            key={i}
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(i)
                            }}
                        >
                            <a>{i}</a>
                        </li>
                    )
                } else if (i == 1 || i == props.maxPages) {
                    children.push(
                        <li
                            key={i}
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(i)
                            }}
                        >
                            <a>{i}</a>
                        </li>
                    )
                }
            }
        }

        return children
    }

    return (
        <div>
            <ul className={props.inside ? 'pagination-inside' : 'pagination'}>
                <li
                    className={
                        props.currentPage == 1
                            ? 'pagination-chevron-disabled'
                            : 'pagination-chevron'
                    }
                    onClick={() => {
                        if (props.currentPage != 1) {
                            props.setPage(parseInt(props.currentPage) - 1)
                        }
                    }}
                >
                    <a>
                        <i
                            className="material-icons"
                            style={{ lineHeight: 'inherit' }}
                        >
                            {'<'}
                        </i>
                    </a>
                </li>
                {props.currentPage > 4 ? (
                    <span>
                        <li
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(1)
                            }}
                        >
                            <a>1</a>
                        </li>
                        <li className="disabled" style={{ marginLeft: '15px' }}>
                            <a>...</a>
                        </li>
                    </span>
                ) : (
                    <span></span>
                )}
                {generateItems()}
                {props.currentPage < props.maxPages - 3 ? (
                    <span>
                        <li
                            className="disabled"
                            style={{ marginRight: '15px' }}
                        >
                            <a>...</a>{' '}
                        </li>
                        <li
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(props.maxPages)
                            }}
                        >
                            <a>{props.maxPages}</a>
                        </li>
                    </span>
                ) : (
                    <span></span>
                )}
                <li
                    className={
                        props.currentPage == props.maxPages
                            ? 'pagination-chevron-disabled'
                            : 'pagination-chevron'
                    }
                    onClick={() => {
                        if (props.currentPage != props.maxPages) {
                            props.setPage(parseInt(props.currentPage) + 1)
                        }
                    }}
                >
                    <a>
                        <i
                            className="material-icons"
                            style={{ lineHeight: 'inherit' }}
                        >
                            {'>'}
                        </i>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export { Pagination }
