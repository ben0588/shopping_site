import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext.jsx' // 管理會員驗證

import NavbarTop from '../common/NavbarTop.jsx'
import Navbar from '../common/Navbar.jsx'
import NavbarTopTip from '../common/NavbarTopTip.jsx'

const Header = React.forwardRef(({ onTitleUpdate }, ref) => {
    const { contextValue } = useContext(AuthContext) // 會員驗證

    return (
        <>
            <header className='header-container' ref={ref}>
                {/* 登入後顯示加入會員提示 */}
                {contextValue.state.authToken === null && contextValue.locationToken === null ? <NavbarTopTip /> : null}
                <NavbarTop />
                <Navbar />
            </header>
        </>
    )
})

export default Header
