import React, { useContext, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { userEditPassword, userForgerPassword, userNewPassword } from '../../api/api'
import { ReactComponent as EyeHiddenIcon } from '../../images/icon/eye_slash_icon.svg'
import { ReactComponent as EyeOpenIcon } from '../../images/icon/eye_view_icon.svg'
import TextInput from '../../components/hookForm/TextInput'
import { useEffect } from 'react'
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件
import AuthContext from '../../components/auth/AuthContext'
import { BsPencilFill } from 'react-icons/bs'

const UserPutPwdSection = () => {
    const [oldPasswordType, setOldPasswordType] = useState('password') // 舊密碼-切換顯示密碼
    const [passwordType, setPasswordType] = useState('password') // 密碼-切換顯示密碼
    const [checkPasswordType, setCheckPasswordType] = useState('password') // 密碼確認-切換顯示密碼
    const navigator = useNavigate() // 導航hook
    const { contextValue } = useContext(AuthContext) // 驗證會員 auth context環境
    const { handleLogoutRemoveToken } = contextValue

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
            oldPassword: '',
            newPassword: '',
            checkNewPassword: '',
        },
        mode: 'onTouched', // 每次點擊表單外就會立即判斷
    })

    const onSubmit = async (data) => {
        const { oldPassword, newPassword } = data
        const token = contextValue.locationToken || contextValue.state.authToken
        try {
            const result = await userEditPassword(oldPassword, newPassword, token)
            if (result.status === 200) {
                Swal.fire({
                    title: '編輯成功',
                    text: `${result?.data?.message}`,
                    icon: 'success',
                    confirmButtonText: '前往登入頁',
                    showCloseButton: true, // 顯示關閉按鈕
                    allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 按下確認鍵先登出，重新返回登入頁面
                        handleLogoutRemoveToken()
                        navigator('/login')
                    }
                })
            } else {
                Swal.fire({
                    title: result?.response?.data?.message,
                    text: result?.response?.data?.error,
                    icon: 'error',
                    confirmButtonText: '確認',
                    showCloseButton: true, // 顯示關閉按鈕
                })
            }
        } catch (error) {
            Swal.fire({
                title: '發生錯誤',
                text: error,
                icon: 'error',
                confirmButtonText: '確認',
                showCloseButton: true, // 顯示關閉按鈕
            })
        }
    }

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    return (
        <section className='user-putPassword-container'>
            <div className='user-putPassword-content'>
                <form className='user-putPassword-form' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='user-putPassword-title'>編輯密碼</h2>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='oldPassword'
                        labelText='舊密碼:'
                        labelClass='putPassword-label-oldPassword'
                        inputClass='putPassword-input-oldPassword'
                        type={oldPasswordType}
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
                        placeholder='接受6-15位英數字，需包含英文大寫'
                        useFormState={useFormState}
                    >
                        <EyeHiddenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-hidden-oldPassword ${
                                oldPasswordType === 'password' ? 'eye-open' : 'eye-hidden'
                            }`}
                            onClick={() => setOldPasswordType('text')}
                        />
                        <EyeOpenIcon
                            // 切換密碼顯示，icon也會更著變化
                            className={`eye-open-oldPassword ${oldPasswordType === 'text' ? 'eye-open' : 'eye-hidden'}`}
                            onClick={() => setOldPasswordType('password')}
                        />
                    </TextInput>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='newPassword'
                        labelText='新密碼:'
                        labelClass='putPassword-label-password'
                        inputClass='putPassword-input-password'
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
                            // 驗證新密碼不可與舊密碼相同
                            validate: (value) => {
                                const { oldPassword } = getValues()
                                return oldPassword !== value || '新密碼不可與舊密碼相同'
                            },
                        }}
                        placeholder='接受6-15位英數字，需包含英文大寫'
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
                        id='checkNewPassword'
                        labelText='新密碼確認:'
                        labelClass='putPassword-label-checkPassword'
                        inputClass='putPassword-input-checkPassword'
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
                                const { newPassword } = getValues()
                                return newPassword === value || '二次新密碼不一致，請在確認'
                            },
                        }}
                        placeholder='請再輸入一次新密碼'
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
                    <input type='submit' className='user-putPassword-submit-btn' value='更改密碼' />
                </form>
            </div>
        </section>
    )
}
export default UserPutPwdSection
