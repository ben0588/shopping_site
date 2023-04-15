import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../components/theme/ThemesContext'

import { ReactComponent as CaretLeftIcon } from '../../images/icon/caret_left_icon.svg'
import { ReactComponent as CaretRightIcon } from '../../images/icon/caret_right_icon.svg'

import gsap, { TextPlugin, TweenMax } from 'gsap/all' // 引用 GSAP 套件 與 其他同源套件

import ScrollTrigger from 'gsap/ScrollTrigger'
import Flip from 'gsap/Flip'
import Draggable from 'gsap/Draggable'
import Circle from '../../components/GSAP/Circle'
import GaspProvider from '../../components/GSAP/GsapContext'
import { GaspContext } from '../../components/GSAP/GsapContext.jsx'

import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

// import hoverEffect from 'hover-effect' // 引用 hover effect 套件處理圖片
// import hoverEffect from 'hover-effect/dist/hover-effect.js'

import sectionImgOne from '../../images/other/s-10.jpg'
import sectionImgOneTo from '../../images/other/s-17.jpg'
import sectionImgTwo from '../../images/other/s-09.jpg'
import sectionImgTwoTo from '../../images/other/s-19.jpg'
import overlay from '../../images/other/m-07.jpg'
import AuthContext from '../../components/auth/AuthContext'
import { Img } from 'react-image'

function HomeSellingSection({ appRef }) {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const cursorRef = useRef(null) // 光標參數綁定
    const sellingRef = useRef(null) // 綁定區塊底部
    const { contextValue } = useContext(AuthContext)

    useEffect(() => {
        // 進入後開始設定
        let ctx = gsap.context(() => {
            // 綁定光標效果 (透明度0、動畫時間1秒、重複無限次)
            gsap.to(cursorRef.current, { opacity: 0, duration: 1, repeat: -1 })
        }, sellingRef)

        return () => {
            // 離開始清除設定
            ctx.revert()
        }
    }, [sellingRef]) // 監聽

    return (
        <section
            ref={sellingRef}
            className='home-selling-container box1 box'
            style={{ color: theme.foreground, backgroundColor: theme.background }}
        >
            <div className='home-selling-content'>
                <h2 className='home-selling-slogan'>
                    {contextValue.state.isLoading ? <Skeleton width={`200px`} /> : '全新技術'}
                </h2>
                <h3 className='home-selling-subslogan'>
                    {contextValue.state.isLoading ? (
                        <Skeleton className='home-selling-subslogan-skeleton' />
                    ) : (
                        'New Technology'
                    )}
                </h3>
                <div
                    className='home-selling-items'
                    data-aos='fade-right'
                    data-aos-offset='300'
                    data-aos-easing='ease-in-sine'
                    style={{ border: `2px solid ${theme.foreground}` }}
                >
                    {contextValue.state.isLoading ? (
                        <Skeleton className='home-selling-img' />
                    ) : (
                        <Img
                            src={sectionImgOneTo}
                            alt='source:https://unsplash.com/photos/nyAzMQ6Ejgs?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink'
                            className='home-selling-img'
                        />
                    )}
                    {/* 標題框用Skeleton元件會出現GSAP讀取不到DOM情況 */}
                    <h2
                        className='home-selling-title 
                        home-selling-one-title'
                        data-aos='fade-down'
                    >
                        新品熱賣中
                        <br />
                        重磅上市!
                        <span className='cursor' ref={cursorRef}></span>
                    </h2>
                    {contextValue.state.isLoading ? (
                        <Skeleton className='home-selling-btn home-selling-left-btn' />
                    ) : (
                        <Link to='/hotNews' className='home-selling-btn home-selling-left-btn'>
                            <CaretRightIcon className='home-selling-icon' />
                            前去逛逛
                        </Link>
                    )}
                </div>
            </div>
            <div className='home-selling-content'>
                <div
                    className='home-selling-items'
                    style={{ border: `2px solid ${theme.foreground}` }}
                    data-aos='fade-left'
                    data-aos-offset='300'
                    data-aos-easing='ease-in-sine'
                >
                    <Img
                        src={sectionImgTwoTo}
                        alt='source:https://unsplash.com/photos/nyAzMQ6Ejgs?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink'
                        className='home-selling-img'
                        loader={<Skeleton />}
                    />
                    <h2
                        className='home-selling-title 
                    home-selling-two-title 
                    '
                    >
                        獨創全新工藝
                        <br />
                        全球首映!
                    </h2>
                    <Link to='/hotNews' className='home-selling-btn  home-selling-right-btn'>
                        <CaretLeftIcon className='home-selling-left-icon ' />
                        前去逛逛
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HomeSellingSection
