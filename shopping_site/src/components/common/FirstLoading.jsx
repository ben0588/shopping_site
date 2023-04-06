import React, { useLayoutEffect } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import styled from 'styled-components/macro'

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

    // ----- 未來改寫成 useLayoutEffect 寫法

    // 控制百分比讀取
    useLayoutEffect(() => {
        // 判斷初次進入網站時是否已完全加載
        const domLoaded = () => {
            // 執行百分比數字累加顯示
            const intervalId = setInterval(() => {
                setProgressBarNumber(progressBarNumber + 1)
            }, 5)
            if (progressBarNumber === 100) {
                // 加載至 100% 時清除自動累加百分比數字
                clearInterval(intervalId)
                // 加載100%後返回主頁
                onLoadingOk && onLoadingOk(true)
            }
        }
        // 加上文件監聽效果
        document.addEventListener('DOMContentLoaded', domLoaded)

        return () => {
            // 加載完畢後離開清除 setInterval & 文件監聽效果
            document.removeEventListener('DOMContentLoaded', domLoaded)
        }
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
