import Glide from '@glidejs/glide' // 引入 Glide.js 套件 (npm install @glidejs/glide)
import '@glidejs/glide/dist/css/glide.core.css' // 引入 Glide.js 套件 css樣式
import { useImperativeHandle, useEffect, useRef, forwardRef } from 'react'
import { ReactComponent as ArrowLeft } from '../../images/icon/arrow_left2_icon.svg'
import { ReactComponent as ArrowRight } from '../../images/icon/arrow_right2_icon.svg'

import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemesContext' // 管理主題色
import { CarouselArrowsButton, CarouselBulletsButton } from './CarouselButton' // 引入Carousel切換按鈕

// Glide 初始化設定
const sliderConfiguration = {
    type: 'carousel', // slider(會滑動回到最開始) ，carousel(較順暢的播放方式)
    startAt: 0, // 初始第幾張
    focusAt: 'center', // 聚焦起始點
    perView: 1, // 每次顯示幾張
    accessibility: true,
    autoplay: 4000, // 切換輪播間距
    gap: 5, // 圖與圖間隔
    peek: {
        // 兩側內凹距離
        before: 50,
        after: 50,
    },
    // RWD斷點設定
    breakpoints: {
        768: {
            perView: 3,
        },
        767: {
            perView: 2,
        },
        767: {
            perView: 1,
        },
    },
}

export const Carousel = forwardRef(({ options, children, openArrows, openBullets }, ref) => {
    const { theme } = useContext(ThemeContext) // 引用主題色

    const sliderRef = useRef(null) // 使用 useRef 避免刷新節點導致 glide套件 失效

    useImperativeHandle(ref, () => sliderRef.current) // 讓子層都可以使用到此 ref 設定

    useEffect(() => {
        // 當節點榜定成功才新增初始化
        const slider = new Glide(sliderRef.current, options)
        slider.mount() // Glide.js 初始化執行
        return () => {
            // 離開始清除 mount 初始化狀態
            slider.destroy()
        }
    }, [options])

    return (
        <>
            {/* 在最外層先綁定 ref 屬性，裡面放元件就都可以吃到屬性 */}
            <div className='glide' ref={sliderRef}>
                <div className='glide__track' data-glide-el='track'>
                    <ul className='glide__slides'>{children}</ul>
                </div>
                {openArrows && <CarouselArrowsButton />}
                {openBullets && <CarouselBulletsButton />}
            </div>
        </>
    )
})

// 用來存放每個圖片大小設定
export const Slide = forwardRef(({ children }, ref) => {
    return (
        // 此 ref 是由上層傳遞下來的一樣可以綁定
        <li className='glide__slide' ref={ref}>
            {children}
        </li>
    )
})
