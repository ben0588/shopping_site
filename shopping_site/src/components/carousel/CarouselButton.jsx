import Glide from '@glidejs/glide' // 引入 Glide.js 套件 (npm install @glidejs/glide)
import '@glidejs/glide/dist/css/glide.core.css' // 引入 Glide.js 套件 css樣式

import { ReactComponent as ArrowLeft } from '../../images/icon/arrow_left2_icon.svg'
import { ReactComponent as ArrowRight } from '../../images/icon/arrow_right2_icon.svg'

import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemesContext' // 管理主題色

// 左右前進後退按鈕設定
export const CarouselArrowsButton = () => {
    const { theme } = useContext(ThemeContext) // 引用主題色

    return (
        <div className='glide__arrows' data-glide-el='controls'>
            <button
                type='button'
                className='glide__arrow glide__arrow--left arrow-left'
                data-glide-dir='<'
                style={{ backgroundColor: theme.background }}
            >
                {/* 用svg作法 */}
                <ArrowLeft style={{ fill: theme.foreground }} />
            </button>
            <button
                className='glide__arrow glide__arrow--right arrow-right'
                type='button'
                data-glide-dir='>'
                style={{ backgroundColor: theme.background }}
            >
                <ArrowRight style={{ fill: theme.foreground }} />
            </button>
        </div>
    )
}

// 下方小方塊
export const CarouselBulletsButton = () => {
    return (
        <div className='glide__bullets' data-glide-el='controls[nav]'>
            <button className='glide__bullet' data-glide-dir='=0'></button>
            <button className='glide__bullet' data-glide-dir='=1'></button>
            <button className='glide__bullet' data-glide-dir='=2'></button>
            <button className='glide__bullet' data-glide-dir='=3'></button>
        </div>
    )
}
