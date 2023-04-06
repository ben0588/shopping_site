import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function NotFoundPage() {
    const navigate = useNavigate() // 使用 useNavigate 控制導航
    let location = useLocation() // 取得當前 url

    // 設定兩秒後回到根目錄(首頁)
    useEffect(() => {
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }, [])
    return (
        <>
            <section className='user-error-container'>
                <h3 className='user-error-title'>Not Found !</h3>
                <p className='user-error-text'>URL: {location.pathname} 頁面不存在，兩秒後返回首頁</p>
            </section>
        </>
    )
}

export default NotFoundPage
