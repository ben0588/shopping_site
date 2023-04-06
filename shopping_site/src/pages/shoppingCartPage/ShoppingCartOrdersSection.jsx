import { useEffect } from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'

const ShoppingCartOrdersSection = () => {
    const { handlePage } = useOutletContext()

    return (
        <div>
            <h4>
                此頁面送出確認後，會觸發金流，完成交易之後會將金流方提供的交易訂單號傳入後端，並且可在會員系統中查看到
            </h4>
            <hr />
            <NavLink to='/shoppingCart/payment' className='check-cart-btn' onClick={() => handlePage(2)}>
                返回填寫資料
            </NavLink>
        </div>
    )
}
export default ShoppingCartOrdersSection
