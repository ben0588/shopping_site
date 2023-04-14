import axios from 'axios'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useReducer } from 'react'
import { useMemo } from 'react'
// import { auth, provider } from '../../components/auth/firebase' // 使用 firebase 環境
import { signInWithPopup } from 'firebase/auth' // 啟用 firebase google 彈跳式登入
import { userInfo, userThirdGithubLogin, userThirdLineGetData, userThirdLineLogin, userThirdLogin } from '../../api/api'

import jwt_decode from 'jwt-decode' // 解碼 jwt token
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件
import ProductContext from '../payment/ProductContext'
// 建立token預設值
const initialState = {
    authToken: null,
    userData: [],
    isLoading: false,
    isLogin: false, // 用來管理是否已登入
    firstLoading: false, // 首次加載
}
// 建立 authContext 驗證會員 Token useContext
export const AuthContext = createContext(initialState)

// 建立 useReducer 管理各項狀態管理
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                authToken: action.payload, // 把重新取得的 token 加載
            }
        case 'LOGOUT': {
            return {
                ...state,
                authToken: null, // 登出清空 token
            }
        }
        case 'SETDATA': {
            return {
                ...state,
                userData: action.payload, // 放入API取得回來的會員資料
            }
        }
        case 'FIRST_LOADING': {
            return {
                ...state,
                firstLoading: action.payload,
            }
        }
        case 'ISLOADING': {
            return {
                ...state,
                isLoading: action.payload, // 判斷當前是否在加載中
            }
        }
        case 'ISLOGIN': {
            return {
                ...state,
                isLogin: action.payload, // 判斷當前是否已成功登入
            }
        }
        default:
            return state
    }
}

