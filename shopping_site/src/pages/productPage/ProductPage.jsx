import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify' // 引用 react-toastify 使用吐司提示
import 'react-toastify/dist/ReactToastify.css' // 引用 react-toastify 使用吐司樣式

import { ReactComponent as LoveBeforeIcon } from '../../images/icon/love_1_icon.svg'
import { ReactComponent as LoveAfterIcon } from '../../images/icon/love_icon.svg'
import styled from 'styled-components'
import ProductSidebar from './ProductSidebar'
import ProductNavbar from './ProductNavbar'
import ProductSearch from './ProductSearch'
import ProductPagination from './ProductPagination'
import Loading from '../../components/common/Loading'
import ProductContext from '../../components/payment/ProductContext'
import ProductAdvertiseSection from './ProductAdvertiseSection'
import ProductMenu from './ProductMenu'
// import productDataJson from '../../productData_1.json'
// import { products } from '../../data.jsx'
// console.log(JSON.stringify(products))

const ProductColor = styled.input`
    margin: 10px 0 5px 15px;
    width: 26px;
    height: 26px;
    display: inline-block;
    accent-color: #636e72; // 變色
    position: absolute;
    right: 10px;
    bottom: 5px;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        background-color: ${(props) => props && props.color}; // 控制主要中心顏色
        border-radius: 50%;
        padding: 5%;
    }
`

// 左側資料顯示欄位
const sidebarList = [
    {
        category: '網球拍',
        subCategoryList: ['高階網球拍', '中階網球拍', '初階網球拍', '兒童網球拍'],
    },
    {
        category: '網球線',
        subCategoryList: ['聚酯纖維網球線', '羊腸網球線', '仿羊腸網球線', '克維拉網球線'],
    },
    {
        category: '網球',
        subCategoryList: ['比賽級網球', '中階網球', '初階網球', '兒童初階網球', '練習網球'],
    },
    {
        category: '配件',
        subCategoryList: ['拍包袋', '握把布', '避震器', '運動護具', '運動毛巾', '其他'],
    },
    {
        category: '服飾',
        subCategoryList: ['男裝', '女裝', '兒童裝'],
    },
    {
        category: '鞋子',
        subCategoryList: ['男鞋', '女鞋', '兒童鞋'],
    },
]

