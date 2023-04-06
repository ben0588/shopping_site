import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../components/auth/AuthContext'
import { ThemeContext } from '../../components/theme/ThemesContext'
import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

import gridImg_Big_1 from '../../images/grid/grid_big_1.jpg'
import gridImg_Big_2 from '../../images/grid/grid_big_2.jpg'
import gridImg_sm_1 from '../../images/grid/grid_sm_1.jpg'
import gridImg_sm_2 from '../../images/grid/grid_sm_2.jpg'
import gridImg_sm_3 from '../../images/grid/grid_sm_3.jpg'
import gridImg_sm_4 from '../../images/grid/grid_sm_4.jpg'
import gridImg_sm_5 from '../../images/grid/grid_sm_5.jpg'

const gridList = [
    {
        id: '01',
        alt: 'source:https://unsplash.com/photos/hOXvvQrGdFc?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_Big_1,
        className: 'home-photos-big1',
    },
    {
        id: '01',
        alt: 'source:https://unsplash.com/photos/_oPHZk_uYXM?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_Big_2,
        className: 'home-photos-big2',
    },
    {
        id: '01',
        alt: 'source:https://unsplash.com/photos/8E1Yplw6Hho?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_sm_1,
        className: 'home-photos-sm1',
    },
    {
        id: '01',
        alt: 'source:https://unsplash.com/it/foto/Wcnusk9Njjk?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_sm_2,
        className: 'home-photos-sm2',
    },
    {
        id: '01',
        alt: 'source:https://unsplash.com/photos/rR5MvBcjmMA?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_sm_3,
        className: 'home-photos-sm3',
    },
    {
        id: '01',
        alt: 'source:https://unsplash.com/photos/204jBrH397M?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_sm_4,
        className: 'home-photos-sm4',
    },
    {
        id: '01',
        alt: 'source:https://unsplash.com/photos/nyAzMQ6Ejgs?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
        img: gridImg_sm_5,
        className: 'home-photos-sm5',
    },
]
function HomePhotosSection() {
    const { theme } = useContext(ThemeContext)
    const { contextValue } = useContext(AuthContext)

    /*
        2023/3/31 紀錄:
            未來此圖片來源可改成 API 獲取的
    */

    return (
        <section className='home-photos-container'>
            <h2
                className='home-photos-title'
                style={{ color: theme.foreground }}
                data-aos='fade-up'
                data-aos-anchor-placement='top-bottom'
            >
                追隨{' '}
                <a href='https://www.instagram.com/' target='_blank'>
                    @ORIGINTENNIS
                </a>{' '}
                INSTAGRAM
            </h2>
            <ul className='home-photos-grid'>
                {gridList.map((item, index) => {
                    return (
                        <li key={index} className={`home-photos-items ${item.className}`}>
                            {contextValue.state.isLoading ? (
                                <Skeleton className='home-photos-items-skeleton' />
                            ) : (
                                <img
                                    className='home-photos-img'
                                    src={item.img}
                                    alt={item.alt}
                                    onClick={() => {
                                        // 未來使用另開分頁方式，連結到IG對應的貼文中
                                    }}
                                />
                            )}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default HomePhotosSection
