import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../components/auth/AuthContext'
import { ThemeContext } from '../../components/theme/ThemesContext'
import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

const newsList = [
    { date: '2023/1/6', info: 'ORIGINTENNIS商城:本網站為DEMO用，無商業行為', patch: '/newsLatest' },
    { date: '2023/1/5', info: 'ORIGINTENNIS商城:期間限定89折折扣券使用須知', patch: '/newsLatest' },
    { date: '2023/1/4', info: 'ORIGINTENNIS商城:盤點延遲出貨公告', patch: '/newsLatest' },
    { date: '2023/1/3', info: 'ORIGINTENNIS商城:Wxxxxx網球拍Ueeee 999 V8開賣!', patch: '/newsLatest' },
    { date: '2023/1/2', info: 'ORIGINTENNIS商城週年慶 盛大展開 多項好禮大方送！', patch: '/newsLatest' },
]
function HomeNewInfoSection() {
    const { theme } = useContext(ThemeContext)
    const { contextValue } = useContext(AuthContext)
    const { handleIsGoToTop } = contextValue

    return (
        <section className='home-newInfo-container' style={{ color: theme.foreground }}>
            <h3 className='home-newInfo-title'>最新消息</h3>
            <h3 className='home-newInfo-subtitle'>NEWS</h3>
            <table className='home-newInfo-table' data-aos='fade-up' data-aos-duration='3000'>
                <tbody>
                    {newsList.map((item, index) => {
                        return (
                            <tr key={index}>
                                {contextValue.state.isLoading ? (
                                    <td>
                                        <Skeleton className='home-newInfo-table-skeleton-td' />
                                    </td>
                                ) : (
                                    <td>{item.date} </td>
                                )}

                                {contextValue.state.isLoading ? (
                                    <td>
                                        <Skeleton className='home-newInfo-table-skeleton-link' />
                                    </td>
                                ) : (
                                    <td style={{ color: theme.foreground }}>
                                        <Link
                                            to={item.patch}
                                            className='home-newInfoLink'
                                            onClick={() => {
                                                handleIsGoToTop && handleIsGoToTop()
                                            }}
                                        >
                                            {item.info}
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </section>
    )
}

export default HomeNewInfoSection
