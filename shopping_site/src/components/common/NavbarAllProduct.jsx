import { useContext } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../auth/AuthContext'

// 類型選單列表
const typeList = [
    {
        type: '網球拍',
        subType: [
            {
                subType: '高階網球拍',
            },
            {
                subType: '中階網球拍',
            },
            {
                subType: '初階網球拍',
            },
            {
                subType: '兒童網球拍',
            },
        ],
    },
    {
        type: '網球線',
        subType: [
            {
                subType: '聚酯纖維網球線',
            },
            {
                subType: '羊腸網球線',
            },
            {
                subType: '仿羊腸網球線',
            },
            {
                subType: '克維拉網球線',
            },
        ],
    },
    {
        type: '網球',
        subType: [
            {
                subType: '比賽級網球',
            },
            {
                subType: '中階網球',
            },
            {
                subType: '初階網球',
            },
            {
                subType: '兒童初階網球',
            },
            {
                subType: '練習網球',
            },
        ],
    },
    {
        type: '配件',
        subType: [
            {
                subType: '拍包袋',
            },
            {
                subType: '握把布',
            },
            {
                subType: '避震器',
            },
            {
                subType: '運動護具',
            },
            {
                subType: '運動毛巾',
            },

            {
                subType: '其他',
            },
        ],
    },
    {
        type: '服飾',
        subType: [
            {
                subType: '男裝',
            },
            {
                subType: '女裝',
            },

            {
                subType: '兒童裝',
            },
        ],
    },
    {
        type: '鞋子',
        subType: [
            {
                subType: '男鞋',
            },
            {
                subType: '女鞋',
            },

            {
                subType: '兒童鞋',
            },
        ],
    },
]

const NavbarAllProduct = ({ display, handledShowDisplay, handledHiddenDisplay }) => {
    const { contextValue } = useContext(AuthContext)
    const { handleIsGoToTop } = contextValue
    const navigate = useNavigate()

    return (
        <div
            className='product-type-container'
            style={{ display: display }} // 起始預設隱藏
            onMouseOver={handledShowDisplay} // 滑鼠進入時保持顯示
            onMouseLeave={handledHiddenDisplay} // 滑鼠離開時顯示隱藏
            // 使用上發現滑鼠移動到上方就會一直跳，影響體驗改由點擊才會顯示菜單方式
        >
            <h3 className='product-type-title'>
                {/* 未來製作成重新呼叫全部商品的 api，在選擇其他種類時，再次點擊無效顯示 */}
                <Link to='/product'>
                    全部商品
                    <IoMdArrowForward />
                </Link>
            </h3>
            {typeList.map((item, index) => {
                return (
                    <ul key={index}>
                        <h3>
                            {/* 進入主類別 */}
                            <Link to={`/product/?category=${item.type}`}>{item.type}</Link>
                        </h3>
                        {item.subType.map((item, index) => {
                            return (
                                <li key={index}>
                                    {/* 進入子類別 */}
                                    <Link
                                        to={`/product/?subcategory=${item.subType}`}
                                        onClick={() => {
                                            handledHiddenDisplay && handledHiddenDisplay()
                                            handleIsGoToTop && handleIsGoToTop()
                                        }}
                                    >
                                        {item.subType}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )
            })}
        </div>
    )
}
export default NavbarAllProduct
