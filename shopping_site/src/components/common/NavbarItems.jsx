import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components/macro' // styled-components 套件
import { ThemeContext } from '../theme/ThemesContext'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'
import AuthContext from '../auth/AuthContext'

const NavbarItemsLi = styled.li`
    color: ${(props) => props.foreground && props.foreground};
    background-color: ${(props) => props.background && props.background};

    // 每個項目後面新增|分隔符號
    &::after {
        content: '|';
        position: absolute;
        right: 0;
        height: 20px;
    }

    // 最後一個不設置|分隔符號
    &:nth-of-type(${(props) => props.index && props.index})::after {
        content: '';
    }
`

const NavbarItems = ({ navbarList, menuToggle, setMenuToggle, display, handledShowDisplay, handledHiddenDisplay }) => {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const [goLink, setGoLink] = useState(0) // 控制按下全部商品第二下才會觸發跳轉
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境
    const { handlerTitleUpdate, handleIsGoToTop } = contextValue

    // useEffect(() => {
    //     console.log(goLink)
    // }, [goLink])
    return (
        <>
            {navbarList.map((item, index) => {
                return (
                    <NavbarItemsLi
                        className='navbar-items'
                        key={index}
                        foreground={theme.foreground}
                        background={theme.background}
                        index={navbarList.length}
                    >
                        {item.linkText === '全部商品' ? (
                            <div
                                className='product-all-items'
                                onMouseOver={handledShowDisplay} // 滑鼠進入時改成flex
                                onMouseLeave={handledHiddenDisplay} // 滑鼠離開時改成none
                                // 滑鼠按下時才會出發
                                // onClick={() => {
                                //     if (display === 'none') {
                                //         handledShowDisplay()
                                //     }
                                //     if (display === 'flex') {
                                //         handledHiddenDisplay()
                                //     }
                                // }}
                            >
                                <NavLink
                                    to={item.patch}
                                    // 透過style方式以routV6官方具名{isActive}屬性去設定此頁訪問中
                                    style={({ isActive }) => ({
                                        color: isActive ? '#00b894' : theme.foreground,
                                    })}
                                    // className={item.linkText === '全部商品' ? 'product-all-items' : 'navbar-items-text'}
                                    className='navbar-items-text'
                                    // 每次按完導航就會讓 RWD 568 選單關閉
                                    onClick={(e) => {
                                        setMenuToggle(!menuToggle) // 關閉選單
                                        handlerTitleUpdate && handlerTitleUpdate(e.target.text) // 更新網頁標題名稱
                                        handleIsGoToTop && handleIsGoToTop() // 回到頂端

                                        // 控制要按下兩次才會觸發導航前往
                                        // if (goLink === 0) {
                                        //     e.preventDefault() // 初始阻擋事件發生
                                        //     setGoLink(1) // 改成1
                                        // }
                                        // if (goLink === 1) {
                                        //     // ...前往指定頁面
                                        //     setGoLink(0) // 改成0 (初始)
                                        // }
                                    }}
                                >
                                    {item.linkText}
                                    {/* 控制 icon 顯示箭頭方向 */}
                                    {display === 'flex' ? (
                                        <IoIosArrowUp className='product-type-icon' />
                                    ) : (
                                        <IoIosArrowDown className='product-type-icon' />
                                    )}
                                </NavLink>
                            </div>
                        ) : (
                            <NavLink
                                to={item.patch}
                                // 透過style方式以routV6官方具名{isActive}屬性去設定此頁訪問中
                                style={({ isActive }) => ({
                                    color: isActive ? '#00b894' : theme.foreground,
                                })}
                                // className={item.linkText === '全部商品' ? 'product-all-items' : 'navbar-items-text'}
                                className='navbar-items-text'
                                // 每次按完導航就會讓 RWD 568 選單關閉
                                onClick={(e) => {
                                    setMenuToggle(!menuToggle) // 關閉選單
                                    handlerTitleUpdate && handlerTitleUpdate(e.target.text) // 更新網頁標題名稱
                                    handleIsGoToTop && handleIsGoToTop() // 回到頂端
                                }}
                            >
                                {item.linkText}
                            </NavLink>
                        )}
                    </NavbarItemsLi>
                )
            })}
        </>
    )
}
export default NavbarItems
