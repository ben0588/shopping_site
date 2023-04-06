import { ReactComponent as LoveBeforeIcon } from '../../images/icon/love_1_icon.svg'
import { ReactComponent as LoveAfterIcon } from '../../images/icon/love_icon.svg'
import styled from 'styled-components'
import { Link, useOutletContext } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import ProductContext from '../../components/payment/ProductContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AuthContext from '../../components/auth/AuthContext'

const ProductColor = styled.input`
    margin: 10px 0 5px 15px;
    width: 26px;
    height: 26px;
    display: inline-block;
    accent-color: #636e72; // 變色
    position: absolute;
    right: 10px;
    bottom: 5px;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        background-color: ${(props) => props && props.color}; // 控制主要中心顏色
        border-radius: 50%;
        padding: 5%;
    }
`

const ProductCard = () => {
    const { contextValue } = useContext(AuthContext) // 管理會員驗證
    const { productContextValues } = useContext(ProductContext) // 管理商品上下本文
    const {
        state,
        handleAddCart,
        handleAddCartIsLoading,
        handleProductAddCart,
        handleProductAddWish,
        handleDeleteWishList,
        handleNumberToTw,
        handleProductDeleteWish,
    } = productContextValues // 結構出要的方法
    const [wishListData, setWishListData] = useState([]) // 取得願望清單
    const [firstWishList, setFirstWishList] = useState([]) // 初始願望清單

    const [filterProductData, subcategory, infoList, searchState, setSearchState, setIsGoToTop] = useOutletContext() // 取得全部商品資訊

    // 判斷商品創建日期，回傳 true 才給予 NEW 標籤
    const handleCreateDate = (productDate) => {
        const newTime = 30 // 熱門商品時間 (30天)
        const nowDate = new Date().getTime() // 當前時間
        let productTime = Date.parse(new Date(productDate)) // 取得商品上架時間
        productTime += 86400000 * newTime // 修改後的日期上限
        // Unix 時間轉換查詢 & 目標熱門移除時間
        // console.log('當前資料庫商品創建時間:', new Date(productDate).toLocaleDateString())
        // console.log('目標移除熱門標籤時間:', new Date(productTime).toLocaleDateString())
        // 商品時間大於等於當前時間
        if (productTime >= nowDate) {
            return true
        } else {
            return false
        }
    }

    // 監控檢查願望清單是否已存在
    useEffect(() => {
        if (state) {
            const { wishList } = state // 結構出來
            setFirstWishList(wishList) // 記錄初次願望清單
            const newList = wishList?.map((item) => item.id) // 取得在願望清單中的產品id
            setWishListData(newList) // 紀錄願望清單
        }
    }, [state])

    // 處理新增願望清單按鈕
    const handleAddWishListBtn = (data, item, filterId) => {
        const { pid, name, category, thumbnail, price, quantity, color, size } = data

        // 加入追蹤清單必須要登入會員系統
        // if (!contextValue.state.authToken && !contextValue.locationToken) {
        //     console.log('請登入會員')
        // }

        // 當篩選商品id存在時，再次點擊就是刪除願望清單
        if (filterId.length > 0 && filterId) {
            handleDeleteWishListBtn(item.pid)
        } else {
            handleProductAddWish(
                pid, // 商品編號
                name, // 名稱
                category, // 種類
                thumbnail, // 縮圖
                price, // 價格
                quantity, // 預設數量1
                color, // 顏色
                size // 預設第一個尺寸)}}
            )
        }
    }

    // 處理移除願望清單按鈕
    const handleDeleteWishListBtn = (id) => {
        const deleteId = wishListData.filter((item) => item !== id) // 比對願望商品pid跟送進去的id是否不同
        setWishListData(deleteId) // 改變當前控制愛心陣列
        const newWishList = state.wishList.filter((value) => value.id !== id) // id 不相同時改變
        handleProductDeleteWish(newWishList) // 改變 context 願望清單
    }

    // 判斷是否已加入追蹤清單
    const handleWishListIsOk = (id) => {
        if (id) {
            const checkList = productContextValues.state.wishList.filter((item) => item.id == id)
            return checkList.map((item) => item.id)
        }
    }

    return (
        <>
            <ToastContainer />
            {filterProductData?.map((items, index) => {
                return (
                    <React.Fragment key={index}>
                        {items?.products?.map((item, index) => {
                            const { pid, name, category, thumbnail, price, color, size, stock } = item
                            // 把願望清單進行篩選，對應卡片pid符合，後續才保持亮起愛心效果
                            const filterId = wishListData?.filter((id) => id === item.pid)
                            return (
                                <div className='product-card-container' key={item.pid}>
                                    <div className='product-card-imgContainer'>
                                        {/* 將進入商品詳情頁面... + 取消搜尋X符號*/}
                                        <Link
                                            to={`${item.pid}`}
                                            onClick={() => {
                                                setSearchState(false) // 關閉搜尋狀態
                                                setIsGoToTop(true)
                                            }}
                                        >
                                            <img className='product-card-img' src={item.thumbnail} alt={item.name} />
                                        </Link>
                                        <ProductColor
                                            type='radio'
                                            color={item.color} // 傳入顏色去控制對應 ::after 顏色
                                            defaultChecked
                                        />
                                    </div>
                                    <h4 className='product-card-name'>{item.name}</h4>
                                    <div className='product-card-typeContainer'>
                                        {/* <span className='product-card-type'>網球拍</span> */}
                                        <span className='product-card-subType'>{item.subCategory}</span>
                                    </div>
                                    {/* 未來可以做指定判斷才顯示特價區塊 */}
                                    <div className='product-card-price'>
                                        <span className='title'>售價:</span>
                                        {/* <span className='price' style={{ textDecoration: 'line-through' }}> */}
                                        <span className='price'>NT {handleNumberToTw(item.price)}</span>
                                    </div>
                                    {/* <div className='product-card-offPrice'>
                                        <span className='title'>特價:</span>
                                        <span className='price' style={{ color: 'red' }}>
                                            NT$ {item.price * item.discountPercentage * 0.1}
                                        </span>
                                    </div> */}
                                    <button
                                        className='product-card-addCart'
                                        type='button'
                                        onClick={() => {
                                            handleProductAddCart(
                                                pid, // 商品編號
                                                name, // 名稱
                                                category, // 種類
                                                thumbnail, // 縮圖
                                                price, // 價格
                                                1, // 預設數量1
                                                color, // 顏色
                                                size[0], // 預設第一個尺寸
                                                stock[0] // 預設第一個尺寸庫存
                                            )
                                        }}
                                    >
                                        加入購物車
                                    </button>

                                    <div
                                        className='product-wish-icons'
                                        title={`${filterId?.length > 0 ? '取消追蹤清單' : '加入追蹤清單'}`}
                                        onClick={() => {
                                            const data = {
                                                pid, // 商品編號
                                                name, // 名稱
                                                category, // 種類
                                                thumbnail, // 縮圖
                                                price, // 價格
                                                quantity: 1, // 預設數量1
                                                color, // 顏色
                                                size: size[0], // 預設第一個尺寸,
                                            }
                                            handleAddWishListBtn(data, item, filterId)
                                        }}
                                    >
                                        <LoveBeforeIcon
                                            className={`product-wish-before  ${
                                                // 當符合產品id時，把初始愛心隱藏
                                                filterId && filterId[0] === item.pid ? 'wish-hidden' : ''
                                            }`}
                                        />
                                        <LoveAfterIcon
                                            className={`product-wish-after ${
                                                // 當符合產品id時，把填充愛心顯示
                                                filterId && filterId[0] === item.pid ? 'wish-open' : ''
                                            }`}
                                        />
                                    </div>
                                    {/* 控制當創建商品上限30天後就隱藏NEW樣式 */}
                                    {handleCreateDate(item.createDate) && (
                                        <span className='product-card-new'>New!</span>
                                    )}
                                </div>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </>
    )
}
export default ProductCard
