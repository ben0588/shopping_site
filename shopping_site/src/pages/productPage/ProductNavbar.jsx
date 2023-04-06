import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'

const ProductNavbar = ({ category, subcategory, searchState, handleProductAll }) => {
    // useEffect(() => {
    //     if (category) {
    //         const check = category.indexOf('Search')
    //         setCheckText(check) // 檢查搜尋文字是否有包含 Search 字樣
    //     }
    // }, [category])

    return (
        <nav className='product-navbar-content'>
            <NavLink className='product-navbar-items' to='' onClick={handleProductAll && handleProductAll}>
                全部商品
            </NavLink>
            <NavLink
                // 回到該種類全部商品
                to={`/product/?category=${category}`}
                // 當子類型搜尋項目不包含 Search 才顯示基本樣式，否則給於特定樣式
                className={`${searchState ? 'product-navbar-search' : 'product-navbar-items'} ${
                    category && 'product-navbar-category'
                }`}
                onClick={(e) => {
                    // 如果是搜尋狀態點擊將取消 Link 的觸發效果
                    if (searchState) {
                        e.preventDefault()
                    }
                }}
            >
                {category && `${category}`}
                {searchState && (
                    <AiOutlineClose
                        className='product-navbar-close-icon'
                        title='清除當前搜尋結果'
                        onClick={() => handleProductAll && handleProductAll()}
                    />
                )}
            </NavLink>
            {/* 加上判斷，子種類要顯示條件 = 種類要先選，才可以顯示 */}
            <NavLink className={`product-navbar-items ${category && subcategory && 'product-navbar-subcategory'}`}>
                {category && subcategory && ` ${subcategory}`}
            </NavLink>
        </nav>
    )
}
export default ProductNavbar
