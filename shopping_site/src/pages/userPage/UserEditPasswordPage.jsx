import { useContext } from 'react'
import AuthContext from '../../components/auth/AuthContext'
import UserPutPwdNotSection from './UserNotEditPasswrodSection'
import UserPutPwdSection from './UserEditPwdSection'

const UserPutPwdPage = () => {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境

    // 判斷當使用官網登入才可以修改密碼，使用第三方不可修改密碼
    return contextValue?.state?.userData?.registerOrigin === '官網' ? <UserPutPwdSection /> : <UserPutPwdNotSection />
}
export default UserPutPwdPage
