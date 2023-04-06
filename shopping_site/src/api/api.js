import axios from 'axios'
import { useContext, useEffect } from 'react'
import AuthContext from '../components/auth/AuthContext'
// 建立入口處
const requestBaseUrl = axios.create({
    baseURL: `${process.env.REACT_APP_PATCH}api`,
    // withCredentials: true, // 要設定所有請求把set-cookie存起來,
})

// console.log('process.env.REACT_APP_PATCH', process.env.REACT_APP_PATCH)

// export const userLogin = (data) => requestBaseUrl.post('/login', data) // 登入

// ----- user 會員 api -----

// 會員登入api (官網)
export const userLogin = async (data) => {
    try {
        const userData = await requestBaseUrl.post('/login', data)
        return userData
    } catch (error) {
        return error
    }
}

// 第三方會員登入api ( facebook、google、line )
export const userThirdLogin = async (data) => {
    try {
        const userData = await requestBaseUrl.post('/thirdLogin', data)
        return userData
    } catch (error) {
        return error
    }
}
// 第三方會員登入api ( Line ) 第一段驗證
export const userThirdLineLogin = async (code) => {
    try {
        const api = 'https://api.line.me/oauth2/v2.1/token?'
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const params = new URLSearchParams()
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', process.env.REACT_APP_LINE_REDIRECT_URL)
        params.append('client_id', process.env.REACT_APP_LINE_CLIENT_ID)
        params.append('client_secret', process.env.REACT_APP_LINE_CLIENT_SECRET)

        const access_token = await axios.post(api, params, headers)
        return access_token
    } catch (error) {
        return error
    }
}

// 第三方會員登入api ( Line ) 第二段取得會員資料
export const userThirdLineGetData = async (idToken) => {
    try {
        const api = 'https://api.line.me/oauth2/v2.1/verify'
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        // 使用url方式串接資料傳送給第三方
        const params = new URLSearchParams()
        params.append('id_token', idToken)
        params.append('client_id', process.env.REACT_APP_LINE_CLIENT_ID)

        const userData = await axios.post(api, params, headers)
        return userData
    } catch (error) {
        return error
    }
}

// 第三方會員登入api ( Github ) 第一段驗證 ( 從官方取得資料 )
export const userThirdGithubLogin = async (code) => {
    // github 處理登入 ( 因為 OAuth github 有檔 web同源，所以用後端寫)
    try {
        // const api = 'http://localhost:8000/api/githubCode/'
        const headers = {
            'Content-Type': 'application/json',
        }
        const body = {
            code: code,
        }
        const userData = await requestBaseUrl.post('/githubCode', body, headers)
        return userData
    } catch (error) {
        throw new Error(error)
    }
}

// 會員註冊 api
export const userRegister = async (data) => {
    try {
        const userData = await requestBaseUrl.post('/register', data)
        return userData
    } catch (error) {
        return error
    }
}
// 取得單一會員資料
export const userInfo = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const userData = await requestBaseUrl.get(`/user`, config)
        return userData
    } catch (error) {
        return error
    }
}

// 忘記密碼功能-後端發送驗證 email
export const userForgerPassword = async (email) => {
    try {
        const body = {
            user: {
                email,
            },
        }
        const result = await requestBaseUrl.post(`/forgetPassword`, body)
        return result
    } catch (error) {
        return error
    }
}

// 設定新密碼-傳送JWT由後端完成驗證
export const userNewPassword = async (newPassword, token) => {
    try {
        const body = {
            user: {
                newPassword,
            },
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const result = await requestBaseUrl.put(`/putNewPassword`, body, config)
        return result
    } catch (error) {
        return error
    }
}

// 編輯密碼-傳送JWT由後端完成驗證 + 舊密碼核對正確後，才可進行修改密碼
export const userEditPassword = async (oldPassword, newPassword, token) => {
    try {
        const body = {
            user: {
                oldPassword,
                newPassword,
            },
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const result = await requestBaseUrl.put(`/editPassword`, body, config)
        return result
    } catch (error) {
        return error
    }
}

// 編輯會員個人資料 (token + 表單資料) 給後端比對哪裡有改，再進行修改
export const userEditData = async (data, token) => {
    try {
        const body = {
            user: {
                data,
            },
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const userData = await requestBaseUrl.put(`/putUserData`, body, config)
        return userData
    } catch (error) {
        return error
    }
}

// 刪除會員個人資料- 傳送 token 確認完畢之後刪除會員資料
export const userDeleteData = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const result = await requestBaseUrl.delete(`/deleteUser`, config)
        return result
    } catch (error) {
        return error
    }
}

// /users 取得全部會員資料 get
// /users/:useId 取得單一會員資料 get
// /users  新增會員資料 post
// /users/:userId 更新單一會員資料 put
// /users/:userId 刪除單一會員資料 delete

// ----- product 商品 api -----

// 新增商品 api (須通過管理整權限)
export const adminAddProductApi = async (newFormDate) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    try {
        const result = await requestBaseUrl.post('/admin/addProduct', newFormDate, config)
        return result
    } catch (error) {
        return error
    }
}

// 查詢單一商品 api (須通過管理整權限)
export const adminSearchProductApi = async (pid) => {
    try {
        const result = await requestBaseUrl.post(`/admin/searchProduct/${pid}`)
        return result
    } catch (error) {
        return error
    }
}

// 查詢所有商品 api (無需管理整權限)
export const getAllProducts = async () => {
    try {
        const result = await requestBaseUrl.get(`/products/all`)
        return result
    } catch (error) {
        return error
    }
}

// 查詢所有商品 api (每次10筆，可帶入頁數)
export const getProducts = async (page) => {
    try {
        const result = await requestBaseUrl.get(`/products/${page}`)
        return result
    } catch (error) {
        return error
    }
}

// 編輯單一商品 api (須通過管理整權限)
export const adminEditProductApi = async (pid, newFormDate) => {
    try {
        const result = await requestBaseUrl.put(`/admin/EditProduct/${pid}`, newFormDate)
        return result
    } catch (error) {
        return error
    }
}

// ----- admin 管理者 api -----
// 管理者登入 api
export const adminLogin = async (data) => {
    const body = {
        admin: {
            ...data,
        },
    }
    try {
        const result = await requestBaseUrl.post('/adminLogin', body, { withCredentials: true })
        return result
    } catch (error) {
        return error
    }
}

// 管理者登出 api
export const adminLogout = async (data) => {
    try {
        const result = await requestBaseUrl.delete('/adminLogout')
        return result
    } catch (error) {
        return error
    }
}

// 檢查管理者權限 api
export const adminCheck = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `${token}`,
            },
        }
        const result = await requestBaseUrl.get('/adminCheck', config)
        return result
    } catch (error) {
        return error
    }
}
