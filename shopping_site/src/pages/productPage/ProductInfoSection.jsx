import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
// import { BiZoomIn } from 'react-icons/bi'
import zoomInSvg from '../../images/icon/zoom_icon.svg'
import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AiOutlineHeart } from 'react-icons/ai'
import { AiFillHeart } from 'react-icons/ai'
import { BsFacebook } from 'react-icons/bs'
import { BsLine } from 'react-icons/bs'
import { AiFillTwitterCircle } from 'react-icons/ai'
import { FaLine } from 'react-icons/fa'
import { CiRuler } from 'react-icons/ci'
import ProductAdditionalInfoSection from './ProductAdditionalInfoSection'
import ProductContext, { ProductProvider } from '../../components/payment/ProductContext'

function ProductIInfoPage() {
    const { productContextValues } = useContext(ProductContext) // 管理購物車&追蹤清單 useContext
    const {
        handleProductAddCart,
        handleNumberToTw,
        handleProductAddWish,
        handleDeleteWishList,
        handleProductDeleteWish,
    } = productContextValues // 把方法結構出來
    const [filterProductData, subcategory, infoList, searchState, setSearchState, setPages] = useOutletContext() // 取得最上層Outlet傳的資料
    const {
        pid,
        color,
        name,
        description,
        descriptionImages,
        images,
        thumbnail,
        size,
        stock,
        category,
        subCategory,
        price,
        checked,
    } = infoList // 把要的資訊結構出來

    const [selectSize, setSelectSize] = useState('') // 紀錄選擇尺寸
    const [selectSizeStock, setSelectSizeStock] = useState('') // 紀錄初始尺寸對應庫存數量
    const [stockNumber, setStockNumber] = useState('') // 每次點擊有庫存商品顯示正確庫存
    const [showImage, setShowImage] = useState('') // 紀錄要放大的圖片
    const [imageToggle, setImageToggle] = useState(false) // 控制放大圖片關閉
    const [number, setNumber] = useState([]) // 控制可購買數量
    const [addNumber, setAddNumber] = useState(1) // 選擇購買的數量

    // 分享按鈕清單
    const shareList = [
        // { id: 1, name: 'facebook', url: `https://www.facebook.com/sharer.php?u=${window.location.href}` },
        {
            id: 1,
            name: 'facebook',
            url: `https://www.facebook.com/sharer.php?href=${window.location.href}`,
        },
        // {
        //     id: 2,
        //     name: 'Instagram',
        //     url: `http://instagram.com/sharer.php?u=${window.location.href}`,
        // },
        { id: 3, name: 'line', url: `http://line.naver.jp/R/msg/text/?${window.location.href}` },
        { id: 4, name: 'Twitter', url: `https://twitter.com/share?text=&url=${window.location.href}` },
    ]

    // 初始取得對應尺寸的庫存數量
    useEffect(() => {
        if (infoList && size) {
            ;(() => {
                const sizeList = size?.map((_, index) => {
                    return stock[index]
                })
                setSelectSizeStock(sizeList) // 更新初次商品庫存對應數量
                setStockNumber(sizeList[0]) // 預設顯示第一個商品庫存數量
            })()
        }
    }, [infoList])

    // 初始取得首張圖片
    useEffect(() => {
        if (infoList && images) {
            ;(() => {
                const imagesList = images[0] // 取第一章圖
                setShowImage(imagesList) // 初始化
            })()
        }
    }, [infoList])

    // 處理取得庫存對應數量
    const handleGetSizeNumber = (e, index) => {
        // 庫存是0就不處理
        if (selectSizeStock[index] == 0) {
            e.preventDefault() // 取消
        } else {
            setSelectSize(e.target.innerText) // 取得點擊的尺寸 (顯示在畫面上)
            setStockNumber(selectSizeStock[index]) // 取得對應資料中的庫存數量
        }
    }

    // 初始取得第一個尺寸項目 (預設第一個是選擇)
    useEffect(() => {
        if (size) {
            ;(() => {
                const first = size[0]
                setSelectSize(first)
            })()
        }
    }, [size])

    // 控制處理當前可購買數量
    useEffect(() => {
        if (stockNumber) {
            const newList = Array.from(Array(parseInt(stockNumber)), (d, i) => i + 1)
            setNumber(newList)
        }
    }, [stockNumber])

    // 處理增加減少商品
    const handleProductNumber = (type, value) => {
        switch (type) {
            case 'CHANGE':
                // 手動輸入時改變內容
                setAddNumber(value)
                break

            case 'ADD':
                // 當商品數量等於庫存數量，就無法新增
                if (addNumber === parseInt(stockNumber)) {
                    setAddNumber(parseInt(stockNumber))
                } else {
                    setAddNumber((pre) => pre + 1)
                }
                break

            case 'REDUCE':
                // 商品數量不可選擇少於1
                if (addNumber === 1) {
                    setAddNumber(1)
                } else {
                    setAddNumber((pre) => pre - 1)
                }
                break

            default:
                return addNumber
        }
    }

    // 處理再輸入框中禁止滾輪滑動
    const handlerOnWheel = (e) => {
        e.target.blur()
    }
    // 處理在輸入框中輸入指定按鈕時無效
    const handlerOnKeyDown = (e) => {
        const exceptThisSymbols = ['e', 'E', '+', '-', '.'] // 避免input被輸入特殊格式
        // 為避免可以輸入 e E + - . 特殊符號，使用 includes 去判斷，如果是就取消預設行為
        exceptThisSymbols.includes(e.key) && e.preventDefault()
    }

    // 控制手動輸入時不可大於庫存數量
    const handleInputNumberMax = (e) => {
        let value = parseInt(e.target.value) // 轉存數字
        if (value < 1) {
            // 輸入少於1只能是1
            handleProductNumber('CHANGE', 1)
        } else if (value > parseInt(stockNumber)) {
            // 大於庫存數量時，只能是最大庫存量
            handleProductNumber('CHANGE', parseInt(stockNumber))
        } else if (Number.isNaN(value)) {
            // 若計算出來不是數字，就給預設值1
            handleProductNumber('CHANGE', 1)
        } else {
            // 其他數字都可以進行更新
            handleProductNumber('CHANGE', value)
        }
    }

    // 判斷是否在願望清單中
    const handleCheckInWishList = () => {
        const filterList = productContextValues.state.wishList.filter((item) => item.id === pid)
        return filterList.map((item) => item.id)
    }

    // 新增願望清單
    const handleAddWishListFunction = () => {
        handleProductAddWish(pid, name, category, thumbnail, price, color, selectSize)
    }

    // 移除願望清單
    const handleDeleteListFunction = () => {
        const filterList = productContextValues.state.wishList.filter((item) => item.id !== pid)
        handleProductDeleteWish(filterList)
    }

    console.log(showImage)

    useEffect(() => {
        const newImg = showImage
    }, [])

    return (
        <>
            <section className='product-info-container'>
                {infoList ? (
                    <>
                        <div className='product-info-images'>
                            <div className='product-image-big'>
                                <img
                                    src={process.env.PUBLIC_URL + showImage}
                                    alt={name}
                                    className='product-big-image'
                                    onClick={() => setImageToggle(!imageToggle)} // 點大圖片彈出全畫面更大圖片查看
                                    style={{
                                        // 帶入自訂義svg搜尋icon樣式
                                        cursor: `url(${zoomInSvg}),auto`,
                                    }}
                                />
                            </div>
                            <div className='product-image-small'>
                                {images &&
                                    images.map((item, index) => {
                                        // 取 png 或 img 結尾的圖片
                                        const regexp = /\/images.*(png|img)$/gm
                                        const result = showImage.match(regexp)
                                        // 主圖片的路徑是 網域 + /images/product_rackets_1.png，匹配出來相同，才會有選取效果
                                        return (
                                            <span className='product-small-items' key={index}>
                                                <img
                                                    src={process.env.PUBLIC_URL + item}
                                                    alt={name}
                                                    // 更新大圖示區塊要顯示的照片
                                                    onClick={(e) => {
                                                        // setShowImage(e.target.currentSrc)
                                                        setShowImage(item)
                                                    }}
                                                    className='product-small-image'
                                                    style={{
                                                        border:
                                                            // 控制初次預設第一個商品項目亮起
                                                            result && item == result[0] ? '2px solid #111414' : '',
                                                    }}
                                                />
                                            </span>
                                        )
                                    })}
                            </div>
                            <div className='product-share-container'>
                                分享到{' '}
                                {shareList.map((item) => {
                                    return (
                                        <a target={'_blank'} href={item.url} title={item.name} key={item.id}>
                                            {item.name === 'facebook' ? (
                                                <BsFacebook className='product-share-icon facebook' />
                                            ) : item.name === 'line' ? (
                                                <FaLine className='product-share-icon line' />
                                            ) : (
                                                <AiFillTwitterCircle className='product-share-icon twitter' />
                                            )}
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                        <div
                            className='product-image-show'
                            // 預設隱藏，當按下大圖片時才顯示
                            style={{
                                display: imageToggle ? 'flex' : 'none',
                            }}
                            onClick={() => setImageToggle(!imageToggle)} // 點外層也會關閉顯示
                        >
                            <div className='product-image-show-content'>
                                <img src={process.env.PUBLIC_URL + showImage} alt={showImage} />
                                <AiOutlineClose
                                    className='image-show-close'
                                    onClick={() => setImageToggle(!imageToggle)} // 點 X 關閉 icon 也會進行關閉
                                />
                            </div>
                        </div>

                        <div className='product-info-content'>
                            <h2 className='product-info-name'>{name}</h2>
                            <div className='product-info-price'>
                                <span className='info-price-text'>NT {handleNumberToTw(price)}</span>
                            </div>
                            <h3 className='product-info-description'>{description}</h3>
                            <div className='product-info-color'>
                                <label htmlFor='product-color-input' className='product-color-label'>
                                    商品顏色 :
                                </label>
                                <input
                                    type='radio'
                                    defaultValue={color}
                                    defaultChecked
                                    title={color}
                                    className='product-color-input'
                                    id='product-color-input'
                                    style={{
                                        accentColor: color,
                                    }}
                                />
                            </div>
                            <div className='product-info-size'>
                                <span className='info-size-text'>
                                    {category === '網球拍' && '握把'}尺寸選擇 : {selectSize}
                                </span>
                                {category === '網球拍' && (
                                    <span className='info-size-guide-text'>
                                        <CiRuler className='info-size-guide-icon' />
                                        尺寸指南
                                    </span>
                                )}
                            </div>
                            {category === '網球拍' && (
                                <div className='info-size-guide-content' id='info-size-guide-content'>
                                    <h4>握把尺寸 (英吋)</h4>
                                    <span>
                                        <strong>Size 4"</strong>適合小童、青少年初學者或手較小的女士
                                    </span>
                                    <span>
                                        <strong>Size 4-1/3"</strong>適合一般女士或手較小的男士
                                    </span>
                                    <span>
                                        <strong>Size 4-2/8"</strong>最常見的大小，適合一般男士或手較大的女士
                                    </span>
                                    <span>
                                        <strong>Size 4-3/8"</strong>適合手較大的男士和身高高於6呎的男士
                                    </span>
                                    <span>
                                        <strong>Size 4-5/8"</strong>適合手較大的男士和身高高於6呎的男士
                                    </span>
                                </div>
                            )}

                            <ul className='size-list-container'>
                                {size &&
                                    size?.map((item, index) => {
                                        return (
                                            <li
                                                // 庫存不等於0才有hover效果
                                                className={`size-list-items ${
                                                    selectSizeStock[index] != 0 && 'size-list-hover'
                                                }`}
                                                key={index}
                                                onClick={(e) => {
                                                    handleGetSizeNumber(e, index) // 點尺寸時取得對應庫存數量
                                                    handleProductNumber('CHANGE', 1) // 切換其他尺寸時把數字歸1
                                                }}
                                                title={item}
                                                style={{
                                                    // 判斷，當對應商品尺寸庫存等於0時，加上畫刪除線
                                                    textDecoration:
                                                        selectSizeStock[index] == 0 ? 'line-through' : 'initial',
                                                    color: selectSizeStock[index] == 0 ? '#636e72' : '#000',
                                                    // 判斷，初次第一個選項會是有框選效果的
                                                    border: item == selectSize ? '2px solid black' : '2px solid #ccc',
                                                }}
                                            >
                                                {item}
                                            </li>
                                        )
                                    })}
                            </ul>
                            <div className='product-info-stock'>
                                庫存數量 : <span className='info-stock-text'>{stockNumber}</span>
                            </div>
                            <div className='product-info-number'>
                                <label htmlFor='number-input' className='number-label'>
                                    數量 :
                                </label>

                                <span className='product-number-content'>
                                    <button
                                        type='button'
                                        className='number-reduce-btn'
                                        onClick={() => handleProductNumber('REDUCE')}
                                    >
                                        -
                                    </button>
                                    <input
                                        type='number'
                                        className='number-input'
                                        id='number-input'
                                        max={stockNumber}
                                        min={1}
                                        onChange={(e) => handleInputNumberMax(e)}
                                        value={addNumber}
                                        onWheel={(e) => handlerOnWheel(e)} // 禁止滾動選取數字
                                        onKeyDown={(e) => handlerOnKeyDown(e)} // 手動輸入不能有特殊符號
                                    ></input>
                                    <button
                                        type='button'
                                        className='number-add-btn'
                                        onClick={() => handleProductNumber('ADD')}
                                    >
                                        +
                                    </button>
                                </span>
                                <span
                                    className='number-max-text'
                                    style={{
                                        opacity: addNumber == stockNumber ? '1' : '0',
                                    }}
                                >
                                    數量不可超過當前庫存數
                                </span>
                            </div>

                            <div className='product-info-bt-container'>
                                <button
                                    className='product-info-btn product-info-addCart'
                                    type='button'
                                    onClick={() => {
                                        setPages(null)
                                        // 新增至購物車
                                        handleProductAddCart(
                                            pid,
                                            name,
                                            category,
                                            thumbnail,
                                            price,
                                            addNumber,
                                            color,
                                            selectSize,
                                            stockNumber,
                                            checked
                                        )
                                    }}
                                >
                                    加入購物車
                                </button>
                                <button className='product-info-btn product-info-payment' type='button'>
                                    立即購買
                                </button>
                                <button
                                    className={`product-info-btn product-info-addWish ${
                                        handleCheckInWishList() == pid ? 'isOpen' : ''
                                    }`}
                                    type='button'
                                    onClick={() => {
                                        if (handleCheckInWishList() == pid) {
                                            handleDeleteListFunction()
                                        } else {
                                            handleAddWishListFunction()
                                        }
                                    }}
                                >
                                    {handleCheckInWishList() == pid ? (
                                        <>
                                            <AiFillHeart className='product-wish-after' />
                                            移除追蹤
                                        </>
                                    ) : (
                                        <>
                                            <AiOutlineHeart className='product-wish-before' />
                                            加入追蹤
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className='product-shop-container'>
                                <h4 className='product-shop-title'>超商取貨</h4>
                                <span className='product-shop-text'>滿 $199 免運</span>
                            </div>
                            <div className='product-delivery-container'>
                                <h4 className='product-delivery-title'>宅配到府</h4>
                                <span className='product-delivery-text'>單筆滿 $499 免運</span>
                            </div>
                            <div className='product-store-container'>
                                <h4 className='product-store-title'>門市取貨</h4>
                                <span className='product-store-text'>免運費</span>
                            </div>
                        </div>
                        <ToastContainer />
                    </>
                ) : (
                    <div>...資料讀取更新中</div>
                )}
            </section>
            <ProductAdditionalInfoSection descriptionImages={descriptionImages} />
        </>
    )
}

export default ProductIInfoPage
