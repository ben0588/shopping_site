import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { adminLogin, adminCheck, adminAddProductApi, adminLogout } from '../../api/api.js'
import { sha256, sha224 } from 'js-sha256' //加密用

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toastOptions } from '../../components/common/Toast.jsx'
import TextInput from '../../components/hookForm/TextInput.jsx'
import axios from 'axios'

function AdminLoginSection() {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            adminName: '',
            adminPassword: '',
        },
        mode: 'onTouched',
    }) // 建立 useForm 功能
    const [adminLoginState, setaAminLoginState] = useState(null) // 管理者登入狀態
    // const [adminCheck, setAdminCheck] = useState('') // 驗證管理者登入狀態
    const navigate = useNavigate() // 用來跳轉網只用
    const [adminToken, setAdminToken] = useState('') // 存取管理者 token

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    useEffect(() => {
        document.title = '管理者登入'
    }, [])

    // 處理表單送出
    const onSubmit = async (data) => {
        console.log(data)
        try {
            // 呼叫管理者登入Api
            const result = await adminLogin(data)
            console.log(result)
            const { token, expired } = result.data
            setAdminToken(token)
            console.log(token)
            const dateString = new Date(expired)
            const localTime = dateString.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
            console.log('token到期時間:', localTime)
            // document.cookie = `benKey=${token}; expires=${new Date(expired)};`
            // document.cookie = token
            // console.log(token)

            // 模擬登入失敗給予的錯誤訊息
            setaAminLoginState('登入錯誤')
        } catch (error) {
            console.log(error)
        }
    }

    // 處理 檢查管理者當前權限
    const handleAdminCheck = async () => {
        try {
            const result = await adminCheck()
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    // 管理者登入api
    // const adminLogin = async (e) => {
    // // 自訂後端接收格式
    // const postData = {
    //     admin: {
    //         adminName: e.adminName,
    //         adminPassword: e.adminPassword,
    //     },
    // }
    // // 使用管理者api發送登入驗證
    // await adminLoginApi(postData)
    //     .then(async (response) => {
    //         console.log(response)
    //         if (response.data.success) {
    //             localStorage.setItem('checkA', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    //             toast.success(`${response.data.message}，歡迎回來`, toastOptions)
    //         }
    //     })
    //     .catch((error) => {
    //         toast.error(`${error.response.data.message}，請在確認`, toastOptions)
    //     })
    // }

    return (
        <section className='admin-login-container'>
            <form className='admin-login-form' onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend className='admin-login-title'>管理者登入</legend>
                    <div className={`login-error-container ${adminLoginState ? 'login-error-open' : ''}`}>
                        {adminLoginState}
                    </div>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='adminName'
                        labelText='管理者帳號'
                        labelClass='admin-account-label'
                        inputClass='admin-account-input'
                        type='text'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                        }}
                        placeholder='請輸入管理者帳號'
                        useFormState={useFormState}
                    ></TextInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='adminPassword'
                        labelText='管理者密碼'
                        labelClass='admin-password-label'
                        inputClass='admin-password-input'
                        type='password'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                        }}
                        placeholder='請輸入管理者密碼'
                        useFormState={useFormState}
                    ></TextInput>
                    <input type='submit' className='admin-login-btn' value='確認變更' />
                </fieldset>
            </form>
            <button
                onClick={() => {
                    navigate('auth')
                }}
            >
                模擬成功登入-前往新增商品頁面
            </button>
            <ToastContainer />
        </section>
    )
}

export default AdminLoginSection
