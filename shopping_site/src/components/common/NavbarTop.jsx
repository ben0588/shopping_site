import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../auth/AuthContext' // 控制登入權限
import ThemeButton from '../theme/ThemeButton' // 管理主題色按鈕

// ---- 引用 svg 轉換成 icon
import { ReactComponent as UserLoginIcon } from '../../images/icon/user_login_icon.svg'
import { ReactComponent as UserInfoIcon } from '../../images/icon/user_info_icon.svg'
import { ReactComponent as ShoppingCartIcon } from '../../images/icon/shopping_cart_icon.svg'
import { useEffect } from 'react'
import ProductContext from '../payment/ProductContext'

function NavbarTop() {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境
    const { handlerTitleUpdate } = contextValue // 更新網頁標頭方法
    const { productContextValues } = useContext(ProductContext) // 取得當前購物車資訊
    const [themeText, setThemeText] = useState(false) // 顯示當前主題配色

    return (
        <nav className='header-top-container'>
            <ul className='header-top-inner-container'>
                {/* <Link to='/admin'>管理者登入</Link> */}
                <li className='header-top-items'>
                    {/* 有登入狀態才顯示會員專區 */}
                    {contextValue?.state?.authToken || contextValue.locationToken ? (
                        <Link
                            to='/user'
                            className='header-top-text'
                            onClick={(e) => handlerTitleUpdate && handlerTitleUpdate(e.target.text)}
                        >
                            <UserInfoIcon className='header-top-icon' />
                            會員專區
                        </Link>
                    ) : (
                        <Link
                            to='/login'
                            className='header-top-text'
                            onClick={(e) => handlerTitleUpdate && handlerTitleUpdate(e.target.text)}
                        >
                            <UserLoginIcon className='header-top-icon' />
                            登入/註冊
                        </Link>
                    )}
                </li>
                <li className='header-top-items'>
                    <Link
                        to='/shoppingCart'
                        className='header-top-text'
                        onClick={(e) => handlerTitleUpdate && handlerTitleUpdate(e.target.text)}
                    >
                        <ShoppingCartIcon
                            className={`header-top-icon  
                            ${productContextValues.state.isLoading && 'header-cart-animate'}`}
                        />
                        購物車
                        <span className='header-cart-number'>
                            {productContextValues.state.cart.length === 0
                                ? null
                                : productContextValues.state.cart.length}
                        </span>
                    </Link>
                </li>
                <li className='header-top-items'>
                    <span className='header-theme-text'>{themeText ? '淺色主題' : '深色主題'}</span>
                    {/* 提供方法給子層讓子層決定完成時才返回狀態 */}
                    <ThemeButton onToggle={(state) => setThemeText(state)} />
                </li>
            </ul>
        </nav>
    )
}

export default NavbarTop
