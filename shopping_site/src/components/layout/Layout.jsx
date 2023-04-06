import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Header from './Header.jsx'
import Footer from './Footer.jsx'
import gsap, { TextPlugin, Power3 } from 'gsap/all.js' // 引用 gsap 套件
import { ScrollTrigger } from 'gsap/ScrollTrigger' // 引用 gsap 依賴套件

import AOS from 'aos' // 引用 AOS 視差滾動套件
import 'aos/dist/aos.css' // AOS 樣式
import GoTopButton from '../common/GoTopButton.jsx'
import AuthContext from '../auth/AuthContext.jsx'
import UserLoginError from '../../pages/userPage/UserLoginError.jsx'
import Loading from '../common/Loading.jsx'
// import { ThemeContext } from '../theme/ThemesContext.jsx' // 引用 useContext

// 最外層設定Layout，元件內新增Navbar、footer元件，在中間內容加上<Outlet />代表內容切換
function Layout() {
    const { contextValue } = useContext(AuthContext) // 驗證會員 auth context環境
    const [goTopShow, setGoTopShow] = useState(false) // 管理顯示TOP按鈕狀態
    const headerRef = useRef(null)

    // useEffect(() => {
    //     if (headerRef) {
    //         console.dir(headerRef.current.offsetHeight)
    //     }
    // }, [headerRef])
    const timeline = gsap.timeline() // 創建gsap timeline方法
    // const easeIn = Power3.easeIn()
    // const easeInOut = Power3.easeInOut()
    // const easeOut = Power3.easeOut() // 創建動態方法
    // const headerRef = useRef(null)
    // const layoutRef = useRef(null)

    // 處理 回到頂端 按鈕
    useEffect(() => {
        // 監控往下滾動到一定距離才會顯示Top按鈕
        const showTopButton = () => {
            if (window.pageYOffset > 700) {
                setGoTopShow(true)
            }
            if (window.pageYOffset < 700) {
                setGoTopShow(false)
            }
        }
        document.addEventListener('scroll', showTopButton)

        return () => {
            document.removeEventListener('scroll', showTopButton)
        }
    }, [])

    // 處理回到首頁滑動效果
    const handlerGoTop = (e) => {
        e.preventDefault()

        window.scrollTo({
            top: 0,
            behavior: 'smooth', // 移動效果
        })
    }

    // 啟用gsap套件
    useLayoutEffect(() => {
        // 全域啟用 ScrollTrigger & TextPlugin 套件
        gsap.registerPlugin(ScrollTrigger, TextPlugin)
        // 全域啟用 aox 初始化
        AOS.init()
    }, [])

    /*
        2023/3/31 紀錄
            未來優化方向:
                #1、完成商品新增編輯刪除查詢的後端api，已達成動態網站的情況
                    (當前操作資料庫的只有個人資料的CRUD，用context則有購物車CRUD、願望清單CRUD)
                #2、完成驗證管理者權限、管理者後臺頁面，新增商品功能 後端api
                #3、完成後端商品api，並且雍有每頁10個商品限制、max-page功能、且可帶入page參數切換顯示頁數
                #4、完成優惠活動、新品/熱賣、最新消息頁面
                #5、完成後端創建 SEO 優化功能
    */

    return (
        <div className='layout-container'>
            <Loading />
            <Header timeline={timeline} ref={headerRef} />
            <main className='layout-main-container'>
                {/* {contextValue?.state?.userData ? <Outlet /> : <UserLoginError />} */}
                <Outlet />
                {goTopShow && <GoTopButton onGoTop={handlerGoTop} />}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
