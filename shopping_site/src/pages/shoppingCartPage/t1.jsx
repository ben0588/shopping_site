import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
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
        handleAllToggleCartChecked(true)
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
        toast.success('已成功加入追蹤清單', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
        })
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
        toast.info('已成功移除追蹤清單', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
        })
    }

    // 紀錄購物車內容在本地端(locationStorage)
    useEffect(() => {
        // 紀錄商品編號
        if (productContextValues.state) {
            const newList = productContextValues.state.cart.map((item, idex) => item.id)
            localStorage.setItem('cartList', newList)
        }
    }, [productContextValues.state])

    // 呼叫後端商品資料
    const handleGetProduct = async (list) => {
        try {
            const newCartList = list.map(async (item) => {
                const result = await axios.get('/productData_1.json')
                if (result) {
                    // 當送入的清單的id與呼叫api相同id才會返回
                    return result.data[0].products.filter((items) => items.pid == item)
                }
            })
            return newCartList
        } catch (error) {}
    }
    // 1.判斷當登入會員時，呼叫後端資料庫取得會員購物車資訊，在呼叫最新後端商品資料&庫存數量
    // 2.判斷沒登入會員時，取得locationStorage的cartList的商品id，在呼叫最新後端商品資料&庫存數量
    useEffect(() => {
        if (contextValue.state.authToken || contextValue.locationToken) {
            // ...開始呼叫後端會員資料中的購物車表
        } else {
            // ...取得本地端商品資訊，呼叫後端產品資料
            const localStorageCartId = localStorage.getItem('cartList')
            const newArray = localStorageCartId.split(',')
            ;(async () => {
                try {
                    const result = await handleGetProduct(newArray) // 呼叫api
                    const results = await Promise.all(result) // 將兩個承諾都等到後才執行
                    const newList = results.map((item) => item[0]) // 把多個陣列合併成單一陣列
                    // console.log(newList)
                    // ...把此格式改成加入購物車的格式，再次呼叫一次新增購物車方法
                } catch (error) {}
            })()
        }
    }, [])

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
                        <table className='shopping-table'>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type='checkbox'
                                            id='shopping-all-checkbox'
                                            checked={firstTotalState}
                                            onChange={(e) => handleFilterList(e, 'all')}
                                        />
                                        <label htmlFor='shopping-all-checkbox'>ALL</label>
                                    </th>
                                    <th>商品資訊</th>
                                    <th>優惠</th>
                                    <th>商品單價</th>
                                    <th>數量</th>
                                    <th>小計</th>
                                    <th>
                                        <button className='shopping-all-delete' onClick={() => handleDeleteAll()}>
                                            全部刪除
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productContextValues.state.cart.length > 0 &&
                                    productContextValues.state.cart.map((item, index) => {
                                        return (
                                            <tr className='shopping-products-items' key={item.id}>
                                                <td>
                                                    <input
                                                        type='checkbox'
                                                        checked={item.checked}
                                                        onChange={(e) => handleFilterList(e, item.id)}
                                                    />
                                                </td>
                                                <td className='shopping-product-info'>
                                                    <NavLink to={`/product/${item.id}`} title='回到商品詳情'>
                                                        <img src={item.thumbnail} alt={item.name} />
                                                    </NavLink>
                                                    <h4>
                                                        {item.name}[尺寸{item.size}][顏色{item.color}]
                                                    </h4>
                                                </td>
                                                <td>{/* 未來套用優惠資格 */}</td>
                                                <td>{handleNumberToTw(item.price)}</td>
                                                <td
                                                    className={`shopping-product-quantity ${
                                                        // 控制當數量 等於 庫存數量上限時，給予提示
                                                        item.quantity == item.sizeQuantity && 'stock-limit'
                                                    }`}
                                                >
                                                    <button onClick={() => handleQuantity(item.id, 'reduce')}>-</button>
                                                    {item.quantity}
                                                    <button
                                                        onClick={() =>
                                                            handleQuantity(item.id, 'add', item.sizeQuantity)
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </td>
                                                <td>{handleNumberToTw(item.price * item.quantity)}</td>
                                                <td className='shopping-product-btn'>
                                                    <AiOutlineClose
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
                                                                    const {
                                                                        id,
                                                                        name,
                                                                        category,
                                                                        thumbnail,
                                                                        price,
                                                                        color,
                                                                        size,
                                                                    } = item
                                                                    handleAddWishList(
                                                                        id,
                                                                        name,
                                                                        category,
                                                                        thumbnail,
                                                                        price,
                                                                        color,
                                                                        size
                                                                    )
                                                                }}
                                                                title='加入追蹤清單'
                                                            >
                                                                加入追蹤
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}

                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={2} className='shopping-total'>
                                        <span>合計：</span>
                                        <span>
                                            {/* 當給予初始狀態變數時，才會顯示初始總金額，或者由勾選決定的商品金額 */}
                                            NT
                                            {firstTotalState
                                                ? handleNumberToTw(productContextValues.state.total)
                                                : handleNumberToTw(total)
                                                ? handleNumberToTw(total)
                                                : null}
                                        </span>
                                    </td>
                                    <td>
                                        <NavLink
                                            to='payment'
                                            className='shopping-payment-btn'
                                            onClick={() => handlePage(2)}
                                        >
                                            前往結帳
                                        </NavLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div className='shopping-not-product'>目前尚未有商品</div>
                )}
            </div>
        </section>
    )
}

export default ShoppingCartSection
