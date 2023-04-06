import { createContext, useContext, useEffect, useReducer } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// 創建初始狀態值
const initialState = {
    cart: [],
    wishList: [],
    isLoading: false,
}

// 設定購物車預設 + 創建 useContext 上下本文
const ProductContext = createContext(initialState)

// 處理購物車總金額
const handleTotalPrice = (list) => {
    // 使用 reduce 累加總金額, 當前的值+當前的值,從0開始算
    return list.map((item) => item.price * item.quantity).reduce((acc, cur) => acc + cur, 0)
}

// 創建 Provider 環境
export const ProductProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        const newCartList = [...state.cart] // 取出預設購物車，後續用push更新購物車
        const newWishList = [...state.wishList] // 取出預設願望清單，後續用push更新願望清單
        const index = newCartList.findIndex((item) => item.id === action?.payload?.id) // 判斷是否已有加入到購物車內 (-1 等於沒有,0等於有)
        const indexWish = newWishList.findIndex((item) => item.id === action?.payload?.id)
        switch (action.type) {
            case 'ADD_CART':
                if (index === -1) {
                    // 商品id不存在時直接新增
                    newCartList.push(action.payload)
                } else {
                    // 商品已存在時，把數量累加
                    newCartList[index].quantity += action.payload.quantity
                }
                return {
                    ...state,
                    cart: newCartList,
                    total: handleTotalPrice(newCartList), // 計算總金額
                }
            case 'DELETE_CART':
                return {
                    ...state,
                    cart: action.payload, // 過濾要刪除的目標後重新加入購物車內
                    total: handleTotalPrice(action.payload), // 計算總金額
                }
            case 'CHANGE_CART_QUANTITY': // 改變商品數量
                newCartList[index].quantity = action.payload.quantity
                // console.log(newCartList[index].quantity)
                // console.log(action.payload.quantity)
                return {
                    ...state,
                    cart: newCartList,
                    total: handleTotalPrice(newCartList),
                }
            case 'ADD_CART_STATE': // 加載狀態
                return {
                    ...state,
                    isLoading: action.payload,
                }
            case 'TOGGLE_CART_STATE': // 改變勾選狀態
                const newList = newCartList.map((item) => {
                    // 勾選相同id才會改變狀態
                    if (item.id === action.payload.id) {
                        item.checked = action.payload.state
                    }
                    return item
                })
                return {
                    ...state,
                    cart: newList,
                    total: handleTotalPrice(newList), // 計算總金額
                }
            case 'TOGGLE_CART_ALL_STATE': // 改變全部勾選狀態
                const newAllList = newCartList.map((item) => {
                    item.checked = action.payload
                    return item
                })
                return {
                    ...state,
                    cart: newAllList,
                    total: handleTotalPrice(newAllList), // 計算總金額
                }
            case 'ADD_WISH_LIST':
                // 清單不存在時才新增
                if (indexWish === -1) {
                    newWishList.push(action.payload)
                }
                return {
                    ...state,
                    wishList: newWishList,
                }
            case 'DELETE_WISH_LIST':
                return {
                    ...state,
                    wishList: action.payload, // 直接覆蓋原本的，送進來前已經做好篩選
                }
            case 'DELETE_ALL_WISH_LIST':
                return {
                    ...state,
                    wishList: [],
                }
            case 'IS_LOADING':
                return {
                    ...state,
                    isLoading: action.payload,
                }
            default:
                return state
        }
    }, initialState)

    // 新增購物車清單
    const handleAddCart = (data) => {
        handleAddCartIsLoading(true) // 開始進入加載
        dispatch({
            type: 'ADD_CART',
            payload: data,
        })
    }
    // 刪除購物車商品
    const handleDeleteCartList = (data) => {
        dispatch({
            type: 'DELETE_CART',
            payload: data,
        })
    }

    // 改變商品數量
    const handleChangeQuantity = (data, quantity) => {
        dispatch({
            type: 'CHANGE_CART_QUANTITY',
            payload: data,
        })
    }

    // 新增商品至購物車狀態
    const handleAddCartIsLoading = (state) => {
        dispatch({
            type: 'ADD_CART_STATE',
            payload: state,
        })
    }

    // 切換單一商品勾選狀態
    const handleToggleCartChecked = (id, state) => {
        dispatch({
            type: 'TOGGLE_CART_STATE',
            payload: {
                id,
                state,
            },
        })
    }
    // 切換全部商品勾選狀態
    const handleAllToggleCartChecked = (state) => {
        dispatch({
            type: 'TOGGLE_CART_ALL_STATE',
            payload: state,
        })
    }

    // 處理當前是否正在加載中
    const handleProductIsLoading = (state) => {
        dispatch({
            type: 'IS_LOADING',
            payload: state,
        })
    }

    // 新增商品至願望清單
    const handleAddWishList = (data) => {
        dispatch({
            type: 'ADD_WISH_LIST',
            payload: data,
        })
    }
    // 刪除指定願望清單商品
    const handleDeleteWishList = (data) => {
        dispatch({
            type: 'DELETE_WISH_LIST',
            payload: data,
        })
    }
    // 刪除全部願望清單
    const handleDeleteAllWishList = () => {
        dispatch({
            type: 'DELETE_ALL_WISH_LIST',
        })
    }

    // 處理新增指定商品參數至購物車
    const handleProductAddCart = (
        id,
        name,
        category,
        thumbnail,
        price,
        quantity = 1,
        color,
        size,
        sizeQuantity = 1,
        checked = false
    ) => {
        // 取得商品編號、名稱、種類、縮圖、價格、數量(預設1)、顏色、尺寸、對應尺寸庫存數、選取狀態
        // console.log([{ id, name, category, thumbnail, price, quantity, color, size }])
        handleAddCart({ id, name, category, thumbnail, price, quantity, color, size, sizeQuantity, checked })
        setTimeout(() => {
            handleAddCartIsLoading(false) // 控制是否成功。讓購物車icon跳動
        }, 1000)
        toast.success(`新增商品成功! ${name}`, {
            position: 'top-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
        })
    }

    // 處理新增指定商品參數至願望清單
    const handleProductAddWish = (id, name, category, thumbnail, price, quantity = 1, color, size, wishList) => {
        handleAddWishList({ id, name, category, thumbnail, price, quantity, color, size })
        toast.success(`新增願望清單成功!`, {
            position: 'top-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })
    }

    // 處理移除購物車商品清單
    const handleProductDeleteCart = (list) => {
        handleDeleteCartList(list)
    }

    // 移除願望清單
    const handleProductDeleteWish = (list) => {
        handleDeleteWishList(list)
        toast.info(`移除願望清單成功!`, {
            position: 'top-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })
    }

    // 轉換成台幣格式
    const handleNumberToTw = (value) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(
            value
        )
    }

    const productContextValues = {
        state,
        handleAddCart, // 直接新增至購物車
        handleAddWishList, // 直接新增至願望清單
        handleAddCartIsLoading, // 處理當前是否在加載
        handleProductIsLoading, // 商品是否正在加載中
        handleProductAddCart, // 處理新增商品至購物車(需要帶入相關參數)
        handleProductAddWish, // 處理新增商品至願望清單(需要帶入參數)
        // handleDeleteWishList, // 移除願望清單
        handleDeleteCartList, // 移除購物車清單
        handleDeleteAllWishList, // 刪除全部願望清單
        handleChangeQuantity, // 改變商品數量
        handleProductDeleteCart, // 刪除購物車商品
        handleProductDeleteWish, // 刪除願望清單
        handleToggleCartChecked, // 改變全部商品勾選狀態
        handleAllToggleCartChecked, // 改變全部商品勾選狀態
        handleNumberToTw, // 金額轉換成台幣
    }

    return <ProductContext.Provider value={{ productContextValues }}>{children}</ProductContext.Provider>
}

export default ProductContext
