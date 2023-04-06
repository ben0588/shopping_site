import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro' // styled-components 套件
import AuthContext from '../../components/auth/AuthContext'
// 客製化動態選單
const NavbarItems = styled.li`
    // 每個項目右邊 & 底下新增框線
    border-right: 2px solid black;
    width: 100%;
    height: auto;

    // 最後一個項目右邊不新增框線
    &:nth-of-type(${(props) => props.index && props.index}) {
        border-right: none;
    }
`

function UserInfoNavbar() {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境

    // 控制選單內容及路徑
    const navbarList = [
        { linkText: '個人資料', patch: '' },
        { linkText: '優惠卷', patch: 'coupons' },
        { linkText: '訂單', patch: 'orders' },
        { linkText: '追蹤清單', patch: 'wishlist' },
        { linkText: '修改密碼', patch: 'editPassword' },
    ]

    return (
        <nav className='user-info-navbar'>
            <ul className='user-info-inner-navbar'>
                {navbarList.map((item, index) => {
                    return (
                        <NavbarItems
                            className='user-info-navbar-items'
                            key={index}
                            index={navbarList.length} // 控制間隔符號
                        >
                            <NavLink
                                className='user-info-navbar-text'
                                to={item.patch}
                                // 控制選取時給予狀態樣式
                                style={({ isActive }) => ({
                                    borderBottom: isActive ? '2px solid white' : '2px solid black',
                                    // backgroundColor: isActive ? 'white' : 'rgb(0, 184, 148,.5)',
                                    backgroundColor: isActive ? 'white' : '#00b894',
                                    fontWeight: isActive ? 'bolder' : '500',
                                })}
                                onClick={() => {}}
                                end // 加上 end 在切換其他分頁時，預設index則不會被匹配成活動中
                            >
                                {item.linkText}
                            </NavLink>
                        </NavbarItems>
                    )
                })}
            </ul>
        </nav>
    )
}

export default UserInfoNavbar
