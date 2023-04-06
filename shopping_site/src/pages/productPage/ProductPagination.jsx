import { IoIosArrowForward } from 'react-icons/io'
import { IoIosArrowBack } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

const ProductPagination = ({
    pages,
    filterProductData,
    pagination,
    filterProductListData, // 種類篩選後的全部資料(>10筆)
    handleProductSlice,
    handlePrevPages,
    handleNextPages,
    setIsGoToTop,
}) => {
    // 下方分頁判斷

    return (
        <>
            {pages !== 1 ? (
                <IoIosArrowBack
                    className='product-pagination-icon'
                    onClick={() => {
                        handlePrevPages && handlePrevPages()
                        setIsGoToTop && setIsGoToTop(true)
                    }}
                />
            ) : (
                ''
            )}
            {pagination &&
                pagination?.map((item, index) => {
                    return (
                        <NavLink
                            key={index}
                            className='product-pagination-items'
                            onClick={(e) => {
                                if (filterProductListData) {
                                    //傳入當前頁數+篩選後全部的資料
                                    handleProductSlice(item, filterProductListData)
                                    setIsGoToTop(true)
                                }
                            }}
                            to={`?page=${item}`}
                            style={({ isActive }) => ({
                                backgroundColor: item === pages && isActive ? ' #00b894' : '#dfe6e9',
                            })}
                        >
                            {' '}
                            {item}
                        </NavLink>
                    )
                })}

            {/* 單頁商品數量等於10，才顯示 */}
            {filterProductData && filterProductData?.[0]?.products?.length >= 10 ? (
                <IoIosArrowForward
                    className='product-pagination-icon'
                    onClick={() => {
                        handleNextPages && handleNextPages()
                        setIsGoToTop && setIsGoToTop(true)
                    }}
                />
            ) : (
                ''
            )}
        </>
    )
}
export default ProductPagination
