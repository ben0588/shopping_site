import { Link } from 'react-router-dom'
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useContext } from 'react'
import { ThemeContext } from '../../components/theme/ThemesContext'

import noCopyrightLogo_1 from '../../images/logo/brand/LOGO_1.png'
import noCopyrightLogo_2 from '../../images/logo/brand/LOGO_2.png'
import noCopyrightLogo_3 from '../../images/logo/brand/LOGO_3.png'
import noCopyrightLogo_4 from '../../images/logo/brand/LOGO_4.png'
import noCopyrightLogo_5 from '../../images/logo/brand/LOGO_5.png'
import noCopyrightLogo_6 from '../../images/logo/brand/LOGO_6.png'
import noCopyrightLogo_7 from '../../images/logo/brand/LOGO_7.png'
import noCopyrightLogo_8 from '../../images/logo/brand/LOGO_8.png'
import noCopyrightLogo_9 from '../../images/logo/brand/LOGO_9.png'
import noCopyrightLogo_10 from '../../images/logo/brand/LOGO_10.png'
import AuthContext from '../../components/auth/AuthContext'
import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

const brandList = [
    {
        id: 1,
        brand: 'tennis',
        img: noCopyrightLogo_1,
    },
    {
        id: 2,
        brand: 'tennis',
        img: noCopyrightLogo_2,
    },
    {
        id: 3,
        brand: 'tennis',
        img: noCopyrightLogo_3,
    },
    {
        id: 4,
        brand: 'tennis',
        img: noCopyrightLogo_4,
    },
    {
        id: 5,
        brand: 'tennis',
        img: noCopyrightLogo_5,
    },
    {
        id: 6,
        brand: 'tennis',
        img: noCopyrightLogo_6,
    },
    {
        id: 7,
        brand: 'tennis',
        img: noCopyrightLogo_7,
    },
    {
        id: 8,
        brand: 'tennis',
        img: noCopyrightLogo_8,
    },
    {
        id: 9,
        brand: 'tennis',
        img: noCopyrightLogo_9,
    },
    {
        id: 10,
        brand: 'tennis',
        img: noCopyrightLogo_10,
    },
    {
        id: 1,
        brand: 'tennis',
        img: noCopyrightLogo_1,
    },
    {
        id: 2,
        brand: 'tennis',
        img: noCopyrightLogo_2,
    },
    {
        id: 3,
        brand: 'tennis',
        img: noCopyrightLogo_3,
    },
    {
        id: 4,
        brand: 'tennis',
        img: noCopyrightLogo_4,
    },
    {
        id: 5,
        brand: 'tennis',
        img: noCopyrightLogo_5,
    },
    {
        id: 6,
        brand: 'tennis',
        img: noCopyrightLogo_6,
    },
    {
        id: 7,
        brand: 'tennis',
        img: noCopyrightLogo_7,
    },
    {
        id: 8,
        brand: 'tennis',
        img: noCopyrightLogo_8,
    },
    {
        id: 9,
        brand: 'tennis',
        img: noCopyrightLogo_9,
    },
    {
        id: 10,
        brand: 'tennis',
        img: noCopyrightLogo_10,
    },
]

function HomeBrandSection() {
    const { theme } = useContext(ThemeContext)
    const { contextValue } = useContext(AuthContext)

    return (
        <section className='home-brand-container' style={{ color: theme.foreground }}>
            <h3 className='home-brand-title'>合作品牌</h3>
            <h3 className='home-brand-subtitle'>Collaborate Brand</h3>

            <div className='home-brand-content'>
                <Swiper
                    //  modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y, EffectCards]}
                    modules={[Autoplay, Pagination, Navigation]} // 引入動畫模組
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false, // 手動滑動後，自動播放仍有效
                        pauseOnMouseEnter: true, // 滑鼠懸停時停止
                    }}
                    grabCursor={true} // 支持拖曳移動
                    // navigation={true} // 顯示左右導航按鈕
                    slidesPerView={10} // 起始可以看到幾張
                    className='mySwiper'
                    // 增加RWD斷點設計
                    breakpoints={{
                        569: {
                            // width: >= 569,
                            slidesPerView: 10,
                        },
                        414: {
                            // width: >= 414,
                            slidesPerView: 7,
                        },
                        375: {
                            // width: >= 375,
                            slidesPerView: 5,
                        },

                        320: {
                            // width: >= 320,
                            slidesPerView: 3,
                        },
                    }}
                >
                    {brandList.map((item, index) => {
                        return (
                            <SwiperSlide key={index} className='home-brand-items'>
                                {contextValue.state.isLoading ? (
                                    <Skeleton className='home-brand-items-skeleton' />
                                ) : (
                                    <img src={item.img} alt={item.brand} className='home-brand-img ' />
                                )}
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </section>
    )
}

export default HomeBrandSection
