import axios from 'axios'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useCallback, useContext, useEffect } from 'react'
import AuthContext from '../../components/auth/AuthContext'
import TextInput from '../../components/hookForm/TextInput'
import { useState } from 'react'
import { useMemo } from 'react'
import SelectInput from '../../components/hookForm/SelectInput.jsx'
import { BsPencilFill } from 'react-icons/bs'
import { FaUserCircle } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { HiOutlineHome } from 'react-icons/hi'
import { userDeleteData, userEditData, userForgerPassword, userInfo } from '../../api/api'
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件
import { async } from '@firebase/util'
import jwt_decode from 'jwt-decode' // 解碼 jwt token

export function UserPutInfoForm({ preloadedValues, getAuthContextData }) {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境

    const { handleSetToken, handleSetUserData, handleLogoutRemoveToken, handleIsLoading, handleFbLogout } = contextValue // 把登出方法結構
    const [taiwanAddressList, setTaiwanAddressList] = useState([]) // 用來存放台灣地址清單
    const [filterList, setFilterList] = useState([]) // 選擇對應縣市讀取對應鄉鎮
    const [userData, setUserData] = useState(preloadedValues) // 把會員資料取出來

    const {
        register, // 處理表單註冊驗證c
        handleSubmit, // 處理表單送出時資料
        formState: { errors, isLoading }, // 管理表單當前狀態
        reset, // 刷新表單內容
        control, // 綁定該 useForm
        getValues, // 取得表單內容
        setValue, // 更新表單資料
    } = useForm({
        defaultValues: preloadedValues, // 預設內容 (呼叫api回來的資料)
        // defaultValues: async () => await getUserData(),
        mode: 'onTouched', // 每次點擊表單外就會立即判斷
    })

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    // 表單送出資料核對 + AJAX 呼叫資料庫修改會員內容
    const onSubmit = async (data) => {
        handleIsLoading(true) // 按下表單時觸發 loading 狀態更新
        const token = contextValue.locationToken || contextValue.state.authToken // 取得 token
        // const token =
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOjE1MiwibmFtZSI6IuWkqeS4iyIsImVtYWlsIjoiZ29fZW5lcmd5OTUyN3pAZ21haWwuY29tIiwiY3JlYXRlRGF0ZSI6IjIwMjMtMDItMDggMTY6NDc6MDEiLCJyZWdpc3Rlck9yaWdpbiI6Ikdvb2dsZSIsImJpcnRoZGF5IjoiMjAwNS0wMi0wOCIsInRlbCI6IjA5MTIzNDU2NzgiLCJhZGRyZXNzIjoi6YCj5rGf57ijLOWNl-erv-wwwwwe1.pAII_0GAebcxQ1zv1kSNdfLC9VB1B478GfEW6gm2UfQ'
        const { address, birthday, email, name, tel } = data // 把可以改的資料結構出來
        const strAddress = address.join(',') // 陣列轉字串
        const user = {
            name,
            email,
            birthday,
            tel,
            strAddress,
        }
        try {
            /*
            流程:  
                1、 把原本會員 token + 會員更改的表單資料，發送給後端驗證 token 是否正確
                2、 後端核對正確之後，進行修改資料庫對應會員資料
                3、 後端修改資料完成之後，重新組成 JWT 並且返回給前端 ( 存在authContext+location )
                4、 前端拿到最新的 JWT 後，再呼叫取得會員資料 API，把最新資料渲染在畫面上 (確保資料正確) (呼叫更新表單Fn)
                5、 或者後端直接傳送最新會員資料，前端把最新資料渲染在畫面上
            
            */
            const result = await userEditData(user, token) // 呼叫修改會員資料 api
            if (result.status === 200) {
                const newToken = result.data.data.token // 取最新 token
                handleSetToken(newToken) // 紀錄最新 token
                Swal.fire({
                    title: result?.data?.message,
                    text: `更新目前最新資料中，請稍等`, // 顯示悼祭時要使用html
                    icon: 'info',
                    timer: 2000, // 設定秒數
                    timerProgressBar: true, // 顯示進度條
                    allowOutsideClick: false, //執行時是否允許外部點擊
                    allowEscapeKey: false, // 無法透過按 esc 關閉視窗
                    didOpen: () => {
                        // 打開始顯示 loading 圖示
                        Swal.showLoading()
                    },
                })
                    .then(async (result) => {
                        // 計時結束之後，重新呼叫取得最新會員資料
                        if (result.dismiss === Swal.DismissReason.timer) {
                            const newData = await userInfo(newToken) // 用 token 取得最新會員資料
                            if (newData) {
                                Swal.fire({
                                    title: '資料更新完成',
                                    timer: 1000,
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                }).then((result) => {
                                    if (result.dismiss === Swal.DismissReason.timer) {
                                        handleSetUserData(newData?.data?.decodedToken) // 更新 authContext 會員資料
                                        getAuthContextData() // 呼叫更新表單當前資料，會刷新表單一次
                                        handleIsLoading(false) // 加載狀態關閉
                                        Swal.close() // 清除 swail
                                    }
                                })
                            }
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: '發生錯誤',
                            text: error,
                            icon: 'error',
                            confirmButtonText: 'OK',
                            showCloseButton: true, // 顯示關閉按鈕
                        })
                    })
            }
        } catch (error) {
            Swal.fire({
                title: '發生錯誤',
                text: error,
                icon: 'error',
                confirmButtonText: 'OK',
                showCloseButton: true, // 顯示關閉按鈕
            })
        }
    }

    // 取得台灣地址(縣市/區域) (初始加載)
    useEffect(() => {
        ;(async () => {
            try {
                // 這邊使用的是下載好的 json檔案，要放在 public 內才可以讀取得到
                const result = await axios.get('/taiwan.json')
                if (result.status === 200) {
                    // 呼叫成功才更新 TaiwanAddressList 清單
                    setTaiwanAddressList(result.data) // 更新台灣地址list
                }
            } catch (error) {
                throw new Error(error)
            }
        })()
    }, [])

    // 處理更改地址時更動表單資料方法
    const handleFormAddressState = async () => {
        return new Promise((resolve, reject) => {
            if (useFormState.address && taiwanAddressList?.length > 1) {
                // const getCity = useFormState?.address?.[0] // 取得縣市
                const getCity = getValues('address_0') // 取得縣市
                const filterList = taiwanAddressList.filter((city) => city.CityName === getCity)
                if (filterList) {
                    const filterAreaName = filterList[0]?.AreaList[0]?.AreaName
                    // 篩選完畢後更新'鄉鎮市區'列表 + 更新表單資料
                    setFilterList(filterList)
                    resolve(filterAreaName) // 把鄉鎮市區預設[0]傳出去
                }
            } else {
                reject('更新表單地址失敗')
            }
        })
    }

    // 監控 台灣地址 api 加載完成後，開始更新表單狀態
    useEffect(() => {
        if (useFormState.address && taiwanAddressList?.length > 1) {
            ;(async () => {
                try {
                    await handleFormAddressState()
                } catch (error) {
                    throw new Error(error)
                }
            })()
        }
    }, [taiwanAddressList])

    // 監控 表單選擇縣市時觸發，更新鄉鎮地區
    useEffect(() => {
        if (
            (taiwanAddressList?.length > 1 && useFormState.address_0 !== '請選擇縣市') ||
            useFormState?.address?.[0] !== '請選擇縣市'
        ) {
            // console.log('....開始更新鄉鎮地區')
            ;(async () => {
                try {
                    // 取得鄉鎮地區，開始更新表單狀態
                    const result = await handleFormAddressState()
                    // 把取回來的鄉鎮，更新至表單資料內
                    if (useFormState.address[1] === '請選擇鄉鎮市區') {
                        setValue('address.1', result) // 更新 address[1] 的縣市位置
                    }
                    if (useFormState.address_1 === '請選擇鄉鎮市區') {
                        setValue('address_1', result) // 更新 address_1  的縣市位置 (初始&後續選擇才會更新表單資料)
                    }
                } catch (error) {
                    // throw new Error(error)
                }
            })()
        }
    }, [useFormState])

    // 處理選單改變資料時處理
    const handleChangData = useCallback(
        (e) => {
            if (e) {
                const target = e.target.id // 取出目標id值
                const value = e.target.value // 取出目標內容

                if (target === 'address_0') {
                    // 改變陣列中第一個縣市位置
                    setValue('address.0', value)
                }
                if (target === 'address_1') {
                    // 改變 address 第二個鄉鎮地區位置
                    setValue('address.1', value)
                }
                if (target === 'address_2') {
                    // 改變 address 第三個地址位置
                    setValue('address.2', value)
                } else {
                    // 若不是操作選單時，則把對應資料直接塞入
                    setValue(`${target}`, value)
                }
            }
        },
        [useFormState] // 這樣若不是此state有更改，就不會刷新到子元件了
    )

    // 處理 取消本次地址選擇 ( 刷新聯絡地址 )
    const handleResetAddress = () => {
        const oldAddress = userData.address // 取首次AJAX的會員資料的地址
        const newForm = {
            ...userData,
            ...useFormState,
            address: [...oldAddress],
            address_0: oldAddress[0],
            address_1: oldAddress[1],
            address_2: '', // 因為地址提示是用浮水印效果提示，最後後端不看此欄位
        }
        reset(newForm)
    }

    // 處理表單取消刷新按鈕
    const handleFormCancel = () => {
        // 把初次取回來的會員資料刷新表單
        reset(userData)
    }

    // 處理 確認登出 按鈕
    const handleLogout = () => {
        // handleFbLogout()
        Swal.fire({
            title: '確認登出?',
            text: `點擊確認後將成功登出，且返回到登入頁面`,
            icon: 'question', // icon 設定
            confirmButtonText: '確認登出', // 確認按鈕文字
            confirmButtonColor: '#b00020', // 確認按鈕顏色
            // allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
            showCloseButton: true, // 顯示關閉按鈕
            showCancelButton: true, // 顯示取消按鈕
            cancelButtonText: '取消', // 取消按鈕文字
        }).then((result) => {
            // 按下確認的時候才會出發
            if (result.isConfirmed) {
                // 清除token 登出後直接回到首頁，然後進行刷新
                handleLogoutRemoveToken()
            }
        })
    }

    // 處理 會員註銷 按鈕
    const handleDeleteUser = async () => {
        const token = contextValue.locationToken || contextValue.state.authToken // 取得當前 token
        // const token =
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOjE1MiwibmFtZSI6IuWkqeS4iyIsImVtYWlsIjoiZ29fZW5lcmd5OTUyN3pAZ21haWwuY29tIiwiY3JlYXRlRGF0ZSI6IjIwMjMtMDItMDggMTY6NDc6MDEiLCJyZWdpc3Rlck9yaWdpbiI6Ikdvb2dsZSIsImJpcnRoZGF5IjoiMjAwNS0wMi0wOCIsInRlbCI6IjA5MTIzNDU2NzgiLCJhZGRyZXNzIjoi6YCj5rGf57ijLOWNl-erv-wwwwwe1.pAII_0GAebcxQ1zv1kSNdfLC9VB1B478GfEW6gm2UfQ'
        // console.log('....開始確認是否刪除會員')
        Swal.fire({
            title: '確認註銷會員?',
            text: `請輸入確認註銷，按下確認後將清除會員資料，無法復原`,
            icon: 'question', // icon 設定
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
            },
            confirmButtonText: '確認註銷', // 確認按鈕文字
            confirmButtonColor: '#b00020', // 確認按鈕顏色
            showCloseButton: true, // 顯示關閉按鈕
            showCancelButton: true, // 顯示取消按鈕
            cancelButtonText: '取消', // 取消按鈕文字
            allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
        }).then(async (result) => {
            // 輸入確認註銷後，按下確認的時候才會出發刪除api
            if (result.isConfirmed && result.value === '確認註銷') {
                /*
                未來優化方向: 
                    #1、新增 input 輸入使用者密碼
                    #2、使用者輸入密碼之後，呼叫會員登入api，請查對應密碼是否正確 (僅限官網登入)
                    #3、因為第三方使用者登入不會讓使用者輸入到密碼，如果要使用此功能...
                */
                try {
                    // 呼叫 api 刪除會員資料
                    const result = await userDeleteData(token)
                    if (result.status === 200) {
                        // 呼叫成功才會清除 token 且登出 回到首頁
                        handleLogoutRemoveToken()
                    } else {
                        // 會員登入失敗，顯示錯誤提示
                        Swal.fire({
                            title: result?.response?.data?.message,
                            text: `${result?.response?.data?.error?.error_description}，請確認`,
                            icon: 'error',
                            confirmButtonText: 'OK',
                            showCloseButton: true, // 顯示關閉按鈕
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: '發生錯誤',
                        text: error,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        showCloseButton: true, // 顯示關閉按鈕
                    })
                }
            }
        })
    }

    // // 監控表單狀態變更
    // useEffect(() => {
    //     console.log('useFormState(表單監控中):', useFormState)
    // }, [useFormState])

    return (
        <section className='user-info-put-container'>
            <div className='user-info-name-container'>
                <div className='user-info-put-name'>
                    <FaUserCircle className='user-info-name-icon' />
                    歡迎, {contextValue?.state?.userData?.name}
                    <span className='user-info-put-number'>會員編號: {contextValue?.state?.userData?.iss}</span>
                    <span className='user-info-put-origin'>
                        帳戶綁定來源: {useFormState.registerOrigin && useFormState.registerOrigin}
                    </span>
                </div>
                <button className='user-info-logout-btn' onClick={handleLogout}>
                    Logout-登出
                </button>
                <button className='user-info-delete-btn' onClick={handleDeleteUser}>
                    Delete-註銷
                </button>
            </div>
            <form className='user-info-put-form' onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend className='user-info-title'>
                        <BsPencilFill className='user-info-edit-icon' />
                        編輯會員資料
                    </legend>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='name'
                        type='text'
                        labelText='姓名'
                        labelClass='info-label-name'
                        inputClass='info-input-name'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                value: /^[\u4E00-\u9FFF]*·*[\u4E00-\u9FFF]*$/, // 中文正則表達式
                                message: '請輸入中文格式姓名',
                            },
                            // react-hook-form v7.16.0 新增 onChange
                            onChange: (e) => handleChangData(e),
                            // 設置預設 value 值 (由套件支援)
                            value: userData && userData.name,
                        }}
                        placeholder='請填寫真實中文姓名'
                        useFormState={useFormState}
                    ></TextInput>
                    <span className='info-name-notice'>請填寫真實中文姓名，避免影響退款資料核對。</span>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='email'
                        type='text'
                        labelText='註冊信箱'
                        labelClass='info-label-email'
                        inputClass='info-input-email'
                        rules={
                            {
                                // readOnly 僅查看，不可修改信箱，但是 disabled 會變成 undefined
                                // readOnly: true,
                                // disabled: true,
                                // value: useFormState && useFormState.email,
                                // placeholder: useFormState.email,
                            }
                        }
                        // readOnly 僅查看，不可修改信箱，但是 disabled 會變成 undefined
                        readOnly={true}
                        disabled={true}
                        useFormState={useFormState}
                        placeholder={useFormState.email}
                    ></TextInput>
                    <span className='info-email-notice'>
                        註冊郵箱不可修改，若註冊來源非官網，請繼續使用快捷登入方式。
                    </span>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='birthday'
                        type='date'
                        labelText='生日(選填) '
                        labelClass='info-label-birthday'
                        inputClass='info-input-birthday'
                        rules={{
                            // react-hook-form v7.16.0 新增 onChange
                            onChange: (e) => handleChangData(e),
                            // 設置預設 value 值 (由套件支援)
                            value: userData?.birthday,
                        }}
                        readOnly={userData?.birthday !== '2005-02-02'}
                        disabled={userData?.birthday !== '2005-02-02'}
                        useFormState={useFormState}
                    ></TextInput>
                    <span className='info-birthday-notice'>填寫真實生日領取專屬生日優惠*只能設定一次。</span>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='tel'
                        type='number'
                        labelText='聯絡電話(選填)'
                        labelClass='info-label-tel'
                        inputClass='info-input-tel'
                        rules={{
                            pattern: { value: /^09[0-9]{8}$/, message: '請輸入正確手機號碼格式' },
                            // react-hook-form v7.16.0 新增 onChange
                            onChange: (e) => handleChangData(e),
                            // 設置預設 value 值 (由套件支援)
                            value: userData?.tel,
                        }}
                        useFormState={useFormState}
                        placeholder={'請輸入手機號碼'}
                    ></TextInput>
                    <span className='info-tel-notice'>填寫聯絡手機號碼格式 ex. 0912345678</span>
                    <SelectInput
                        register={register}
                        errors={errors}
                        labelText='聯絡地址(選填)'
                        type='select'
                        id='address_0'
                        useFormState={useFormState}
                        labelClass='info-label-address-city'
                        inputClass='info-input-address-city'
                        rules={{
                            // react-hook-form v7.16.0 新增 onChange && 設置預設 value 值(由套件支持)
                            onChange: (e) => handleChangData(e),
                            // 當對應縣市有資料時，顯示資料庫資料，否者預設'請選擇城市'
                            value:
                                useFormState.address && useFormState?.address?.[0] === '請選擇城市'
                                    ? '請選擇縣市'
                                    : useFormState?.address?.[0],
                        }}
                    >
                        <option
                            value={
                                useFormState.address && useFormState?.address?.[0] === '請選擇城市'
                                    ? '請選擇縣市'
                                    : useFormState?.address?.[0]
                            }
                            disabled
                        >
                            {useFormState.address && useFormState?.address?.[0] === '請選擇城市'
                                ? '請選擇縣市'
                                : useFormState?.address?.[0]}
                        </option>
                        {/* 當對應縣市有資料時，顯示資料庫資料，否者預設'請選擇城市' */}
                        {taiwanAddressList?.map((item, index) => {
                            return (
                                <option value={item.CityName} key={item.CityName}>
                                    {item.CityName}
                                </option>
                            )
                        })}
                    </SelectInput>
                    <SelectInput
                        register={register}
                        errors={errors}
                        labelText=''
                        type='select'
                        id='address_1'
                        data-index='1'
                        useFormState={useFormState}
                        labelClass='info-label-address-area'
                        inputClass='info-input-address-area'
                        rules={{
                            // react-hook-form v7.16.0 新增 onChange && 設置預設 value 值(由套件支持)
                            onChange: (e) => handleChangData(e),
                            // 設定表單預設狀態內容，若當前表單縣市是未選擇的，則會顯示選擇市區，否則直接顯示資料庫中的鄉鎮
                            value:
                                useFormState?.address?.[0] === '請選擇縣市'
                                    ? '請選擇鄉鎮市區'
                                    : // : filterList[0]?.AreaList?.[1],
                                      filterList[0]?.AreaList[0]?.AreaName,
                            //   useFormState?.address_1,
                            //   useFormState?.address?.[1],
                        }}
                    >
                        {/* 當表單地址縣市未選擇時，將提示選擇鄉鎮市區，若有選擇時，才導入對應鄉鎮資料 */}
                        {useFormState?.address?.[0] === '請選擇縣市' ? (
                            <option
                                value={
                                    useFormState?.address?.[0] === '請選擇縣市'
                                        ? '請選擇鄉鎮市區'
                                        : // : useFormState?.address?.[1]
                                          filterList[0]?.AreaList[0]?.AreaName
                                }
                                disabled
                            >
                                {useFormState?.address?.[0] === '請選擇縣市'
                                    ? '請選擇鄉鎮市區'
                                    : // : useFormState?.address?.[1]
                                      filterList[0]?.AreaList[0]?.AreaName}
                            </option>
                        ) : (
                            filterList[0]?.AreaList?.map((items, index) => {
                                return (
                                    <option key={index} value={items.AreaName}>
                                        {items.AreaName}
                                    </option>
                                )
                            })
                        )}
                    </SelectInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='address_2'
                        type='search'
                        labelText=''
                        labelClass='info-label-address-site'
                        inputClass='info-input-address-site'
                        rules={{
                            required: {
                                // 只有會員選擇了縣市+鄉鎮地區才會要求地址必填
                                value: useFormState.address_0 && useFormState.address_1 !== '請選擇鄉鎮市區',
                                message: '若選擇縣市鄉鎮地區，地址欄位需輸入。',
                            },
                            // \u4e00-\u9fa5 支持 簡體繁體、數字、全型數字
                            pattern: {
                                value: /^[\u4e00-\u9fa5_(0-9|\uFF10-\uFF19)]*$/m,
                                message: '地址格式不支持特殊符號',
                            },
                            // react-hook-form v7.16.0 新增 onChange
                            onChange: (e) => handleChangData(e),
                            // 若無修改地址，預設還是相同地址
                            value:
                                useFormState?.address?.[2] === '請輸入地址' ? '請輸入地址' : useFormState?.address?.[2],
                        }}
                        // 記得要使用浮水印效果去顯示，否則會一直刷新value值
                        placeholder={
                            // 當縣市是預設值時，提示先選擇城市，當選擇後會先跳預設地址，若有資料則跳已更新的資料
                            useFormState?.address?.[0] === '請選擇縣市'
                                ? '請先選擇縣市'
                                : useFormState?.address?.[2]
                                ? useFormState?.address?.[2]
                                : '請輸入地址'
                        }
                        useFormState={useFormState}
                        Button={
                            <button className='address-cancel-btn' type='button' onClick={handleResetAddress}>
                                <FiX className='user-info-cancel-icon' />
                                取消本次地址選擇
                            </button>
                        }
                    ></TextInput>
                    <span className='info-address-notice'>地址請勿填寫郵政信箱。</span>
                </fieldset>
                <input type='submit' className='info-confirm-btn' value='確認變更' />
                <button type='button' className='info-cancel-btn' onClick={handleFormCancel}>
                    取消
                </button>
            </form>
        </section>
    )
}
