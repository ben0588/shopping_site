// 引用 react-toastify 套件核心及套件css
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// 提醒吐司樣式
export const toastOptions = {
    position: 'bottom-right',
    autoClose: 1500,
    hideProgressBar: false,
    newestOnTop: false,
    rtl: false,
    pauseOnHover: false,
    draggable: false,
    closeOnClick: false,
}
