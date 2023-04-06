import React, { useContext, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { userForgerPassword } from '../../api/api'
import { ToastContainer, toast } from 'react-toastify' // 引用 react-toastify 使用吐司提示
import 'react-toastify/dist/ReactToastify.css' // 引用 react-toastify 使用吐司樣式

import TextInput from '../../components/hookForm/TextInput'

const UserForgetPasswordPage = () => {
    const {
        register, // 處理表單註冊驗證
        handleSubmit, // 處理表單送出時資料
        formState: { errors }, // 管理表單當前狀態
        reset, // 刷新表單內容
        control, // 綁定該 useForm
        getValues,
    } = useForm({
        // 預設內容
        defaultValues: {
            email: '',
        },
        mode: 'onTouched', // 每次點擊表單外就會立即判斷
    })

    // 處理表單資料
    const onSubmit = async (data) => {
        const { email } = data // 取出 email
        try {
            // 呼叫檢查郵件是否存在 api
            const result = await userForgerPassword(email)
            if (result.status === 200) {
                toast.success(`${result.data.message}`, {
                    position: 'top-left',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                })
            } else {
                toast.error(`${result?.response?.data?.message}，${result?.response?.data?.error}`, {
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
    }

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    return (
        <section className='user-forget-container'>
            <ToastContainer pauseOnFocusLoss={false} />
            <div className='user-forget-content'>
                <form className='user-forget-form' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='user-forget-title'>忘記密碼 ?</h2>
                    <p className='user-forget-subtitle'>
                        請提供您的帳戶電子郵件地址，重設密碼電子信箱會寄送到您的收件匣
                    </p>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='email'
                        labelText='電子郵件:'
                        labelClass='forget-label-email'
                        inputClass='forget-input-email'
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
                    <input type='submit' className='user-forget-submit-btn' value='發送重設密碼信件' />

                    <p className='user-forget-register'>
                        還沒有帳號嗎 ?
                        <Link to='/register' className='user-go-register'>
                            註冊
                        </Link>{' '}
                        |{' '}
                        <Link to='/register' className='user-go-register'>
                            登入
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    )
}
export default UserForgetPasswordPage
