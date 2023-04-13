import Glide from '@glidejs/glide' // 引入 Glide.js 套件
import '@glidejs/glide/dist/css/glide.core.css' // 引入 Glide.js 套件 css樣式

import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

import banner01Img from '../../images/banner/banner_01.jpg'
import banner02Img from '../../images/banner/banner_02.jpg'
import banner03Img from '../../images/banner/banner_03.jpg'
import banner04Img from '../../images/banner/banner_04.jpg'

import { Carousel, Slide } from '../../components/carousel/Carousel'
import { ThemeContext } from '../../components/theme/ThemesContext'
import { useContext, useEffect } from 'react'
import { CarouselArrowsButton, CarouselBulletsButton } from '../../components/carousel/CarouselButton'
import AuthContext from '../../components/auth/AuthContext'
const carouselList = [
    {
        img: banner02Img,
        text: '網球 tennis demo',
        alt: 'source:https://unsplash.com/photos/6vTF5Was3rU?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
    },
    {
        img: banner03Img,
        text: 'tennis demo',
        alt: 'source:https://unsplash.com/photos/sid2a_eRaQ0?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
    },
    {
        img: banner04Img,
        text: 'tennis demo',
        alt: 'source:https://www.pexels.com/zh-tw/photo/3800470/',
    },
    {
        img: banner01Img,
        text: '網球 tennis demo',
        alt: 'source:https://unsplash.com/photos/nyAzMQ6Ejgs?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
    },
]
function HomeBannerSection() {
    const { contextValue } = useContext(AuthContext)

    return (
        <section className='home-banner-container'>
            <Carousel
                options={{
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
                }}
                openArrows={true} // 開啟左右箭頭
                openBullets={true} // 開啟底下方塊
                className='home-banner-carousel'
            >
                {carouselList.map((item, index) => {
                    return (
                        <Slide key={index}>
                            <div className='figure-container'>
                                <figcaption className='figcaptionText'>{item.text}</figcaption>
                                {contextValue.state.isLoading ? (
                                    <Skeleton className='img-container-skeleton' />
                                ) : (
                                    <img src={item.img} alt={item.alt} className='home-banner-img' />
                                )}
                            </div>
                        </Slide>
                    )
                })}
            </Carousel>
        </section>
    )
}

export default HomeBannerSection