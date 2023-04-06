import { useContext } from 'react'
import ProductContext from '../../components/payment/ProductContext'

function UserWishlistSection() {
    const { productContextValues } = useContext(ProductContext)
    return (
        <>
            <br />
            <h3>後續使用api呼叫資料庫取得該會員所屬的，願望清單資訊</h3>
            <hr />
            <h4>
                2023/3/31，先顯示當前context內的願望清單，未來改成會員資料表的願望清單，當前
                {productContextValues.state.wishList.length} 項
            </h4>
            <hr />
            <p>{JSON.stringify(productContextValues.state.wishList)}</p>
            <hr />
        </>
    )
}

export default UserWishlistSection
