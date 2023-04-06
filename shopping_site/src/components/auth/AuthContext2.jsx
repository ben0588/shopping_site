import React, { useState, useEffect, createContext, useContext } from 'react'
import { useReducer } from 'react'
import { useMemo } from 'react'
import { userThirdLogin } from '../../api/api'

// 用來備份，使用另一種方式管理token (未完成)

// 建立 authContext 驗證會員 Token useContext
const AuthContext = createContext({
    authToken: null,
    setAuthToken: null,
    fetchUser: null,
})

// 建立 Provider 環境 驗證會員 Token useContext.Provider
export const AuthProvider = ({ children }) => {
    const [authContextValue, setAuthTokenValue] = useState(null) // 處理會員登入成功回傳的Token
    // 設定默認value
    const defaultValue = {
        authToken: authContextValue, // 傳出的token
        getToken: (token) => {
            // 取得新的token並且更新token狀態
            setAuthTokenValue({
                ...authContextValue,
                // authToken: Date.now(),
                authToken: token,
            })
        },
    }

    return <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
    // 匯出 <AuthProvider> {children = app} </AuthProvider> 包在 app中，或者其他 router
}

export default AuthContext
