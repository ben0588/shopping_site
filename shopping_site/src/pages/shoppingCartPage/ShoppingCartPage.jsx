import { useEffect } from 'react'
import { useState } from 'react'
import { NavLink, Outlet, useParams, useSearchParams } from 'react-router-dom'
import ShoppingCartNavbar from './ShoppingCartNavbar'

const navbarList = [
    { title: '購物車', link: '' },
    { title: '填寫資料', link: 'payment' },
    { title: '訂單確認', link: 'orders' },
]
const ShoppingCartPage = () => {
    const [page, setPage] = useState(1) // 預設第1頁

    // 控制當前頁數
    const handlePage = (page) => setPage(page)

    // 處理是否回到頂端
    const handleGoToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    // 切換頁數回到頂部
    useEffect(() => {
        if (page) {
            handleGoToTop()
        }
    }, [page])

    return (
        <section className='shopping-page-container'>
            <div className='shopping-page-content'>
                <ShoppingCartNavbar navbarList={navbarList} page={page} handlePage={handlePage} />
                <Outlet context={{ handlePage }} />
            </div>
        </section>
    )
}
export default ShoppingCartPage
