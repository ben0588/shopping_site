import { BsSearch } from 'react-icons/bs'
import { FiMenu } from 'react-icons/fi'

const ProductSearch = ({ search, setSearch, handleSearchProduct, menuIsOpen, setMenuIsOpen, setIsGoToTop }) => {
    // 處理搜尋商品判斷驗證
    return (
        <span className='product-search-container'>
            <label htmlFor='product-search-input' className='product-search-label'>
                搜尋商品{' '}
            </label>
            <input
                type='search'
                className='product-search-input'
                id='product-search-input'
                placeholder='請輸入商品名稱'
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                value={search}
                // 判斷按下 Enter 才觸發
                onKeyDown={(e) => handleSearchProduct(e)}
            />
            <BsSearch
                className='product-search-icon'
                title='搜尋商品'
                onClick={(e) => {
                    handleSearchProduct(e)
                }}
            />
            <FiMenu className='product-menu-icon' onClick={() => setMenuIsOpen(!menuIsOpen)} />
        </span>
    )
}
export default ProductSearch
