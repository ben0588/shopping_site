import ProductSidebar from './ProductSidebar'
// 左側資料顯示欄位

const ProductMenu = ({ sidebarList, subcategory, menuIsOpen, setMenuIsOpen, handleProductAll }) => {
    return (
        <section
            className='product-menu-container'
            style={{
                // display: menuIsOpen ? 'flex' : 'none', // 直接顯示(不可增加動畫)
                // width: menuIsOpen ? '100%' : '0', // 一次展開(選單文字會累加，所以改以下)
                left: menuIsOpen ? '0' : '-100%', // 控制從左到右
            }}
        >
            <ProductSidebar
                sidebarList={sidebarList} // 商品類型
                subcategory={subcategory} // 商品子類型
                handleProductAll={handleProductAll} // 全到預設全部商品
                menuIsOpen={menuIsOpen}
                setMenuIsOpen={setMenuIsOpen}
            />
            <div className='product-menu-toggle' onClick={() => setMenuIsOpen(!menuIsOpen)}></div>
        </section>
    )
}
export default ProductMenu
