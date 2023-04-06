import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout } from '../../api/api'

const AdminPage = () => {
    return (
        <main className='admin-container'>
            <Outlet />
        </main>
    )
}
export default AdminPage
