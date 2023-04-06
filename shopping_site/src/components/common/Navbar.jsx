import { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ThemeContext } from '../theme/ThemesContext' // 主題色環境
import Logo from '../common/Logo' // Logo 元件
import styled from 'styled-components/macro' // styled-components 套件
// ---- 引用 svg 轉換成 icon
import { ReactComponent as MenuIcon } from '../../images/icon/menu_icon.svg'
import { ReactComponent as LeaveIcon } from '../../images/icon/leave_icon.svg'
import NavbarItems from './NavbarItems'
import NavbarAllProduct from './NavbarAllProduct'

function Navbar() {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const [menuToggle, setMenuToggle] = useState(false) // 控制選單顯示
    const productRef = useRef(null)
    const [display, setDisplay] = useState('none') // 控制滿版導覽列顯示

    useEffect(() => {
        // console.dir(productRef.current.style)
        // console.log(display)
    }, [display])

    // 處理顯示下拉式選單
    const handledShowDisplay = () => {
        setDisplay('flex')
    }

    // 隱藏下拉式選單 (滑鼠離開區塊+按下某個商品時)
    const handledHiddenDisplay = () => {
        setDisplay('none')
    }
    const navbarList = [
        { linkText: '首頁', patch: '/' },
        { linkText: '全部商品', patch: '/product' },
        { linkText: '優惠活動', patch: '/activity' },
        { linkText: '新品/熱賣', patch: '/hotNews' },
        { linkText: '最新消息', patch: '/newsLatest' },
    ]
    return (
        <>
            <nav
                className='navbar-container'
                style={{
                    color: theme.foreground,
                    background: theme.background,
                    borderTop: `2px solid ${theme.foreground}`,
                    borderBottom: `2px solid ${theme.foreground}`,
                }}
            >
                <div className='navbar-inner-container'>
                    <Logo />
                    {/* 在點擊開啟選單按鈕時會更新 menuToggle 狀態至 true */}
                    <ul className={`navbar-content ${menuToggle ? 'showMenu' : ''}`}>
                        <LeaveIcon
                            // 只有在 568 才會顯示選單按鈕
                            className='header-menu-leave'
                            style={{ fill: theme.foreground }}
                            //  點擊開啟選單跟關閉選單都會更新狀態
                            onClick={(e) => setMenuToggle(!menuToggle)}
                        />
                        <NavbarItems
                            navbarList={navbarList} // 導航資料
                            menuToggle={menuToggle} // 判定按鈕切換
                            setMenuToggle={setMenuToggle} // 切換按鈕方法
                            display={display} // 顯示
                            handledShowDisplay={handledShowDisplay} // 顯示選單
                            handledHiddenDisplay={handledHiddenDisplay} // 隱藏選單
                        />
                    </ul>
                    <MenuIcon
                        className='header-menu-open'
                        style={{ fill: theme.foreground }}
                        onClick={() => {
                            setMenuToggle(!menuToggle)
                        }}
                    />
                </div>
            </nav>
            <NavbarAllProduct
                display={display}
                handledShowDisplay={handledShowDisplay}
                handledHiddenDisplay={handledHiddenDisplay}
            />
        </>
    )
}

export default Navbar
