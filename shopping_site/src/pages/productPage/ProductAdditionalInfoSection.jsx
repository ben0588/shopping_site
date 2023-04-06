import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const ProductAdditionalInfoSection = ({ descriptionImages }) => {
    const additionalInfoRef = useRef(null) // 取得 DOM 元素

    // 處理點擊導航時貼齊導覽列邊
    const handlePageGoToTop = () => {
        // 當選擇以下導覽列之後會把此元件貼其最頂端，95是 headerRe f的 offsetTop數字
        // console.dir(additionalInfoRef.current.offsetTop)
        window.scrollTo({
            top: additionalInfoRef.current.offsetTop - 120,
            behavior: 'smooth', // 移動效果
        })
    }

    // 導覽列清單
    const navbarList = [
        {
            to: '',
            title: '商品描述',
        },
        {
            to: 'method',
            title: '送貨及付款方式',
        },
        {
            to: 'score',
            title: '顧客評價',
        },
    ]

    return (
        <div className='product-additionalInfo-container' ref={additionalInfoRef}>
            <nav className='product-additionalInfo-navbar'>
                {navbarList.map((item, index) => {
                    return (
                        <NavLink
                            to={item.to}
                            key={index}
                            className='product-additionalInfo-items'
                            end
                            style={({ isActive }) => ({
                                borderBottom: isActive ? '2px solid #00b894' : '',
                            })}
                            onClick={() => handlePageGoToTop()}
                        >
                            {item.title}
                        </NavLink>
                    )
                })}
            </nav>
            <Outlet context={{ descriptionImages }} />
        </div>
    )
}
export default ProductAdditionalInfoSection
