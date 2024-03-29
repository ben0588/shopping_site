import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { NavLink, useOutletContext } from 'react-router-dom'
import AuthContext from '../../components/auth/AuthContext'
import ProductContext from '../../components/payment/ProductContext'
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ShoppingCartSection() {
    const { contextValue } = useContext(AuthContext) // 會員管理
    const { productContextValues } = useContext(ProductContext) // 購物車商品資訊
    const {
        handleChangeQuantity,
        handleProductDeleteCart,
        handleProductAddWish,
        handleProductDeleteWish,
        handleToggleCartChecked,
        handleAllToggleCartChecked,
        handleNumberToTw,
    } = productContextValues
    const [total, setTotal] = useState(null) // 後續篩選金額
    const [firstTotalState, setFirstTotalState] = useState(true) // 判斷顯示總金額
    const [checkedNumber, setCheckedNumber] = useState(null) // 已勾選商品數量
    const { handlePage } = useOutletContext()

    // 處理控制商品數量
    const handleQuantity = (id, type, sizeQuantity) => {
        // 把目標id篩選出來
        const filterList = productContextValues.state.cart.filter((item, index) => item.id === id)
        // 數量加總
        const changeList = filterList.map((item) => {
            return {
                ...item,
                quantity:
                    // 新增時數量+1，不可大於商品庫存數量，減少時數量-1，不可少於1
                    type === 'add' && item.quantity < sizeQuantity
                        ? item.quantity + 1
                        : type === 'reduce' && item.quantity > 1
                        ? item.quantity - 1
                        : item.quantity,
            }
        })
        handleChangeQuantity(...changeList) // 更新商品數量
    }

    // 移除商品資訊
    const handleDelete = (id, name) => {
        // 把非目標內容找出來
        const filterList = productContextValues.state.cart.filter((item, index) => item.id !== id)
        Swal.fire({
            title: '確認刪除?',
            text: `確認刪除購物車 ${name} 商品?`,
            icon: 'question',
            confirmButtonText: '確認刪除', // 確認按鈕文字
            confirmButtonColor: '#b00020', // 確認按鈕顏色
            // allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
            showCloseButton: true, // 顯示關閉按鈕
            showCancelButton: true, // 顯示取消按鈕
            cancelButtonText: '取消', // 取消按鈕文字
        }).then((result) => {
            // 按下確認才會刪除成功
            if (result.isConfirmed) {
                handleProductDeleteCart(filterList) // 更新當前購物車狀態
            }
        })
    }

    // 移除全部商品資訊
    const handleDeleteAll = () => {
        Swal.fire({
            title: '刪除全部?',
            text: '確定刪除購物車內所有商品?',
            icon: 'question',
            confirmButtonText: '確認刪除', // 確認按鈕文字
            confirmButtonColor: '#b00020', // 確認按鈕顏色
            // allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
            showCloseButton: true, // 顯示關閉按鈕
            showCancelButton: true, // 顯示取消按鈕
            cancelButtonText: '取消', // 取消按鈕文字
        }).then((result) => {
            // 按下確認才會刪除成功
            if (result.isConfirmed) {
                handleProductDeleteCart([])
                localStorage.clear()
            }
        })
    }

    // 判斷是否已加入追蹤清單
    const handleWishListIsOk = (id) => {
        if (id) {
            const checkList = productContextValues.state.wishList.filter((item) => item.id == id)
            return checkList.map((item) => item.id)
        }
    }

    // 篩選購物車商品
    const handleFilterList = (e, id) => {
        if (id === 'all') {
            // 判斷總金額選擇是否顯示總金額 + 將全部商品給予勾選狀態
            e.target.checked === true ? (
                <>
                    {setFirstTotalState(true)}
                    {handleAllToggleCartChecked(true)}
                </>
            ) : (
                <>
                    {setFirstTotalState(false)}
                    {handleAllToggleCartChecked(false)}
                </>
            )
        } else {
            // 當點擊單一對應商品的確認方塊時
            setFirstTotalState(false) // 關閉總金額
            handleToggleCartChecked(id, e.target.checked) // 更改勾選狀態
        }
    }

    // 初始勾選全部商品狀態
    useEffect(() => {
        // 當購物車清單中有未選擇的情況，全選不打勾，新增商品預設是打勾的
        const checkLocalStorageCartList = productContextValues.state.cart.filter((item) => item.checked === false)
        if (checkLocalStorageCartList.length > 0) {
            setFirstTotalState(false) // 預設全選狀態關閉
        }
    }, [])

    // 監控勾選商品的金額顯示
    useEffect(() => {
        const newTotal = productContextValues.state.cart
            .filter((item, index) => {
                if (item.checked) {
                    return item
                }
            })
            .map((item) => parseInt(item.price) * item.quantity)
        setCheckedNumber(newTotal.length) // 更新勾選數量
        const sumTotal = newTotal.reduce((acc, cur) => acc + cur, 0) // 加總金額
        setTotal(sumTotal) // 更新金額
    }, [productContextValues.state.cart])

    // 新增願望清單
    const handleAddWishList = (id, name, category, thumbnail, price, color, size) => {
        handleProductAddWish(id, name, category, thumbnail, price, color, size)

        // ...當有會員權限才可以新增
        // if (contextValue.state.authToken || contextValue.locationToken) {
        //     handleProductAddWish(id, name, category, thumbnail, price, color, size)
        // } else {
        //     console.log('請先登入會員')
        // }
    }

    // 移除願望清單
    const handleDeleteWishList = (id) => {
        const filterList = productContextValues.state.wishList.filter((item) => item.id !== id)
        handleProductDeleteWish(filterList) // 更新願望清單
    }

    const typeList = [
        { title: '全選' },
        { title: '商品資訊' },
        { title: '優惠' },
        { title: '商品單價' },
        { title: '數量' },
        { title: '小計' },
        { title: '全部刪除' },
    ]

    return (
        <section className='shopping-container'>
            <ToastContainer />
            <div className='shopping-content'>
                <h3 className='shopping-title'>購物車資訊</h3>
                <hr />
                {productContextValues.state.cart.length > 0 ? (
                    <>
                        <div className='shopping-subtitle'>
                            購物車 (共 {productContextValues.state.cart.length} 樣商品 | 已選擇 {checkedNumber} 樣商品)
                        </div>
                        <ul className='shopping-type-list'>
                            {typeList.map((item, index) => (
                                <li key={index} className='shopping-type-items'>
                                    {/* 當標題是全選才會有checkbox，刪除的話則是對應按鈕，最後則是各欄位名稱 */}
                                    {item.title === '全選' ? (
                                        <>
                                            <input
                                                type='checkbox'
                                                id='shopping-all-checkbox'
                                                checked={firstTotalState}
                                                onChange={(e) => handleFilterList(e, 'all')}
                                            />
                                            <label htmlFor='shopping-all-checkbox'>{item.title}</label>
                                        </>
                                    ) : item.title === '全部刪除' ? (
                                        <button className='shopping-all-delete' onClick={() => handleDeleteAll()}>
                                            {item.title}
                                        </button>
                                    ) : (
                                        item.title
                                    )}
                                </li>
                            ))}
                        </ul>
                        {productContextValues.state.cart.map((item, index) => (
                            <ul className='sopping-cart-list' key={item.id}>
                                <li>
                                    <input
                                        type='checkbox'
                                        checked={item.checked}
                                        onChange={(e) => handleFilterList(e, item.id)}
                                    />
                                </li>
                                <li>
                                    <NavLink to={`/product/${item.id}`} title='回到商品詳情'>
                                        <img src={process.env.PUBLIC_URL + item.thumbnail} alt={item.name} />
                                    </NavLink>
                                    <h4>
                                        {item.name}
                                        <br />
                                        [尺寸:{item.size}]<br />
                                        [顏色:{item.color}]
                                    </h4>
                                </li>
                                <li>{/* 未來套用優惠資格 */}</li>
                                <li>{handleNumberToTw(item.price)}</li>
                                <li
                                    className={` ${
                                        // 控制當數量 等於 庫存數量上限時，給予提示
                                        item.quantity == item.sizeQuantity && 'stock-limit'
                                    }`}
                                >
                                    <span className='sopping-quantity-btn'>
                                        <button onClick={() => handleQuantity(item.id, 'reduce')}>-</button>
                                        {item.quantity}
                                        <button onClick={() => handleQuantity(item.id, 'add', item.sizeQuantity)}>
                                            +
                                        </button>
                                    </span>
                                </li>
                                <li>{handleNumberToTw(item.price * item.quantity)}</li>
                                <li>
                                    <RiDeleteBin6Fill
                                        className='delete-icon'
                                        onClick={() => handleDelete(item.id, item.name)} // 刪除商品
                                        title='移除商品'
                                    />
                                    {handleWishListIsOk(item.id) == item.id ? (
                                        <>
                                            <button
                                                title='移除追蹤清單'
                                                className='product-delete-wish'
                                                onClick={() => handleDeleteWishList(item.id)}
                                            >
                                                移除追蹤
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    const { id, name, category, thumbnail, price, color, size } = item
                                                    handleAddWishList(id, name, category, thumbnail, price, color, size)
                                                }}
                                                title='加入追蹤清單'
                                            >
                                                加入追蹤
                                            </button>
                                        </>
                                    )}
                                </li>
                            </ul>
                        ))}

                        <ul className='shopping-orders-list'>
                            <h3>訂單資訊</h3>
                            <li>
                                <span>小計：</span>
                                <span>
                                    {/* 當給予初始狀態變數時，才會顯示初始總金額，或者由勾選決定的商品金額 */}
                                    NT
                                    {firstTotalState
                                        ? handleNumberToTw(productContextValues.state.total)
                                        : handleNumberToTw(total)
                                        ? handleNumberToTw(total)
                                        : null}
                                </span>
                            </li>
                            <li>運費：免運</li>
                            <li>
                                合計{checkedNumber ? `(${checkedNumber})` : null}：{handleNumberToTw(total)}
                            </li>
                            <li>
                                <NavLink to='payment' className='shopping-payment-btn' onClick={() => handlePage(2)}>
                                    前往結帳
                                </NavLink>
                            </li>
                        </ul>
                    </>
                ) : (
                    <div className='shopping-not-product'>目前尚未有商品</div>
                )}
            </div>
        </section>
    )
}

export default ShoppingCartSection
