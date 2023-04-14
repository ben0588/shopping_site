import React, { useContext, useLayoutEffect } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import styled from 'styled-components/macro'
import AuthContext from '../auth/AuthContext'

// 建立獨立元件CSS屬性 (必須放在function外面，否則會跳提示#3117 )
const LoadingContainer = styled.div`
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const LoadingTitle = styled.h2`
    padding: 10px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bolder;
    letter-spacing: 0.2rem;
    width: 100%;
    margin: 0 0 5vh;
    z-index: 10;
`
const ProgressNumber = styled.div`
    background-color: #000;
    width: ${(props) => (props.withNumber ? props.withNumber : null)}%;
    height: 5px;
    margin: 0 auto;
    position: absolute;
    left: 0;
`
function FirstLoading({ onLoadingOk }) {
    const [progressBarNumber, setProgressBarNumber] = useState(0) // 控制百分比數字
    const { contextValue } = useContext(AuthContext) // 控制狀態
    const { handleFirstLoading } = contextValue

    // 控制百分比讀取
    useEffect(() => {
        let intervalId
        // 判斷初次進入網站時是否已完全加載
        if (progressBarNumber < 100) {
            intervalId = setInterval(() => {
                setProgressBarNumber((pre) => pre + 1)
            }, 5)
        }
        if (progressBarNumber === 100) {
            handleFirstLoading(true) // 進度達100時，完成加載
        }

        // 當網頁加載完畢且百分比達100%才觸發關閉
        window.onload = () => {
            if (progressBarNumber === 100) {
                clearInterval(intervalId) // 清除計時器
            }
        }

        return () => clearInterval(intervalId) // 離開時清除計時器
    }, [progressBarNumber])

    return (
        <main>
            <LoadingContainer>
                <LoadingTitle>Loading...{progressBarNumber}%</LoadingTitle>
                <ProgressNumber withNumber={progressBarNumber} />
            </LoadingContainer>
        </main>
    )
}

export default FirstLoading
