import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import AuthContext from '../../components/auth/AuthContext'
import UserLoginError from './UserLoginError'

const UserProtectedRouter = () => {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境

    // 新增判斷，官網登入時，按下確認後才會把加載狀態關閉，此時才會跳Error 不然會一開始就跳錯誤
    return (!contextValue.state.isLoading && contextValue?.state?.authToken) || contextValue.locationToken ? (
        <UserLoginError />
    ) : (
        <Outlet />
    )
}
export default UserProtectedRouter
