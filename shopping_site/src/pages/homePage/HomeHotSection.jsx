import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react' // 引用 Swiper 套件元件
import { EffectCube, EffectCards, EffectFlip, Autoplay, EffectFade } from 'swiper' // 導入 Swiper 核心
import 'swiper/css' // 引用 Swiper 套件css樣式
import 'swiper/css/autoplay'
import 'swiper/css/effect-cards'

import { useContext, useEffect } from 'react'
import { ThemeContext } from '../../components/theme/ThemesContext'

import DemoProductImg_1 from '../../images/product/product_1.png'
import DemoProductImg_2 from '../../images/product/product_2.png'
import DemoProductImg_3 from '../../images/product/product_3.png'
import DemoProductImg_4 from '../../images/product/product_4.png'
import DemoProductImg_5 from '../../images/product/product_5.png'

import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件
import AuthContext from '../../components/auth/AuthContext'

function HomeHotSection() {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const { contextValue } = useContext(AuthContext)

    const carouselList = [
        {
            id: 1,
            title: 'DEMO PRODUCT 1',
            alt: 'IXXXX混合碳纖維吸震',
            patch: '/product',
            img: DemoProductImg_1,
        },
        {
            id: 2,
            title: 'DEMO PRODUCT 2',
            alt: '最新GXXXX999+科技',
            patch: '/product',
            img: DemoProductImg_2,
        },
        {
            id: 3,
            title: 'DEMO PRODUCT 3',
            alt: '輕鬆擊出有威力的旋球',
            patch: '/product',
            img: DemoProductImg_3,
        },
        {
            id: 4,
            title: 'DEMO PRODUCT 4',
            alt: '擊球瞬間優化能量轉換',
            patch: '/product',
            img: DemoProductImg_4,
        },
        {
            id: 5,
            title: 'DEMO PRODUCT 5',
            alt: '輕鬆擊出有威力的旋球',
            patch: '/product',
            img: DemoProductImg_5,
        },
    ]

    /*
        2023/3/31 紀錄:
            未來此圖片將從資料庫-> 購買數量最多的商品，取出前五個，用來產生卡片讀取
    */

    return (
        <section className='home-hot-container' style={{ color: theme.foreground, backgroundColor: theme.background }}>
            <div className='home-hot-content'>
                <div className='home-hot-swiper'>
                    <Swiper
                        modules={[EffectCards, Autoplay]} // 引入動畫模組
                        effect={'cards'} // 運行效果
                        autoplay={{
                            delay: 3000, // 運行秒數
                            disableOnInteraction: false, // 手動滑動後，自動播放仍有效
                            pauseOnMouseEnter: true, // 滑鼠懸停時停止
                        }}
                        grabCursor={true} // 支持拖曳移動
                        slidesPerView={1} // 起始可以看到幾張
                        className='mySwiper'
                    >
                        {carouselList.map((item, index) => {
                            return (
                                <SwiperSlide key={index} className='home-hot-items'>
                                    {contextValue.state.isLoading ? (
                                        <Skeleton className='home-hot-items-skeleton' />
                                    ) : (
                                        <>
                                            <img src={item.img} alt={item.alt} className='home-hot-img ' />
                                            <Link className='home-hot-btn' to={`${item.patch}/${item.id}`}>
                                                {item.title}
                                                <br />
                                                <small className='home-hot-small'>{item.alt}</small>
                                            </Link>
                                        </>
                                    )}
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
                <div className='home-hot-slogan'>
                    <h2 className='home-hot-title'>每月精選熱銷商品</h2>
                    <h2 className='home-hot-subtitle'>HOT SALE</h2>
                    <p className='home-hot-small'>
                        <small> 2023/1~2023/2</small>
                    </p>
                    <br />
                    <ul className='home-hot-list'>
                        <li>全新第六代 VXXX 網球拍!</li>
                        <li>全新 RXXX DXXXX 鞋底設計!</li>
                        <li>AXXXX 再進化，前封後在攻新定義。</li>
                        <li>世界球王 DXXXXX 推薦款！</li>
                        <li>全新的 AXXX 結構，帶來震撼的感覺!</li>
                    </ul>
                    {/* <h2 className='home-hot-subtitle'>優質商品不間斷更新</h2> */}
                    <Link
                        className='home-hot-more'
                        style={{
                            border: `2px solid ${theme.foreground}`,
                        }}
                        to='/hotNews'
                    >
                        查看更多
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HomeHotSection
