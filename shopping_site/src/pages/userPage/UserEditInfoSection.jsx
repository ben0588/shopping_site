import axios from 'axios'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useCallback, useContext, useEffect } from 'react'
import AuthContext from '../../components/auth/AuthContext'
import TextInput from '../../components/hookForm/TextInput'
import { useState } from 'react'
import { useMemo } from 'react'
import SelectInput from '../../components/hookForm/SelectInput.jsx'
import { UserPutInfoForm } from './UserEditInfoForm'

function UserPutInfoSection() {
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境
    const [data, setData] = useState(null) // 用來存放data給下一層

    // 取得 auth context 中( 用 token 自動取得會員資料 )
    const getAuthContextData = () => {
        const newArray = contextValue?.state?.userData?.address // 把地址取出來

        if (newArray) {
            const toArray = newArray.split(',') // 字串轉陣列 資料庫:選項二,選項三,選項一
            // 淺層拷貝新物件，把原字串格式的 address 轉換成 array
            const newList = { ...contextValue.state.userData, address: toArray }
            if (newList) {
                // 取得成功才更新data
                setData(newList)
            }
        }
    }
    useEffect(() => {
        // 當 auth context 有成功取回資料時，才呼叫
        if (contextValue.state.userData) {
            getAuthContextData()
        }
    }, [contextValue.state])

    // 用來傳到下一層 from 表單，當還在讀取時就顯示 isLoading
    return data ? (
        <UserPutInfoForm preloadedValues={data} getAuthContextData={getAuthContextData} />
    ) : (
        <div>資料更新中 isLading...</div>
    )

    // return <UserPutInfoForm preloadedValues={data} getAuthContextData={getAuthContextData} />
}

export default UserPutInfoSection
