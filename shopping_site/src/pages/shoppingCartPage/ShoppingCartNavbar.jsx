import { NavLink } from 'react-router-dom'

const ShoppingCartNavbar = (props) => {
    const { navbarList, page, handlePage } = props
    return (
        <nav className='shopping-navbar'>
            <ul className='shopping-navbar-inner'>
                {navbarList &&
                    navbarList?.map((item, index) => {
                        return (
                            <li key={index} className='shopping-navbar-items'>
                                <span
                                    // 控制圓形顏色
                                    className={`shopping-navbar-round 
                                        ${page >= index + 1 ? 'round-color' : ''} 
                                        ${page > index + 1 ? 'round-active' : ''} 
                                        `}
                                >
                                    {index + 1}
                                </span>
                                <NavLink
                                    className={`shopping-navbar-text`}
                                    to={item.link}
                                    onClick={() => handlePage(index + 1)} // 控制當前頁數
                                    // onClick={(e) => e.preventDefault()} // 不可換頁
                                    end
                                    style={({ isActive }) => ({
                                        color: isActive ? '#00b894' : '#000',
                                    })}
                                    title={`前往 ${item.title} 頁面`}
                                >
                                    {item.title}
                                </NavLink>
                            </li>
                        )
                    })}
            </ul>
        </nav>
    )
}
export default ShoppingCartNavbar
