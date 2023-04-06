import { useEffect } from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'

const ShoppingCartPaymentSection = () => {
    const { handlePage } = useOutletContext()

    return (
        <div>
            <h4>此頁面需填寫顧客資料，送貨資料，付款資料，索取發票方式</h4>
            <hr />
            <NavLink to='/shoppingCart' className='back-cart-btn' onClick={() => handlePage(1)}>
                返回購物車
            </NavLink>
            |
            <NavLink to='/shoppingCart/orders' className='check-cart-btn' onClick={() => handlePage(3)}>
                提交確認
            </NavLink>
        </div>
    )
}
export default ShoppingCartPaymentSection
