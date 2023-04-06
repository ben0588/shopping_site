import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useOutletContext, useSearchParams } from 'react-router-dom'
import ProductSidebar from './ProductSidebar'
import { BsSearch } from 'react-icons/bs'
import { FcLikePlaceholder } from 'react-icons/fc'
import { FcLike } from 'react-icons/fc'

import axios from 'axios'
import ProductCard from './ProductCard'
import styled from 'styled-components'
const ErrorDiv = styled.div`
    width: 100%;
    height: 100px;
    line-height: 100px;
    padding: 20xp;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bolder;
    color: #b00020;
`

function ProductSection() {
    const [filterProductData, subcategory, infoList, searchState, setSearchState, setIsGoToTop] = useOutletContext() // 取得全部商品資訊
    // console.log(filterProductData[0].products.length)

    // ... 新增判斷，當查詢無資料時，與於搜尋錯誤提示
    return filterProductData?.[0]?.products?.length !== 0 ? (
        <ProductCard />
    ) : (
        <ErrorDiv>搜尋內容不存在，請再重新查詢 !</ErrorDiv>
    )
}

export default ProductSection