// 建立 Context Provider 環境
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState) // 使用 useReducer 驗證會員 Token
    const [fbState, setFbState] = useState({}) // 檢查是否臉書已授權
    const [locationToken, setLocationToken] = useState('') // 處理 localStorage 紀錄
    const navigation = useNavigate() // 導航hook
    // const [searchParams, setSearchParams] = useSearchParams() // 控制參數

    const [getTitleText, setGetTitleText] = useState('首頁') // 動態更新網頁標題
    const { productContextValues } = useContext(ProductContext) // 管理商品
    const { handleDeleteAllWishList } = productContextValues

    // 處理刪除 URL 參數
    const handleDeleteCode = () => {
        let url = new URL(window.location.href) // 取得 url 參數網址
        let searchParams = new URLSearchParams(url.search) // 建立 SearchParams 物件
        // let code = searchParams.get('code') // 檢查 code 參數是否已存在
        searchParams.delete('code') // 刪除指定參數
        url.search = searchParams.toString() // 參數更新
        window.history.pushState({}, '', url.toString()) // 將當前 URL 參數更新
    }

    // 控制是否要回到首頁
    const handleIsGoToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    // 處理網頁標題更改
    useEffect(() => {
        document.title = `源點。線上網球購物中心 | ${getTitleText}`
    }, [getTitleText])

    // 處理網頁標題動態更新
    const handlerTitleUpdate = (title) => {
        setGetTitleText(title)
    }

    // 處理 login 登入完成更新 token
    const handleSetToken = useCallback(
        (token) => {
            // 紀錄 useReducer Token & locationStorage 紀錄
            dispatch({ type: 'LOGIN', payload: token })
            localStorage.setItem('token', token)
        },
        [state]
    )

    // 處理 logout 登出 & 清除 useReducer Token & 所有 locationStorage 紀錄 + 返回首頁
    const handleLogoutRemoveToken = useCallback(() => {
        dispatch({ type: 'LOGOUT' })
        setLocationToken(null)
        handleDeleteAllWishList() // 清除願望清單
        localStorage.clear() // 清除所有 locationStorage 紀錄
        handleDeleteCode() // 清空 url 參數
        navigation('/login', { replace: true }) // 回到登入頁面
    }, [state])

    // 用 token 呼叫登入 api 成功之後更新 userData
    const handleSetUserData = useCallback(
        (data) => {
            // 把token放到會員useContext中
            dispatch({
                type: 'SETDATA',
                payload: data,
            })
        },
        [state]
    )

    // 處理首次加載問題
    const handleFirstLoading = (state) => {
        dispatch({
            type: 'FIRST_LOADING',
            payload: state,
        })
    }

    // 處理目前是否正在加載狀態
    const handleIsLoading = (data) => {
        dispatch({
            type: 'ISLOADING',
            payload: data,
        })
    }

    // 用第三方登入註冊 && 取得 token  ( facebook、google、line、github )
    const handleThirdLogin = async (jsonData) => {
        try {
            // 呼叫 第三方登入 api 驗證是否已註冊過
            const result = await userThirdLogin(jsonData)
            if (result?.response?.status === 404) {
                console.log(result.response.data.message)
            } else if (result?.status === 200) {
                // 確認帳號密碼已存在且正確，寫入token，並且帶上會員 id 呼叫登入 api 進行登入
                const { token } = result.data
                const { mid } = result.data.info
                handleSetToken(token) // 寫入 token
                // 呼叫 官網登入 api 進行驗證 token 是否有效 (取得會員個人資料)
                const userInfoResult = await userInfo(token, mid)
                if (userInfoResult.status === 200) {
                    // jwt 驗證通過，結構出資料，更新會員資料
                    const decodedToken = userInfoResult.data.decodedToken
                    handleSetUserData(decodedToken)
                    if (decodedToken) {
                        navigation('/user')
                    }
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // 刷新檢查是否有存 token
    useEffect(() => {
        let localStorageToken = localStorage.getItem('token')
        setLocationToken(localStorageToken)
    }, [])

    // locationStorage have token get user data
    useEffect(() => {
        const getUserData = async (locationToken) => {
            try {
                // 把 locationStorage token 取出來解析 jwt，通過才給資料
                const userInfoResult = await userInfo(locationToken)
                if (userInfoResult?.status === 200) {
                    // jwt 驗證通過，結構出資料，更新會員資料
                    const { decodedToken } = userInfoResult.data
                    handleSetUserData(decodedToken)
                }
                if (userInfoResult?.response?.status === 401) {
                    // 驗證失敗立即清除所有token並返回首頁+通知請重新登入
                    const error = userInfoResult.response.data.error.error_description
                    Swal.fire({
                        title: userInfoResult?.response?.data?.message,
                        text: `${error}，請在確認 `,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        showCloseButton: false, // 顯示關閉按鈕
                        allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
                    }).then((result) => {
                        // 按下確認後回到首頁
                        if (result.isConfirmed) {
                            handleLogoutRemoveToken()
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }
        if (locationToken) {
            // 當 locationStorage 有存 token 才嘗試呼叫獲得會員資料
            getUserData(locationToken)
        }
    }, [locationToken])

    // 處理 facebook 第三方登入初始化設定
    useEffect(() => {
        // 等待 SDK 載入完成時會呼叫 fbAsyncInit
        window.fbAsyncInit = () => {
            window.FB.init({
                appId: process.env.REACT_APP_FB_ID,
                xfbml: true,
                version: 'v11.0',
            })
        }
        // 載入 Facebook SDK
        ;(function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) {
                return
            }
            js = d.createElement(s)
            js.id = id
            js.src = 'https://connect.facebook.net/en_US/sdk.js'
            fjs.parentNode.insertBefore(js, fjs)
        })(document, 'script', 'facebook-jssdk')
    }, [])

    // 處理 facebook 是否在登入狀態中 ( 獲取第三方授權資料 )
    const handleFbState = (response) => {
        if (response.status === 'connected') {
            window.FB.api('/me', 'GET', { fields: 'name,email' }, function (res) {
                // response 會包含 name 和 id，透過 fields 可以多獲取到 email
                // 資料合併
                setFbState({
                    ...response,
                    ...res,
                })
                // 判斷是否是使用 facebook 進行登入
                if (response.authResponse.graphDomain === 'facebook' && !res.errors) {
                    const jsonData = {
                        user: {
                            email: `fb_${res.email}`,
                            // email: res.email,
                            password: response.authResponse.userID,
                            // password: '999',
                            name: res.name,
                            registerOrigin: response.authResponse.graphDomain, // 註冊來源
                        },
                    }
                    handleThirdLogin(jsonData) // 處理第三方登入api
                }
            })
        }
    }

    // 處理 facebook 第三方專屬登入方法
    const handleFbLogin = () => {
        if (fbState.status === 'connected') {
        } else {
            // 呼叫登入
            window.FB.login(
                (response) => {
                    /*
                    status:狀態
                    connected = 已登入 Facebook 與 網頁
                    not_authorized = 已登入 Facebook 但未登入網頁
                    unknown：未登入 Facebook，或呼叫 FB.logout() 後
            */
                    // console.log(response)
                    handleFbState(response) // 處理當前狀態紀錄
                },
                { scope: 'public_profile,email' }
                // auth_type 可以設置每次會員重新登入是否要驗證，reauthenticate = 無條件重新驗證
            )
        }
    }
    // 處理 facebook 登出用
    const handleFbLogout = (response) => {
        if (fbState.status === 'connected' || fbState.status === 'not_authorized') {
            window.FB.api(`/${fbState.authResponse.userID}/permissions`, 'DELETE', function (response) {
                if (response.success === true || response.error) {
                    setFbState({})
                }
            })
        }
    }

    // // Google 第三方登入 全域初始化 ( 2023.1.14 最新 )
    // // 因為要使用 Google 生成的按鈕，所以放在 LoginPage中

    // Google 第三方登入專屬方法
    // const handleCredentialResponse = (response) => {
    //     // 把 google回傳的 內容進行解碼 response.credential (回傳碼)
    //     const jwtData = jwt_decode(response.credential)
    //     // 解碼完可以獲得會員 Google 的資料，email、name、ID(sub)
    //     if (jwtData) {
    //         // 改成要傳入api的格式
    //         const jsonData = {
    //             user: {
    //                 email: `go_${jwtData.email}`,
    //                 name: jwtData.name,
    //                 password: jwtData.sub,
    //                 registerOrigin: 'Google', // 註冊來源
    //             },
    //         }
    //         handleThirdLogin(jsonData) // 處理第三方登入api
    //     }
    // }

    // 使用 firebase 處理google第三方登入
    const handleFirebaseGoogleLogin = async () => {
        // const result = await signInWithPopup(auth, provider)  // 2023/4/12 關閉
        // if (result) {
        //     // 改成要傳入api的格式
        //     const jsonData = {
        //         user: {
        //             email: `go_${result.user.email}`,
        //             name: result.user.displayName,
        //             password: result.user.uid,
        //             registerOrigin: 'Google', // 註冊來源
        //         },
        //     }
        //     handleThirdLogin(jsonData) // 處理第三方登入api
        // }
    }

    // Github 登入 ( 因為後端 CROS 關係自己用後端 ) ( 因為前台透過OAuth網址授權後回首頁會刷新 )
    useEffect(() => {
        let params = new URL(document.location).searchParams
        let code = params.get('code')
        // 處理 Github 登入
        const handleGitHubLogin = async (code) => {
            try {
                // 呼叫專屬登入 github api (已在後端判斷有無註冊，無註冊新增帳號)
                const result = await userThirdGithubLogin(code)
                if (result) {
                    const { email, id, name } = result.data.user
                    // 把取回來的資料呼叫 第三方 登入api 取得會員資料
                    const password = id.toString()
                    const jsonData = {
                        user: {
                            email: `git_${email}`,
                            password: password,
                            name: name,
                            registerOrigin: 'Github', // 註冊來源
                        },
                    }
                    handleThirdLogin(jsonData) // 處理第三方登入api
                }
            } catch (error) {
                throw new Error(error)
            }
        }

        if (code) {
            handleGitHubLogin(code)
        }
    }, [])

    // Line 登入 ( 因為前台透過OAuth網址授權後回首頁會刷新 )
    useEffect(() => {
        // 取得 url 中的 code 參數
        let params = new URL(document.location).searchParams
        let code = params.get('code')
        if (code) {
            // line 處理登入
            ;(async () => {
                try {
                    // 把 code 帶入取得 access_token、id_token 等等資料
                    const result = await userThirdLineLogin(code)
                    const idToken = result?.data?.id_token
                    // 取出 id_Token 呼叫取得 line 授權的會員資料
                    if (idToken) {
                        // 呼叫 api 向 Line 取得使用者同意授權的資料
                        const result = await userThirdLineGetData(idToken)
                        if (result?.status === 200) {
                            // 把取回來的資料呼叫 第三方 登入api 取得會員資料
                            const jsonData = {
                                user: {
                                    email: `li_${result.data.email}`,
                                    password: result.data.sub,
                                    name: result.data.name,
                                    registerOrigin: 'Line', // 註冊來源
                                },
                            }
                            handleThirdLogin(jsonData) // 處理第三方登入api
                        }
                    }
                } catch (error) {
                    throw new Error(error)
                }
            })()
        }
    }, [])

    // 使用 useMemo 優化效能 & 默認設定
    const contextValue = useMemo(
        () => ({
            state,
            dispatch,
            handlerTitleUpdate, // 處理更改標題文字用
            handleSetToken, // 登入取得 token & 紀錄 localStorage
            handleLogoutRemoveToken, // 登出清除 token
            handleSetUserData, // 更新 會員資料
            handleFirstLoading, // 判斷是否首次加載
            handleIsLoading, // 處理目前是否正在加載中
            handleThirdLogin, // 第三方登入時確認註冊+取得token+用token取得會員資料
            handleFbLogin, // facebook 官方專屬登入方法
            handleFbLogout, // facebook 官方專屬登出方法
            // handleCredentialResponse, // google 官方專屬登入方法 (改名報錯)
            handleFirebaseGoogleLogin, // 使用 firebase 處理google第三方登入
            locationToken, // 本地端 token 紀錄 綁定
            getTitleText, // 網頁標頭文字
            handleIsGoToTop, // 是否回到頂端
        }),
        [
            state,
            dispatch,
            handlerTitleUpdate,
            handleSetToken,
            handleLogoutRemoveToken,
            handleSetUserData,
            handleIsLoading,
            handleThirdLogin,
            handleFbLogin,
            // handleCredentialResponse,
            handleFirebaseGoogleLogin,
            locationToken,
            getTitleText,
        ]
    )

    // return <AuthContext.Provider value={{ state, dispatch, handleSetToken }}>{children}</AuthContext.Provider>
    return <AuthContext.Provider value={{ contextValue }}>{children}</AuthContext.Provider>
    // 匯出 <AuthProvider> {children = app} </AuthProvider> 包在 app中，或者其他 router
}

export default AuthContext
