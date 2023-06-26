import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';
import { GrFormAdd } from 'react-icons/gr';
import { useState } from 'react';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';

import styled from 'styled-components';
const MenuSidebar = styled.aside`
    // 控制手機板與桌機板顯示寬度
    width: ${(props) => (props.isOpen ? '50%' : '25%')};

    // 控制手機板顯示，桌機板隱藏設定
    @media screen and (max-width: 568px) {
        display: ${(props) => (props.isOpen ? 'flex' : 'none')};
    }
`;
const ProductSidebar = ({ sidebarList, subcategory, handleProductAll, menuIsOpen, setMenuIsOpen, setIsGoToTop }) => {
    const [click, setClick] = useState(null); // 控制點擊展開子菜單

    // 處理主類型展開顯示子類型按鈕
    const handleSidebarToggle = (index) => {
        /*
            #0- 初始 null = 不展開任何區塊
            #1- 主類型 index 分別為 0 、 1 、 2
            #2- 子類型 .product-sidebar-text 預設height:0，高度隱藏
            #3- class設定useState送入的index與當前對應的區塊的index相同實惠加上.open屬相，height:auto展開區塊
            #4- 新增此切換狀態 fn
                #4-1 當點擊時會把對應主類型 index 送入
                #4-2 送入的 index 更新進 useState 狀態數字中
                #4-3 送入的 index 比對 與上一個點擊時更新的 useState 相同時給予 null
                #4-4 此時對應的子目錄 不符合相同值，會把.open 屬性拿掉，變回height:0 的狀態
        */
        if (click === index) {
            return setClick(null);
        }
        setClick(index);
    };

    return (
        <MenuSidebar className='product-sidebar-container' isOpen={menuIsOpen}>
            <nav className='product-sidebar-menu'>
                <ul className='product-sidebar-inner'>
                    <li className='product-sidebar-title'>
                        {/* 回道預設全部商品頁面 */}
                        <NavLink
                            to=''
                            onClick={() => {
                                handleProductAll && handleProductAll(); // 回到首頁
                                setMenuIsOpen && setMenuIsOpen(false); // 關閉選單
                            }}
                        >
                            全部商品
                        </NavLink>
                    </li>
                    {sidebarList?.map((item, index) => {
                        return (
                            <li className={`product-sidebar-items `} key={index}>
                                <button
                                    className={`product-sidebar-btn ${click === index ? 'sidebar-btn-active' : ''}`}
                                    onClick={(e) => {
                                        handleSidebarToggle(index); // 此index影響下層顯示區塊
                                    }}
                                >
                                    {/* 取得按下時的參數，後續用來進行篩選 */}
                                    {/* <NavLink to={`?category=${item.category}`}>{item.category}</NavLink> */}
                                    <NavLink
                                        to={`/product/?category=${item.category}`}
                                        onClick={() => {
                                            setMenuIsOpen && setMenuIsOpen(false); // 開啟子項目
                                            setIsGoToTop && setIsGoToTop(true); // 回到頂端
                                        }}
                                    >
                                        {item.category}
                                    </NavLink>
                                    <span className='product-sidebar-icon'>
                                        {click === index ? (
                                            <IoIosArrowUp className='product-type-icon' />
                                        ) : (
                                            <IoIosArrowDown className='product-type-icon' />
                                        )}
                                    </span>
                                </button>
                                {/* 當index 與 useState 狀態數字相同，才會展開子選單 */}
                                <div className={`product-sidebar-text ${click === index ? 'open' : ''}`}>
                                    {item?.subCategoryList?.map((item, index) => {
                                        // console.log(item)
                                        return (
                                            <NavLink
                                                // 取得按下時的參數，後續用來進行篩選
                                                to={`/product/?subcategory=${item}`}
                                                key={index}
                                                className={`product-sidebar-link`}
                                                style={({ isActive }) => ({
                                                    // 除了選取時給予顏色，還要判斷當前子選項要與項目相同才變色
                                                    color: isActive && item === subcategory ? '#00b894' : 'black',
                                                })}
                                                onClick={() => {
                                                    setMenuIsOpen && setMenuIsOpen(false); // 開啟子項目
                                                    setIsGoToTop && setIsGoToTop(true); // 回到頂端
                                                }}
                                            >
                                                {item}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </MenuSidebar>
    );
};
export default ProductSidebar;
