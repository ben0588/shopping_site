import React, { useContext, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件
import withReactContent from 'sweetalert2-react-content' // 使用 sweetalert2 彈跳視窗控制器 (可使用<標籤>)

import { userLogin, userRegister } from '../../api/api' // 使用自訂義 api
import AuthContext from '../../components/auth/AuthContext'
import CheckboxInput from '../../components/hookForm/CheckboxInput' // 處理 react-hook-form 核選方塊
import TextInput from '../../components/hookForm/TextInput' // 處理 react-hook-form 輸入文字
import { ThemeContext } from '../../components/theme/ThemesContext' // 處理主題色

import { ReactComponent as EyeHiddenIcon } from '../../images/icon/eye_slash_icon.svg'
import { ReactComponent as EyeOpenIcon } from '../../images/icon/eye_view_icon.svg'

function UserRegisterPage() {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境
    const [passwordType, setPasswordType] = useState('password') // 密碼-切換顯示密碼
    const [checkPasswordType, setCheckPasswordType] = useState('password') // 密碼確認-切換顯示密碼
    const MySwal = withReactContent(Swal) // 啟用 sweetalert2 彈跳視窗控制器
    const navigator = useNavigate() // 啟動導航hook

    const {
        register, // 處理表單註冊驗證
        handleSubmit, // 處理表單送出時資料
        formState: { errors, isLoading, isSubmitting }, // 管理表單當前狀態
        reset, // 刷新表單內容
        control, // 綁定該 useForm
        getValues,
    } = useForm({
        // 預設內容
        defaultValues: {
            userName: '',
            userEmail: '',
            userPassword: '',
            checkPassword: '',
            userAgree: false,
        },
        mode: 'onTouched', // 每次點擊表單外就會立即判斷
    })

    // 處理表單資料
    const onSubmit = async (data) => {
        try {
            const jsonData = {
                // 與後端接收資料格式相同
                user: {
                    ...data,
                    registerOrigin: '官網', // 來源備註官網
                },
            }
            const result = await userRegister(jsonData) // 連接註冊api
            // 註冊成功，使用sweetaltert2彈窗套件提示，重導向登入頁面
            if (result.status === 200) {
                console.log('準備返回登入頁面', result.data)
                let timerInterval
                MySwal.fire({
                    title: result?.data?.message,
                    html: `${result?.data?.message} <strong></strong> 秒後，將返回登入頁`,
                    icon: 'success', // icon 設定
                    confirmButtonText: '確認', // 確認按鈕文字
                    timer: 3000, // 設定秒數
                    timerProgressBar: true, // 顯示進度條
                    // showCloseButton: true, // 顯示關閉按鈕
                    allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
                    // 打開時觸發
                    didOpen: () => {
                        const strong = Swal.getHtmlContainer().querySelector('strong') // 建立HTML元件
                        // 設定定時器
                        timerInterval = setInterval(() => {
                            // 設定顯示文字內容
                            strong.textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
                        }, 100)
                    },
                    // 離開時清除定時器
                    willClose: () => {
                        clearInterval(timerInterval)
                    },
                }).then((result) => {
                    // 當讀秒結束、按確認 都會執行返回登入頁
                    if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed) {
                        navigator('/login')
                    }
                })
            } else {
                // 註冊失敗，使用sweetaltert2彈窗套件，提示錯誤內容
                Swal.fire({
                    title: result?.response?.data?.message,
                    text: `${result?.response?.data?.error}，請重新註冊`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    showCloseButton: true, // 顯示關閉按鈕
                })
            }
        } catch (error) {
            // 呼叫api錯誤時返回的訊息
            console.log('error:', error)
        }
    }

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    return (
        <section
            className='user-register-container'
            style={{ backgroundColor: theme.background, borderBottom: `2px solid ${theme.foreground}` }}
        >
            <div className='user-register-content'>
                <form className='user-register-form' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='user-register-title'>會員註冊</h2>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='userName'
                        labelText='姓名:'
                        labelClass='register-label-userName'
                        inputClass='register-input-userName'
                        type='text'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                value: /^[\u4E00-\u9FFF]*·*[\u4E00-\u9FFF]*$/, // 中文正則表達式
                                message: '請輸入中文格式姓名',
                            },
                        }}
                        placeholder='請填寫真實中文姓名'
                        useFormState={useFormState}
                    ></TextInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='userEmail'
                        labelText='電子郵件:'
                        labelClass='register-label-userEmail'
                        inputClass='register-input-userEmail'
                        type='text'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                // 基於 RFC 5332 Email 正則表達式
                                value: /([!#-'*+\/-9=?A-Z^-~-]+(\.[!#-'*+\/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+\/-9=?A-Z^-~-]+(\.[!#-'*+\/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/,
                                message: '未符合電子郵箱格式',
                            },
                        }}
                        placeholder='請填寫Email電子郵箱'
                        useFormState={useFormState}
                    ></TextInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='userPassword'
                        labelText='密碼:'
                        labelClass='register-label-userPassword'
                        inputClass='register-input-userPassword'
                        type={passwordType}
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            minLength: {
                                value: 6,
                                message: '密碼最少不可少於6位',
                            },
                            maxLength: {
                                value: 15,
                                message: '密碼最多不可超過15位',
                            },
                            pattern: {
                                // 任意
                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
                                message: '未符合密碼格式(6-15位英數字混和密碼，需英文大小寫)',
                            },
                        }}
                        placeholder='請設定6-15位英數字混和密碼，英文需區分大小寫'
                        useFormState={useFormState}
                    >
                        <EyeHiddenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-hidden-password ${passwordType === 'password' ? 'eye-open' : 'eye-hidden'}`}
                            onClick={() => setPasswordType('text')}
                        />
                        <EyeOpenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-open-password ${passwordType === 'text' ? 'eye-open' : 'eye-hidden'}`}
                            onClick={() => setPasswordType('password')}
                        />
                    </TextInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='checkPassword'
                        labelText='密碼確認:'
                        labelClass='register-label-checkPassword'
                        inputClass='register-input-checkPassword'
                        type={checkPasswordType}
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            minLength: {
                                value: 6,
                                message: '密碼最少不可少於6位',
                            },
                            maxLength: {
                                value: 15,
                                message: '密碼最多不可超過15位',
                            },
                            pattern: {
                                // 任意
                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
                                message: '未符合密碼格式(6-15位英數字混和密碼，需英文大小寫)',
                            },
                            // 驗證密碼是否有不相同的
                            validate: (value) => {
                                const { userPassword } = getValues()
                                return userPassword === value || '二次密碼不一致，請在確認'
                            },
                        }}
                        placeholder='請再輸入一次密碼'
                        useFormState={useFormState}
                    >
                        <EyeHiddenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-hidden-checkPassword ${
                                checkPasswordType === 'password' ? 'eye-open' : 'eye-hidden'
                            }`}
                            onClick={() => setCheckPasswordType('text')}
                        />
                        <EyeOpenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-open-checkPassword ${
                                checkPasswordType === 'text' ? 'eye-open' : 'eye-hidden'
                            }`}
                            onClick={() => setCheckPasswordType('password')}
                        />
                    </TextInput>
                    <CheckboxInput
                        register={register}
                        errors={errors}
                        containerClassName='user-register-Agree' // 讓內層div 包住方塊跟文字
                        id='userAgree'
                        // labelText='我已詳閱並同意遵守本站服務條款以與隱私政策'
                        labelClass='register-label-userAgree'
                        inputClass='register-input-userAgree'
                        type='checkbox'
                        rules={{
                            required: { value: true, message: '請詳閱本站條款，並勾選我同意' },
                        }}
                    >
                        <label htmlFor='userAgree'>
                            我已詳閱並同意遵守本站
                            <Link to='/serviceTerms' target={'_blank'} rel='noopener noreferrer'>
                                服務條款
                            </Link>
                            以
                            <Link to='/privacyPolicy' target={'_blank'} rel='noopener noreferrer'>
                                與隱私政策
                            </Link>
                        </label>
                    </CheckboxInput>

                    <input type='submit' className='user-submit-btn' value='註冊' />
                    <p className='user-register-register'>
                        已經註冊過了 ?
                        <Link to='/login' className='user-go-register'>
                            登入
                        </Link>
                    </p>
                    <small className='register-notice'>
                        *此網站為DEMO
                        <br />
                        註冊帳號後不使用可使用註銷帳號功能
                    </small>
                </form>
            </div>
        </section>
    )
}

export default UserRegisterPage
