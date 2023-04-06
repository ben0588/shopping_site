import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'

import { adminAddProductApi, adminCheck } from '../../api/api.js' // 引用自建的api庫

import TextInput from '../../components/hookForm/TextInput.jsx'
import SelectInput from '../../components/hookForm/SelectInput.jsx'
import AdminAddSection from './AdminAddSection.jsx'

function AdminAuthPage() {
    const navigate = useNavigate() // 用來跳轉網只用
    const [toggleAddPage, setToggleAddPage] = useState(false) // 控制顯示新增商品

    // 處理切換顯示新增商品頁面
    const handleToggleAddPage = () => {
        setToggleAddPage(!toggleAddPage)
    }

    // 處理管理者登出
    const handleAdminLogout = async () => {
        try {
            // const result = await adminLogout()
            // console.log(result)
            navigate('/admin') // 判斷收到登出成功後返回管理者首頁
        } catch (error) {
            console.log(error)
        }
    }

    // 初次驗證token是否有效
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('benKey='))
            ?.split('=')[1]
        console.log('token', token)

        if (token) {
            ;(async () => {
                try {
                    const result = await adminCheck(token) // 檢查是否有保有 token 有效狀態
                    console.log(result)
                } catch (error) {
                    console.log(error)
                }
            })()
        }
        // console.log(token)
    }, [])

    useEffect(() => {
        // 保護路由
    }, [])

    const sidebarList = [
        {
            name: '產品列表',
            link: 'products',
        },
        {
            name: '訂單列表',
            link: 'order',
        },
        {
            name: '新增產品',
            link: 'add',
        },
    ]
    return (
        <>
            <AdminAddSection toggleAddPage={toggleAddPage} handleToggleAddPage={handleToggleAddPage} />
            <nav className='admin-navbar-container'>
                <h3 className='admin-navbar-title'>源點後台系統</h3>
                <button
                    className='admin-navbar-logout'
                    onClick={() => {
                        handleAdminLogout()
                    }}
                >
                    登出
                </button>
            </nav>
            <div className='admin-auth-container'>
                <aside className='admin-sidebar-container'>
                    {sidebarList.map((item, index) => {
                        return (
                            <NavLink className='admin-sidebar-items' to={item.link} key={index}>
                                {item.name}
                            </NavLink>
                        )
                    })}
                </aside>
                <section className='admin-content'>
                    <Outlet context={{ handleToggleAddPage }} />
                </section>
            </div>
        </>
    )
}

export default AdminAuthPage
