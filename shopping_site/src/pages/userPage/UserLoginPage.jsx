import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import jwt_decode from 'jwt-decode' // 解碼 jwt token
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google' // 使用 Google 登入
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件
import withReactContent from 'sweetalert2-react-content' // 使用 sweetalert2 彈跳視窗控制器

import { useContext } from 'react' // 引用驗證會員 Context
import { useForm, useWatch } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../../components/auth/AuthContext' // 管理會員驗證 token
import CheckboxInput from '../../components/hookForm/CheckboxInput'
import TextInput from '../../components/hookForm/TextInput'
import { ThemeContext } from '../../components/theme/ThemesContext' // 主題色設定

import facebookIcon from '../../images/logo/login/facebook_logo_icon.svg'
import googleIcon from '../../images/logo/login/google_logo_icon.svg' // google 不可自訂義，改使用 firebase
import lineIcon from '../../images/logo/login/line_logo_icon.svg'
import gitHubIcon from '../../images/logo/login/github_logo_icon.svg'

import { ReactComponent as EmailIcon } from '../../images/icon/email_icon.svg'
import { ReactComponent as KeyIcon } from '../../images/icon/key_icon.svg'
import { ReactComponent as EyeHiddenIcon } from '../../images/icon/eye_slash_icon.svg'
import { ReactComponent as EyeOpenIcon } from '../../images/icon/eye_view_icon.svg'

import { userInfo, userLogin, userRegister, userThirdLineLogin, userThirdLogin } from '../../api/api'

