import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import AuthContext from '../../components/auth/AuthContext'
import NoPermissionPage from '../errorPage/NoPermissionPage'
import UserInfoNavbar from './UserInfoNavbar'

// 會員資料頁
function UserInfoPage() {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境

    return (
        <>
            {/* 當 state 有 authToken 才會顯示頁面，否則出現無權限 */}
            {contextValue?.state?.authToken || contextValue.locationToken ? (
                <section className='user-info-container'>
                    <div className='user-info-inner-container'>
                        <UserInfoNavbar />
                        <Outlet />
                    </div>
                </section>
            ) : (
                // 沒有權限時提示無權限
                <NoPermissionPage />
            )}
        </>
    )
}

export default UserInfoPage
