import { useContext } from 'react'
import AuthContext from '../../components/auth/AuthContext'

function UserLoginError() {
    const { contextValue } = useContext(AuthContext)
    const { handleLogoutRemoveToken } = contextValue // 取得登出方法
    return (
        <section className='user-error-container'>
            <h3 className='user-error-title'>訪問登入頁面失敗!</h3>
            <p className='user-error-text'>
                您當前已成功登入，若要更換帳號，請點擊
                <button
                    className='user-error-button'
                    type='button'
                    onClick={() => {
                        handleLogoutRemoveToken()
                    }}
                >
                    登出
                </button>
            </p>
        </section>
    )
}

export default UserLoginError
