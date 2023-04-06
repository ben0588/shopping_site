import { useContext, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { AiOutlineClose } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import { Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { adminAddProductApi, adminEditProductApi } from '../../api/api.js'
import AdminContext from '../../components/auth/AdminContext.jsx'
import InputCheckbox from '../../components/common/InputCheckbox.jsx'
import InputSelect from '../../components/common/InputSelect.jsx'
import InputText from '../../components/common/InputText.jsx'
import InputTextarea from '../../components/common/InputTextarea.jsx'
import { toastOptions } from '../../components/common/Toast.jsx'
import SelectInput from '../../components/hookForm/SelectInput.jsx'
import TextInput from '../../components/hookForm/TextInput.jsx'

// 類型選單列表
const typeList = [
    {
        type: '網球拍',
        subType: [
            {
                subType: '高階網球拍',
            },
            {
                subType: '中階網球拍',
            },
            {
                subType: '初階網球拍',
            },
            {
                subType: '兒童網球拍',
            },
        ],
    },
    {
        type: '網球線',
        subType: [
            {
                subType: '聚酯纖維網球線',
            },
            {
                subType: '羊腸網球線',
            },
            {
                subType: '仿羊腸網球線',
            },
            {
                subType: '克維拉網球線',
            },
        ],
    },
    {
        type: '網球',
        subType: [
            {
                subType: '比賽級網球',
            },
            {
                subType: '中階網球',
            },
            {
                subType: '初階網球',
            },
            {
                subType: '兒童初階網球',
            },
            {
                subType: '練習網球',
            },
        ],
    },
    {
        type: '配件',
        subType: [
            {
                subType: '拍包袋',
            },
            {
                subType: '握把布',
            },
            {
                subType: '避震器',
            },
            {
                subType: '運動護具',
            },
            {
                subType: '運動毛巾',
            },

            {
                subType: '其他',
            },
        ],
    },
    {
        type: '服飾',
        subType: [
            {
                subType: '男裝',
            },
            {
                subType: '女裝',
            },

            {
                subType: '兒童裝',
            },
        ],
    },
    {
        type: '鞋子',
        subType: [
            {
                subType: '男鞋',
            },
            {
                subType: '女鞋',
            },

            {
                subType: '兒童鞋',
            },
        ],
    },
]

const AdminAddSection = ({ toggleAddPage, handleToggleAddPage }) => {
    const navigate = useNavigate() // 用來跳轉網只用
    const [subtypeList, setSubtypeList] = useState([]) // 存放子類型清單
    // const [imagesNameList, setImagesNameList] = useState([]) // 存放選擇那些檔案
    const formRef = useRef(null) // 控制表單DOM
    const defaultValues = {
        name: '',
        category: '',
        subcategory: '',
        description: '',
        descriptionImages: [],
        color: '',
        price: '',
        size: [],
        stock: [],
        createDate: '',
        images: [],
        thumbnail: '',
        is_enabled: false,
    }
    const [formData, setFormData] = useState(defaultValues) //表單主要顯示內容
    const thumbnailRef = useRef(null) // 單張縮圖 files
    const productFilesRef = useRef(null) // 五張商品圖片
    const productDescriptionImagesRef = useRef(null) // 五張商品描述圖片
    const [sizeNumber, setSizeNumber] = useState([]) // 最後的尺寸清單
    const [stockNumber, setStockNumber] = useState([]) // 最後的庫存清單
    const { adminDefaultValues } = useContext(AdminContext) // 管理者環境
    const [titleText, setTitle] = useState('') // 控制卡片標題
    console.log(adminDefaultValues.state)
    // console.log(adminDefaultValues.state.editData)

    console.log()
    // 判斷當前要新增或者編輯
    useEffect(() => {
        if (adminDefaultValues.state.type === 'create') {
            // 如果是新增商品模式下，就帶入預設資料
            setTitle('新增新商品')
            setFormData(defaultValues)
        } else if (adminDefaultValues.state.type === 'edit') {
            // 如果當前狀態類型是編輯，就帶入已有的資料
            const newList = adminDefaultValues.state.editData
            setTitle('編輯商品')
            setFormData(newList)
        }
    }, [adminDefaultValues])

    // 生成當前日期
    const handleDate = () => {
        const date = new Date()
        const year = date.getFullYear() // 取得年份
        const month = date.getMonth() + 1 // 月份從0開始算，所以+1
        const day = date.getDate()
        const createDate = `${year}-${month}-${day}` // 組合格式
        setFormData({
            ...formData,
            createDate: createDate,
        })
    }

    useEffect(() => {
        console.log(formData)
    }, [formData])

    // 新增商品
    const onSubmit = async (e) => {
        try {
            e.preventDefault() // 取消預設送出表單
            handleDate() // 取得日期更新
            const newFormData = new FormData()
            newFormData.append('thumbnail', thumbnailRef.current.files[0])
            newFormData.append('images', productFilesRef.current.files[0])
            newFormData.append('images', productFilesRef.current.files[1])
            newFormData.append('images', productFilesRef.current.files[2])
            newFormData.append('images', productFilesRef.current.files[3])
            newFormData.append('images', productFilesRef.current.files[4])
            newFormData.append('descriptionImages', productDescriptionImagesRef.current.files[0])
            newFormData.append('descriptionImages', productDescriptionImagesRef.current.files[1])
            newFormData.append('descriptionImages', productDescriptionImagesRef.current.files[2])
            newFormData.append('descriptionImages', productDescriptionImagesRef.current.files[3])
            newFormData.append('descriptionImages', productDescriptionImagesRef.current.files[4])
            newFormData.append('name', formData.name)
            newFormData.append('category', formData.category)
            newFormData.append('subcategory', formData.subcategory)
            newFormData.append('description', formData.description)
            newFormData.append('color', formData.color)
            newFormData.append('price', formData.price)
            newFormData.append('createDate', formData.createDate)
            newFormData.append('is_enabled', formData.is_enabled)
            const newSizeList = [...formData.size, ...sizeNumber] // 重新組合尺寸表
            const newStokeList = [formData.stock, ...stockNumber]
            newFormData.append('size', newSizeList)
            newFormData.append('stock', newStokeList)

            if (adminDefaultValues.state.type === 'create') {
                const result = await adminAddProductApi(newFormData) // 新增產品
                console.log(result)
                if (result?.status === 200) {
                    console.log('....新增商品成功')
                    // 新增成功後，清除表單資料，並提示新增成功(談窗)
                    setFormData(defaultValues) // 恢復預設值
                    formRef.current.reset() // 清除表單 file 檔案選擇
                    setSizeNumber([]) // 清除尺寸清單
                    setStockNumber([]) // 清楚庫存清單
                }
            }
            if (adminDefaultValues.state.type === 'edit') {
                console.log(newFormData)
                const result = await adminEditProductApi(formData.pid, formData) // 編輯產品
                console.log('編輯商品', result)
            }
        } catch (error) {
            console.log(error)
        }
    }
    // 處理限制檔案數量
    const handleUploadMulterFiles = (e) => {
        const MAX_LENGTH = 5
        if (Array.from(e.target.files).length > MAX_LENGTH) {
            e.preventDefault()
            console.log('不可超出上限檔案數量')
            const input = formRef.current.elements[e.target.name] // 清除對應的欄位資料
            input.value = ''
        } else {
            console.log('...數量正常，繼續處理 + 預覽照片')
            // 因為 useState 不能保存 files 二進制檔案，後續使用 useRef 取得
        }
    }

    // 控制新增在一組庫存與數量
    const handleSizeStock = () => {
        setSizeNumber([...sizeNumber, ...formData.size])
        setStockNumber([...stockNumber, formData.stock])
        setFormData((pre) => {
            return {
                ...pre,
                size: '',
                stock: '',
            }
        }) // 清空上個輸入的
    }

    // 處理刪除對應庫存內容
    const handleDeleteSizeStock = (index) => {
        console.log(index)
        const newSize = [...sizeNumber]
        const newStock = [...stockNumber]
        newSize.splice(index, 1) // 刪除指定索引位置
        newStock.splice(index, 1)
        setSizeNumber(newSize)
        setStockNumber(newStock)
    }

    // 處理關閉視窗清空+重製內容
    const handleCancelData = () => {
        handleToggleAddPage() // 切換關閉此元件區塊
        setFormData(defaultValues) // 恢復預設值
        formRef.current.reset() // 清除表單 file 檔案選擇
        setSizeNumber([]) // 清除尺寸清單
        setStockNumber([]) // 清楚庫存清單
    }

    // 處理表單內容改變
    const handleChangeValues = (e) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'thumbnail') {
            // 因為 useState 不能保存 files 二進制檔案，後續使用 useRef 取得
            // setFormData({
            //     ...formData,
            //     [name]: e.target.files[0], // 處理單張
            // })
        }
        if (name === 'images' || name === 'descriptionImages') {
            handleUploadMulterFiles(e) // 處理多個檔案時 (判斷是否超出可上傳圖片限制)
        }
        if (['price'].includes(name)) {
            setFormData({
                ...formData,
                [name]: Number(value), // 轉數字
            })
        }
        if (name === 'is_enabled') {
            setFormData({
                ...formData,
                [name]: e.target.checked, // 選取狀態
            })
        }
        if (['stock'].includes(name)) {
            setFormData({
                ...formData,
                [name]: [Number(value)], // 轉數字+陣列
            })
        }
        if (['size'].includes(name)) {
            setFormData({
                ...formData,
                [name]: [value],
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

    // 監控選擇種類後篩選出子種類
    useEffect(() => {
        if (formData.category) {
            const { category } = formData
            const filterList = typeList.filter((item) => item.type === category)
            setSubtypeList(filterList[0].subType)
        }
    }, [formData])

    return (
        <div
            className='admin-add-container'
            style={{
                position: toggleAddPage ? 'fixed' : '',
                display: toggleAddPage ? 'flex' : 'none',
            }}
        >
            {/* <img src={testImg && `http://localhost:8000/${JSON.parse(testImg)}`} alt='' /> */}
            <ToastContainer />
            <form className='admin-add-form' id='admin-add-form' onSubmit={(e) => onSubmit(e)} ref={formRef}>
                <fieldset>
                    <legend className='admin-add-title'>{titleText}</legend>
                    <AiOutlineClose className='admin-add-close' onClick={() => handleCancelData()} />
                    <InputText
                        id='productName'
                        type='text'
                        labelText='商品名稱'
                        labelClass='admin-add-name-label'
                        inputClass='admin-add-name-input'
                        placeholder='請填寫商品名稱'
                        name='name'
                        value={formData.name}
                        handleChangeValues={handleChangeValues}
                    />
                    <InputSelect
                        id='productCategory'
                        type='select'
                        labelText='商品種類與子種類'
                        labelClass='admin-add-category-label'
                        selectClass='admin-add-category-select'
                        handleChangeValues={handleChangeValues}
                        name='category'
                        value={formData.category}
                    >
                        <option value='' disabled>
                            請選擇商品種類
                        </option>
                        {typeList &&
                            typeList.map((item, index) => {
                                return (
                                    <option value={item.type} key={index}>
                                        {item.type}
                                    </option>
                                )
                            })}
                    </InputSelect>
                    <InputSelect
                        id='productSubcategory'
                        type='select'
                        labelText=''
                        labelClass='admin-add-subcategory-label'
                        selectClass='admin-add-subcategory-select'
                        handleChangeValues={handleChangeValues}
                        name='subcategory'
                        value={formData.subcategory}
                    >
                        <option value='' disabled>
                            請選擇商品子種類
                        </option>
                        {subtypeList &&
                            subtypeList.map((items, index) => {
                                return (
                                    <option value={items.subType} key={index}>
                                        {items.subType}
                                    </option>
                                )
                            })}
                    </InputSelect>

                    <InputText
                        ref={thumbnailRef}
                        id='productThumbnail'
                        type='file'
                        labelText='商品縮圖 (單張:尺寸200*200)'
                        labelClass='admin-add-thumbnail-label'
                        inputClass='admin-add-thumbnail-input'
                        placeholder='請填寫商品名稱'
                        name='thumbnail'
                        handleChangeValues={handleChangeValues}
                        accept='image/*'
                        multiple='multiple'
                    />
                    <InputText
                        ref={productFilesRef}
                        id='productFiles'
                        type='file'
                        labelText='商品照片 (五張:尺寸400*360)'
                        labelClass='admin-add-files-label'
                        inputClass='admin-add-files-input'
                        placeholder='請填寫商品名稱'
                        name='images'
                        handleChangeValues={handleChangeValues}
                        accept='image/*'
                        multiple='multiple'
                    />
                    {/* <ul>
                        {imagesNameList.map((item, index) => {
                            return <li key={index}>{item}</li>
                        })}
                    </ul> */}
                    <InputTextarea
                        id='productDescription'
                        type='text'
                        labelText='商品描述'
                        labelClass='admin-add-description-label'
                        textareaClass='admin-add-description-textarea'
                        placeholder='請填寫商品描述'
                        name='description'
                        value={formData.description}
                        handleChangeValues={handleChangeValues}
                        formId='admin-add-form'
                        cols='30'
                        rows='3'
                    />
                    <InputText
                        ref={productDescriptionImagesRef}
                        id='productDescriptionImages'
                        type='file'
                        labelText='商品描述照片 (五張:尺寸900*900)'
                        labelClass='admin-add-descriptionImages-label'
                        inputClass='admin-add-descriptionImages-input'
                        placeholder='請填寫商品名稱'
                        name='descriptionImages'
                        handleChangeValues={handleChangeValues}
                        accept='image/*'
                        multiple='multiple'
                    />
                    <InputText
                        id='productColor'
                        type='text'
                        labelText='商品顏色'
                        labelClass='admin-add-color-label'
                        inputClass='admin-add-color-input'
                        name='color'
                        value={formData.color}
                        placeholder='請填寫商品顏色'
                        handleChangeValues={handleChangeValues}
                    />
                    <InputText
                        id='productPrice'
                        type='number'
                        labelText='商品價格'
                        labelClass='admin-add-price-label'
                        inputClass='admin-add-price-input'
                        name='price'
                        value={formData.price}
                        handleChangeValues={handleChangeValues}
                    />

                    <InputText
                        id='productSize'
                        type='text'
                        labelText='商品尺寸與庫存數量'
                        labelClass='admin-add-size-label'
                        inputClass='admin-add-size-input'
                        name='size'
                        value={formData.size}
                        placeholder='請填寫商品尺寸'
                        handleChangeValues={handleChangeValues}
                    />
                    <InputText
                        id='productStock'
                        type='text'
                        labelText=''
                        labelClass='admin-product-price-label'
                        inputClass='admin-product-price-input'
                        name='stock'
                        value={formData.stock}
                        handleChangeValues={handleChangeValues}
                        containerClass='admin-add-size-container'
                    >
                        <IoMdAdd
                            className='admin-add-size-icon'
                            title='再新增一組尺寸與庫存'
                            onClick={() => handleSizeStock()}
                        />
                    </InputText>
                    <span>
                        已加入:{' '}
                        {sizeNumber.map((size, index) => {
                            return stockNumber.map((stock, i) => {
                                if (index == i) {
                                    return (
                                        <span key={index} className='admin-added-text'>
                                            {size}:{stock}
                                            <AiOutlineClose
                                                className='admin-added-cancel'
                                                title='刪除此組設定'
                                                onClick={() => handleDeleteSizeStock(index)}
                                            />
                                        </span>
                                    )
                                }
                            })
                        })}
                    </span>
                    <InputCheckbox
                        id='productEnabled'
                        type='checkbox'
                        labelText='是否啟用'
                        labelClass='admin-add-enabled-label'
                        inputClass='admin-add-enabled-input'
                        containerClass='admin-add-enabled-container'
                        name='is_enabled'
                        value={formData.is_enabled}
                        handleChangeValues={handleChangeValues}
                    />

                    <div className='admin-btn-container'>
                        <input
                            type='submit'
                            value={`${adminDefaultValues.state.type === 'create' ? '新增商品' : '確認修改'}`}
                            className='admin-add-submit'
                        />
                        <button className='admin-add-cancel' onClick={() => handleCancelData()}>
                            {`${adminDefaultValues.state.type === 'create' ? '取消新增' : '取消修改'}`}
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
export default AdminAddSection
