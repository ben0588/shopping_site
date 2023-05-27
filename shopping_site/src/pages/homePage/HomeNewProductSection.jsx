import { Link, useNavigate } from 'react-router-dom'

import { Swiper, SwiperSlide } from 'swiper/react' // 引用 Swiper 套件元件
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper' // 導入 Swiper 各指定功能模板
import 'swiper/css' // 引用 Swiper 套件css樣式
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

import DemoProductImg_1 from '../../images/product/product_1.png'
import DemoProductImg_2 from '../../images/product/product_2.png'
import DemoProductImg_3 from '../../images/product/product_3.png'
import DemoProductImg_4 from '../../images/product/product_4.png'
import DemoProductImg_5 from '../../images/product/product_5.png'
import DemoProductImg_6 from '../../images/product/product_6.png'
import DemoProductImg_7 from '../../images/product/product_7.png'
import DemoProductImg_8 from '../../images/product/product_8.png'
import DemoProductImg_9 from '../../images/product/product_9.png'
import DemoProductImg_10 from '../../images/product/product_10.png'
import AuthContext from '../../components/auth/AuthContext'
import { useContext } from 'react'

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
        alt: '感覺和更清晰的衝擊力',
        patch: '/product',
        img: DemoProductImg_5,
    },
    {
        id: 6,
        title: 'DEMO PRODUCT 6',
        alt: '體驗非凡的球賽體驗',
        patch: '/product',
        img: DemoProductImg_6,
    },
    {
        id: 7,
        title: 'DEMO PRODUCT 7',
        alt: '提供較好的穩定度',
        patch: '/product',
        img: DemoProductImg_7,
    },
    {
        id: 8,
        title: 'DEMO PRODUCT 8',
        alt: '提升擊球手感',
        patch: '/product',
        img: DemoProductImg_8,
    },
    {
        id: 9,
        title: 'DEMO PRODUCT 9',
        alt: '全新優雅不對稱設計',
        patch: '/product',
        img: DemoProductImg_9,
    },
    {
        id: 10,
        title: 'DEMO PRODUCT 10',
        alt: '改善手感和更多控制',
        patch: '/product',
        img: DemoProductImg_10,
    },
]

function HomeNewProductSection() {
    const { contextValue } = useContext(AuthContext)
    const navigate = useNavigate() // 使用導航

    /*
        2023/3/31 紀錄:
            未來透過取得商品資料庫，創建日期最新的前10個商品，用來產生卡片元素
    */

    return (
        <section className='home-newProduct-container'>
            <h2 className='home-newProduct-title'>新上架商品</h2>
            <h2 className='home-newProduct-subtitle' data-aos='fade-up' data-aos-anchor-placement='top-bottom'>
                NEW ARRIVALS
            </h2>
            <div className='home-newProduct-content'>
                <Swiper
                    // 更改兩側箭頭顏色
                    style={{
                        '--swiper-navigation-color': '#00b894',
                        '--swiper-pagination-color': '#00b894',
                    }}
                    modules={[Autoplay, Navigation, Pagination, Scrollbar]} // 引入動畫模組
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false, // 手動滑動後，自動播放仍有效
                        pauseOnMouseEnter: true, // 滑鼠懸停時停止
                    }}
                    grabCursor={true} // 支持拖曳移動
                    navigation={true} // 顯示左右導航按鈕
                    // pagination={{ clickable: true }} // 開啟下方小圓圈
                    scrollbar={{ draggable: true }} // 顯示下方滾輪條
                    slidesPerView={5} // 起始可以看到幾張
                    spaceBetween={20} // 每塊間隔
                    className='mySwiper'
                    // 增加RWD斷點設計(>=)
                    breakpoints={{
                        1140: {
                            // width: 1140,
                            slidesPerView: 5,
                        },
                        768: {
                            // width: 768,
                            slidesPerView: 3,
                        },
                        568: {
                            // width: 568,
                            slidesPerView: 2,
                        },
                        // 414: {
                        //     // width: 414,
                        //     slidesPerView: 1,
                        // },
                        // 375: {
                        //     // width: 375,
                        //     slidesPerView: 1,
                        // },
                        320: {
                            // width: 320,
                            slidesPerView: 1,
                        },
                    }}
                >
                    {carouselList.map((item, index) => {
                        return (
                            <SwiperSlide
                                key={index}
                                className='home-newProduct-items'
                                // 進入此商品頁面
                                onClick={() => navigate(`${item.patch}/${item.id}`)}
                            >
                                {contextValue.state.isLoading ? (
                                    <Skeleton className='home-newProduct-items-skeleton' />
                                ) : (
                                    <>
                                        <img src={item.img} alt={item.alt} className='home-newProduct-img ' />
                                        <Link className='home-newProduct-btn' to={item.patch}>
                                            {item.title}
                                            <br />
                                            <small className='home-newProduct-small'>{item.alt}</small>
                                        </Link>
                                    </>
                                )}
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </section>
    )
}

export default HomeNewProductSection
