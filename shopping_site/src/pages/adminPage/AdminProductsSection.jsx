import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { adminSearchProductApi, getAllProducts, getProducts } from '../../api/api'
import AdminContext from '../../components/auth/AdminContext'
import AdminAddSection from './AdminAddSection'

const AdminProductsSection = () => {
    const [productList, setProductList] = useState([]) // 全部產品列表
    const [page, setPage] = useState([]) // 取當前所需頁數
    const { handleToggleAddPage } = useOutletContext()
    const { adminDefaultValues } = useContext(AdminContext) // 取得管理者上下文
    const { handleGetEditData, handleSetType } = adminDefaultValues // 取要的方法
    // console.log(adminDefaultValues.state)

    // 處理獲得商品資料
    const handleGetAllProducts = async (page = 1) => {
        try {
            // const result = await axios.get('/productDataList.json') // 取得全部商品資料
            // setProductList(result.data.products)
            const result2 = await getProducts(page) // 取得第一頁每次10筆資料
            const result = await getAllProducts() // 取得全部商品資料
            const allDataLength = result.data.products.length / 10 // 所有商品數量
            //  Math.ceil(allDataLength 無條件進位
            const newLengthList = Array.from({ length: Math.ceil(allDataLength) }, (_, index) => index + 1)
            setPage(newLengthList) // 更新當前所需頁數
            setProductList(result2.data.products) // 更新顯示資料
        } catch (error) {
            console.log(error)
        }
    }

    // 初次獲取商品清單
    useEffect(() => {
        handleGetAllProducts()
    }, [])

    // 處理取得單一產品資料
    const handleSingleProduct = async (pid) => {
        try {
            const result = await adminSearchProductApi(pid) // 取得單一產品資料
            console.log(result)
            if (result) {
                handleGetEditData(result.data.product) // 取得資料
                handleToggleAddPage() // 開啟頁面
                handleSetType('edit') // 更新當前要進行編輯
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 處理新增產品按鈕
    const handleAddProduct = () => {
        handleToggleAddPage() // 開啟頁面
        handleSetType('create') // 更新當前要進行新增
    }

    useEffect(() => {
        console.log(productList)
    }, [productList])
    return (
        <>
            <h3 className='admin-products-title'>產品列表</h3>
            <div className='admin-products-add'>
                <button className='admin-products-add-btn' onClick={() => handleAddProduct()}>
                    新增商品
                </button>
            </div>
            <table className='admin-products-table'>
                <thead>
                    <tr>
                        <th>分類</th>
                        <th>子分類</th>
                        <th>名稱</th>
                        <th>編號</th>
                        <th>價格</th>
                        <th>啟用狀態</th>
                        <th>編輯</th>
                    </tr>
                </thead>
                <tbody>
                    {productList &&
                        productList?.map((item, _) => {
                            return (
                                <tr key={item.pid}>
                                    <td>{item.category}</td>
                                    <td>{item.subcategory}</td>
                                    <td>{item.name}</td>
                                    <td>{item.pid}</td>
                                    <td>{item.price}</td>
                                    <td>啟用</td>
                                    <td>
                                        <button
                                            className='admin-products-edit'
                                            onClick={() => {
                                                handleSingleProduct(item.pid)
                                            }}
                                        >
                                            編輯
                                        </button>
                                        <button className='admin-products-delete'>刪除</button>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <nav className='admin-products-page'>
                <ul className='admin-page-pagination'>
                    <li className='admin-page-prev'>&laquo;</li>
                    {page?.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className='admin-page-items'
                                onClick={() => {
                                    handleGetAllProducts(item)
                                }}
                            >
                                {item}
                            </li>
                        )
                    })}
                    <li className='admin-page-next'>&raquo;</li>
                </ul>
            </nav>
        </>
    )
}
export default AdminProductsSection
