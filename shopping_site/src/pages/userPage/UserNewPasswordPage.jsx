import React, { useContext, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { userForgerPassword, userNewPassword } from '../../api/api'
import { ReactComponent as EyeHiddenIcon } from '../../images/icon/eye_slash_icon.svg'
import { ReactComponent as EyeOpenIcon } from '../../images/icon/eye_view_icon.svg'
import TextInput from '../../components/hookForm/TextInput'
import { useEffect } from 'react'
import Swal from 'sweetalert2' // 使用 sweetalert2 彈跳視窗套件

const UserNewPasswordPage = () => {
    const [passwordType, setPasswordType] = useState('password') // 密碼-切換顯示密碼
    const [checkPasswordType, setCheckPasswordType] = useState('password') // 密碼確認-切換顯示密碼
    const [searchParams, setSearchParams] = useSearchParams() // 取得 url 參數
    const navigator = useNavigate() // 導航hook

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
            password: '',
            checkPassword: '',
        },
        mode: 'onTouched', // 每次點擊表單外就會立即判斷
    })

    const onSubmit = async (data) => {
        const token = searchParams.get('reset_password_token')
        // const token =
        //     'eyJhbGciOiJIUzI1NiIsrrtwtwInR5cCI6IkpXVCJ9.eyJlbWFpbCI62141244rrImVuZXJneTk1Mjd6QGdtYWlsLmNvbSIsInN1YiI6IlVzZXIgTG9naW4gQXBpIiwiaWF0IjoxNjc1OTU2MzgzLCJleHAiOjE2NzYwNDI3ODN9.DQSy65C7oA5W5V12fhxDJraT8CUCZd-_xXg2RPrUzg8'
        const newPassword = data.checkPassword
        try {
            const result = await userNewPassword(newPassword, token)
            if (result.status === 200) {
                Swal.fire({
                    title: '設定新密碼成功',
                    text: `${result?.data?.message}`,
                    icon: 'success',
                    confirmButtonText: '前往登入頁',
                    showCloseButton: true, // 顯示關閉按鈕
                    allowOutsideClick: false, //執行時是否允許外部點擊 (只能按OK觸發)
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 按下確認鍵返回登入頁面
                        navigator('/login')
                    }
                })
            }
            if (result?.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: result.response.data.message,
                    text: `無法驗證令牌，請重新取得驗證信件`,
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: `${error}`,
            })
        }
    }

    // 監聽表單內容變化
    const useFormState = useWatch({
        control, // 綁定指定的 useForm
    })

    return (
        <section className='user-newPassword-container'>
            <div className='user-newPassword-content'>
                <form className='user-newPassword-form' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='user-newPassword-title'>設定新的密碼</h2>
                    <TextInput
                        register={register}
                        errors={errors}
                        id='password'
                        labelText='新密碼:'
                        labelClass='newPassword-label-password'
                        inputClass='newPassword-input-password'
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
                        id='checkPassword'
                        labelText='新密碼確認:'
                        labelClass='newPassword-label-checkPassword'
                        inputClass='newPassword-input-checkPassword'
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
                                const { password } = getValues()
                                return password === value || '二次密碼不一致，請在確認'
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
                    <input type='submit' className='user-newPassword-submit-btn' value='更改密碼' />
                </form>
            </div>
        </section>
    )
}
export default UserNewPasswordPage