export const UserLoginForm = () => {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const { contextValue } = useContext(AuthContext) // 驗證會員 auth context環境
    const {
        handleSetToken,
        handleSetUserData,
        handleUserIsLogin,
        handleIsLoading,
        handleThirdLogin,
        handleFbLogin,
        handleCredentialResponse,
        handleFirebaseGoogleLogin,
        handleGitHubLogin,
        setLoginMethod,
        handleSetLoginMethod,
    } = contextValue // 把想要的方法通通結構出來

    const location = useLocation()
    const [fbState, setFbState] = useState({}) // 檢查是否臉書已授權
    const [passwordType, setPasswordType] = useState('password') // 切換顯示密碼
    const [eyeDisplay, setEyeDisplay] = useState(false) // 切換眼睛顯示icon
    // const MySwal = withReactContent(Swal) // 啟用 sweetalert2 彈跳視窗控制器
    const navigator = useNavigate() // 導航hook

    const {
        register, // 處理表單註冊驗證
        handleSubmit, // 處理表單送出時資料
        formState: { errors, isLoading, isSubmitting }, // 管理表單當前狀態
        reset, // 刷新表單內容
        control, // 綁定該 useForm
    } = useForm({
        // 預設內容
        defaultValues: {
            userEmail: '',
            userPassword: '',
            userKeep: true,
        },
        mode: 'onTouched',
    })

    // 處理表單資料
    const onSubmit = async (data) => {
        try {
            // 按下表單時觸發 loading 狀態更新
            handleIsLoading(true)
            // 後端使用的使用者格式
            const jsonData = {
                user: {
                    email: data.userEmail,
                    password: data.userPassword,
                    registerOrigin: '官網',
                },
            }
            // 處理從官網登入 api (呼叫登入api) 只取得 name、token
            const loginResult = await userLogin(jsonData)
            // 會員登入成功，顯示成功提示
            if (loginResult.status === 200) {
                // 登入成功後，更新 token
                handleSetToken(loginResult?.data?.token)
                Swal.fire({
                    title: loginResult?.data?.message,
                    text: `${loginResult?.data?.info?.name} 歡迎回來，祝您有個美好一天`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    // showCloseButton: true, // 顯示關閉按鈕
                    showLoaderOnConfirm: true, // 確認欲處理中加載ajax
                    allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
                    // 處理 AJAX 請求 (取得會員資料)
                    preConfirm: async () => {
                        try {
                            // 呼叫 api 進行驗證 token 是否有效 (取得會員個人資料)
                            const userInfoData = await userInfo(loginResult.data.token)
                            return userInfoData
                        } catch (error) {
                            return error
                        }
                    },
                }).then((result) => {
                    // 呼叫AJAX成功後會在這邊顯示資料
                    // 當按下確認鍵才會觸發導航回個人信息頁面
                    if (result.value) {
                        // 更新會員資料
                        handleSetUserData(result.value.data.decodedToken)
                        if (result.isConfirmed) {
                            handleIsLoading(false) // 按下確認之後改變成 加載完畢
                            navigator('/user')
                        }
                    }
                })
            } else {
                // 會員登入失敗，顯示錯誤提示
                Swal.fire({
                    title: loginResult?.response?.data?.message,
                    text: `${loginResult?.response?.data?.error}，請確認`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    showCloseButton: true, // 顯示關閉按鈕
                })
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    // Google 登入 全域初始化 ( 2023.1.14 最新 )
    // 因為要使用 Google 生成的按鈕，所以放在此頁
    // useEffect(() => {
    //     // 全域設定化
    //     window.google.accounts.id.initialize({
    //         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    //         callback: handleCredentialResponse, // 處理呼叫登入成功後回傳的資料
    //     })
    //     // window.google.accounts.id.prompt() // 是否再網頁右邊跳出可直接登入的
    //     window.google.accounts.id.renderButton(googleButtonRef.current, {
    //         size: 'large', // 大小 large、medium、small
    //         type: 'icon', // 類型 standard、icon
    //         theme: 'outline', // 主題色 outline、filled_blue、filled_black
    //         shape: 'square', // 形狀
    //         alignment: 'center', // 對齊方式
    //         locale: 'zh_CN', // 顯示語系
    //     })
    // }, [])

    // Line 登入
    const lineHref = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.REACT_APP_LINE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_LINE_REDIRECT_URL}&state=${process.env.REACT_APP_LINE_STATE}&scope=profile%20openid%20email&initial_amr_display=lineqr`

    // GitHub 登入
    const gitHubHref = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GITHUB_REDIRECT_URL}&scope=read:user,user:email`

    // 第三方登入資料清單
    const thirdList = [
        { id: 1, title: 'third_facebook_login', img: facebookIcon, loginPatch: handleFbLogin },
        {
            title: 'third_google_login',
            // className: 'googleLogin gs2',
            id: 'gs2',
            // ref: googleButtonRef,
            // loginPatch: handleCredentialResponse,
            img: googleIcon,
            loginPatch: handleFirebaseGoogleLogin,
        },
        { id: 3, title: 'third_line_login', img: lineIcon, patch: lineHref },
        {
            id: 4,
            title: 'third_github_login',
            img: gitHubIcon,
            patch: gitHubHref,
        },
    ]

    return (
        <section
            className='user-login-container'
            style={{ backgroundColor: theme.background, borderBottom: `2px solid ${theme.foreground}` }}
        >
            <div className='user-login-content'>
                <form className='user-login-form' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='user-login-title'>會員登入</h2>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='userEmail'
                        // labelText='帳號'
                        labelClass='login-label-userEmail'
                        inputClass='login-input-userEmail'
                        type='text'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                // 基於 RFC 5332 Email 正則表達式
                                value: /([!#-'*+\/-9=?A-Z^-~-]+(\.[!#-'*+\/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+\/-9=?A-Z^-~-]+(\.[!#-'*+\/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/,
                                message: '未符合電子郵箱格式',
                            },
                        }}
                        placeholder='電子郵箱'
                        useFormState={useFormState}
                    >
                        <EmailIcon className='email-icon' />
                    </TextInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='userPassword'
                        // labelText='密碼'
                        labelClass='login-label-userPassword'
                        inputClass='login-input-userPassword'
                        type={passwordType}
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            minLength: {
                                value: 6,
                                message: '密碼最少不可少於6位',
                            },
                            maxLength: {
                                value: 30,
                                message: '密碼最多不可超過30位',
                            },
                            pattern: {
                                // 任意
                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/,
                                message: '未符合密碼格式(需英文大小寫&特殊符號)',
                            },
                        }}
                        placeholder='密碼'
                        useFormState={useFormState}
                    >
                        <KeyIcon className='key-icon' />
                        <EyeHiddenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-hidden-icon ${passwordType === 'password' ? 'eye-open' : 'eye-hidden'}`}
                            onClick={() => setPasswordType('text')}
                        />
                        <EyeOpenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-open-icon ${passwordType === 'text' ? 'eye-open' : 'eye-hidden'}`}
                            onClick={() => setPasswordType('password')}
                        />
                    </TextInput>
                    <CheckboxInput
                        register={register}
                        errors={errors}
                        containerClassName='user-login-keep' // 讓內層div 包住方塊跟文字
                        id='userKeep'
                        labelText='保持登入'
                        labelClass='login-label-userKeep'
                        inputClass='login-input-userKeep'
                        type='checkbox'
                        useFormState={useFormState}
                    >
                        <Link to='/forgetPassword' className='user-login-forget'>
                            忘記密碼?
                        </Link>
                    </CheckboxInput>
                    <h4 className='user-third-title'>或</h4>
                    <ul className='user-third-container'>
                        {thirdList.map((item, index) => {
                            return (
                                <li className='user-third-items' key={index}>
                                    {/* 動態給予方法 */}
                                    <a
                                        href={item.patch}
                                        onClick={item.loginPatch}
                                        className={item.className}
                                        id={item.id}
                                        ref={item.ref}
                                    >
                                        {item.img ? <img src={item.img} alt={item.title} /> : item.button}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                    <input type='submit' className='user-submit-btn' value='登入' />
                    <p className='user-login-register'>
                        還沒有帳號嗎 ?
                        <Link to='/register' className='user-go-register'>
                            註冊
                        </Link>
                    </p>
                    <small className='login-notice'>
                        *此網站為DEMO
                        <br />
                        註冊使用完請記得註銷帳號
                    </small>
                </form>
            </div>
        </section>
    )
}

export default UserLoginForm
