import { createContext, useReducer } from 'react'

const initialState = {
    editData: [],
    type: null,
}

const AdminContext = createContext(initialState) // 建立環境

export const AdminProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'SET_TYPE':
                return {
                    ...state,
                    type: action.payload,
                }
            case 'EDIT_DATA':
                // newDate.push(action.payload)
                return {
                    ...state,
                    editData: action.payload,
                }

            default:
                return state
        }
    }, initialState)

    // 處理更新編輯資料
    const handleGetEditData = (data) => {
        dispatch({
            type: 'EDIT_DATA',
            payload: data,
        })
    }

    // 判斷當前是有新增還是編輯操作
    const handleSetType = (type) => {
        dispatch({
            type: 'SET_TYPE',
            payload: type,
        })
    }

    const adminDefaultValues = {
        state,
        handleGetEditData, // 取得要編輯的單一資料
        handleSetType, // 判斷新增或編輯
    }
    return <AdminContext.Provider value={{ adminDefaultValues }}>{children}</AdminContext.Provider>
}

export default AdminContext