const ProductPage = () => {
    const [productData, setProductData] = useState([]) // 存取初次取得的商品資料
    const [filterProductListData, setFilterProductListData] = useState([]) // 篩選後的全部商品資料
    const [filterProductData, setFilterProductData] = useState([]) // 篩選後的商品資料(卡片顯示數量10)
    const [searchParams, setSearchParams] = useSearchParams() // 存取 URL 參數
    const productId = useParams() // 取得 pid 參數網址
    const [category, setCategory] = useState('') // 存取當前種類
    const [subcategory, setSubcategory] = useState('') // 存取當前子種類
    const [pagination, setPagination] = useState([]) // 存取總商品筆數
    const [pages, setPages] = useState('') // 當前頁數
    const [search, setSearch] = useState('') // 記錄搜尋商品文字
    const { pid } = useParams() // 判斷是否有進入商品詳情
    const [infoList, setInfoList] = useState([]) // 取得對應商品編號的商品
    const navigator = useNavigate() // 導航
    const [searchState, setSearchState] = useState() // 判斷是否搜尋文字後面有x清除選擇按鈕
    const { productContextValues } = useContext(ProductContext) // 商品環境
    const { handleProductIsLoading } = productContextValues
    const [menuIsOpen, setMenuIsOpen] = useState(false) // 判斷是否開啟左側菜單
    const [isGoToTop, setIsGoToTop] = useState(false) // 控制是否要回到頂部

    // 控制有進行切換分頁時 & 進入商品詳情，會自動回到最上方
    // useEffect(() => {
    //     if (searchParams.get('page') || pages || productId.pid) {
    //         // console.log(searchParams.get('page'))
    //         // console.log(pages)
    //         // console.log(productId.pid)
    //         window.scrollTo({
    //             top: 0,
    //             behavior: 'smooth', // 移動效果
    //         })
    //     }
    // }, [searchParams, pages, productId])

    // 初始至頂
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    // 控制切換分頁跟進入商品詳情至頂
    useEffect(() => {
        if (isGoToTop || productId.pid) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
            setIsGoToTop(false)
        }
    }, [isGoToTop])

    // 處理商品分頁判斷
    const handlePagination = (value) => {
        const listNum = Math.ceil(value[0]?.products?.length / 10) // 無條件進位
        const newArray = Array.from({ length: listNum }, (value, index) => index + 1) // 創建陣列，用來創建分頁功能
        setPagination(newArray) // 更新需要的頁數
        setPages(1) // 紀錄初始頁數 1
        handleProductSlice(1, value) // 重新切割出商品序列
    }

    // 取得全部商品資料
    useEffect(() => {
        ;(async () => {
            try {
                handleProductIsLoading(true) // 開始加載
                const result = await axios.get('/productData.json')
                if (result) {
                    // setProductData(result.data) // 初次紀錄原始資料
                    // setFilterProductData(result.data) // 後續用來篩選用的
                    const list = [{ products: result.data[0].products.slice(0, 10) }] // 改成下一層卡片元件要的格式
                    setProductData(result.data) // 初次紀錄原始資料
                    setFilterProductData(list) // 後續用來篩選用的
                    handlePagination(result.data) // 初次更新商品數量及分頁
                    handleProductIsLoading(false) // 關閉加載
                }
            } catch (error) {
                toast.error(`${error}`, {
                    position: 'top-left',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                })
            }
        })()
    }, [])

    // 獲取詳情商品資料
    const handleProductInfoList = async () => {
        return new Promise((resolve, reject) => {
            const filterList = productData?.[0]?.products.filter((item) => item.pid === parseInt(pid))
            if (filterList) {
                resolve(filterList)
            } else {
                reject('取得錯誤')
            }
        })
    }

    // 監控當 id 有進行更改時，就呼叫取得對應資料
    useEffect(() => {
        if (pid && productData.length > 0) {
            ;(async () => {
                try {
                    const result = await handleProductInfoList() // 取得單一商品詳情
                    if (result) {
                        setInfoList(result[0]) // 更新詳情內容
                        setCategory(result[0].category) // 更新當前類型
                        setSubcategory(result[0].subCategory) // 更新當前子類型
                    }
                } catch (error) {
                    toast.error(`取得單一商品詳情失敗...`, {
                        position: 'top-left',
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                    })
                }
            })()
        }
    }, [pid, productData])

    // 處理商品篩選類型、子類型
    const handleProductCategory = (category, newCategory) => {
        if (category === 'category') {
            const objectArrayToList = Object.values(productData[0]) // 陣列不是純陣列，轉純陣列
            const newList = objectArrayToList[0].filter((items, index) => {
                // 篩選，當點擊類型，會進行篩選
                return items.category === newCategory
            })
            const list = [{ products: newList }] // 改成下一層卡片元件要的格式
            setFilterProductListData(list) // 紀錄篩選後全部商品資料
            setFilterProductData(list) // 更新卡片顯示 (會切割只顯示10筆)
            handlePagination(list) // 重新改變分頁
        }
        if (category === 'subcategory') {
            const objectArrayToList = Object.values(productData[0]) // 陣列不是純陣列，轉純陣列
            const newList = objectArrayToList[0].filter((items, index) => {
                // 篩選，當點擊子類型，會進行篩選
                return items.subCategory === newCategory
            })
            const list = [{ products: newList }] // 改成下一層卡片元件要的格式
            setCategory(newList[0].category) // 選擇子目錄時連同根目錄進行更新
            setFilterProductData(list)
            handlePagination(list) // 重新改變分頁
        }
    }

    // 處理回到主目錄(全部商品)
    const handleProductAll = () => {
        setCategory(null) // 清除種類
        setSubcategory(null) // 清除子種類
        handlePagination(productData) // 恢復初始資料判斷出所需要頁面
        handleProductSlice(1, productData) // 回到預設第一頁 + 初始全部資料
        setSearchState(false) // 關閉子層顯示 X 符號
        setFilterProductListData(productData) // 清除上次搜尋結果且恢復原始分頁資料
        setIsGoToTop(true)
    }

    // 網頁監控當點擊商品類型+商品子類型，才會觸發篩選商品+切割畫面
    useEffect(() => {
        // 當URL參數 category 存在才更新狀態
        if (searchParams.get('category') && productData[0]) {
            let newCategory = searchParams.get('category')
            setCategory(newCategory) // 更新目錄
            setSubcategory(null) // 清除子目錄
            handleProductCategory('category', newCategory) // 篩選類型
        }
        if (searchParams.get('subcategory') && productData[0]) {
            let newCategory = searchParams.get('subcategory')
            setSubcategory(newCategory)
            handleProductCategory('subcategory', newCategory) // 篩選子類型
        }
    }, [searchParams])

    // 切割分頁功能 + 分頁顯示正確資料
    const handleProductSlice = (pages, value) => {
        // 新增判斷，當送進來的資料是空陣列，就使用初次取得全部商品的資料，否則就使用篩選後的全部資料
        const newValue = value.length === 0 ? productData : value
        // 使用.slice(初始陣列位置0, 目標陣列範圍10) = 切割10筆新陣列，
        const newPages = pages * 10 // 目標範圍 ex: 第一頁 = 10
        const firstPages = newPages - 10 // 初始範圍 ex: 第一頁 = 0
        const list = [{ products: newValue?.[0]?.products?.slice(firstPages, newPages) }] // 改成下一層卡片元件要的格式
        setFilterProductData(list) // 更新卡片層顯示的數量
        setPages(pages) // 紀錄頁數
    }
    // 上一頁
    const handlePrevPages = () => {
        setPages((pre) => handleProductSlice(pre - 1, filterProductListData))
    }
    // 下一頁
    const handleNextPages = () => {
        setPages((pre) => handleProductSlice(pre + 1, filterProductListData))
    }

    // 處理搜尋商品篩選
    const handleSearchProduct = (e) => {
        if (search == '' || search == ' ') {
            setSearch('')
        } else {
            // e.nativeEvent.isComposing 判斷是 false (不再輸入中時按下Enter才觸發篩選，因為選字中按下Enter也會觸發搜尋)
            if ((e.code === 'Enter' && !e.nativeEvent.isComposing) || e.type === 'click') {
                // const value = e.target.value || search  // 因要按下搜尋icon也觸發+輸入框時已經會修改
                setIsGoToTop(true)
                // ---- 使用初次的產品資料進行匹配搜尋結果
                const filterList = productData[0].products.filter((item) => item.name.includes(search))
                const list = [{ products: filterList }] // 改成下一層卡片元件要的格式
                navigator('') // 回到全商品畫面
                handlePagination(list) // 更新所需要的頁數
                setFilterProductListData(list) // 紀錄篩選後全部資料
                handleProductSlice(1, list) // 更新當前商品分頁+篩選畫面的10筆資料，預設回到第一頁
                setSearch('') // 清空搜尋欄位
                setCategory(`Search:${search}`) // 更新獨有的 search 種類
                setSubcategory(null) // 清除上一個商品子類型
                setSearchState(true) // 告訴子層當前是搜尋並有 X 可清除按鈕
            }
        }
    }

    /* 
        2023/3/31 紀錄:
        
            當前做法是透過取得所有商品資料後，再依據數量最大值去切所需要每頁，依據每頁10個去切出資料，
            因當前時間考量，後端新增商品資料部分開發未完成，待未來轉職成功後再次新增以下 :
            未來新增 商品api，有page參數，還有max-page商品最大頁數，且每頁 limit 限制10筆，
            只需產生商品最大頁數的array的分頁器，透過每頁給予的page參數後重新取出每頁固定10個商品的頁面，
    
            #也許可以將取得資料放入 ProductContext 中 ?
    */

    return (
        <>
            <section className='product-container'>
                <ToastContainer pauseOnFocusLoss={false} />
                <ProductMenu
                    // 左側商品類型 & 子類型 側邊欄位
                    sidebarList={sidebarList} // 商品類型
                    subcategory={subcategory} // 商品子類型
                    menuIsOpen={menuIsOpen} // 是否開啟選單
                    setMenuIsOpen={setMenuIsOpen} // 是否開啟選單 ( 手機板才用得到 )
                    handleProductAll={handleProductAll} // 全到預設全部商品
                />

                {sidebarList && (
                    <ProductSidebar
                        // 左側商品類型 & 子類型 側邊欄位
                        sidebarList={sidebarList} // 商品類型
                        subcategory={subcategory} // 商品子類型
                        handleProductAll={handleProductAll} // 全到預設全部商品
                        setIsGoToTop={setIsGoToTop} // 回到頂端
                    />
                )}

                {/* 上方廣告橫幅欄位 */}
                <div className='product-content-container'>
                    <ProductAdvertiseSection />

                    <div className='product-navbar-container'>
                        <ProductNavbar
                            // 廣告列下方當前路徑導覽列
                            category={category} // 商品類型
                            subcategory={subcategory} // 商品子類型
                            searchState={searchState} // 判斷搜尋結果 是否要顯示 x 按鈕
                            handleProductAll={handleProductAll} // 返回主目錄(全部商品)按鈕
                        />
                        <ProductSearch
                            // 廣告列下方搜尋欄位元件
                            search={search} // 搜尋文字
                            setSearch={setSearch} // 更新搜尋文字狀態
                            handleSearchProduct={handleSearchProduct} // 使用搜尋文字搜尋後的新商品
                            menuIsOpen={menuIsOpen}
                            setMenuIsOpen={setMenuIsOpen} // 控制是否開啟左側選單
                            setIsGoToTop={setIsGoToTop} // 回到頂端
                        />
                    </div>

                    <div className='product-content-all'>
                        {/* 切換主要是商品卡面與各商品詳情內容，篩選還沒出來就無法進入詳情 */}
                        <Outlet
                            context={[
                                filterProductData,
                                subcategory,
                                infoList,
                                searchState,
                                setSearchState,
                                setIsGoToTop,
                            ]}
                        />
                    </div>

                    {/* 當有取得商品編號就不顯示以下分頁元件 */}
                    {!pid && (
                        <nav className='product-content-pagination'>
                            {/* 分頁元件欄位 */}
                            <ProductPagination
                                filterProductData={filterProductData}
                                pages={pages} // 當前頁數
                                setIsGoToTop={setIsGoToTop} // 回到頂端
                                pagination={pagination} // 總頁數
                                filterProductListData={filterProductListData} // 篩選後總商品資料
                                handleProductSlice={handleProductSlice} // 切割分頁功能
                                handlePrevPages={handlePrevPages} // 上一頁
                                handleNextPages={handleNextPages} // 下一頁
                            />
                        </nav>
                    )}
                </div>
            </section>
        </>
    )
}
export default ProductPage
