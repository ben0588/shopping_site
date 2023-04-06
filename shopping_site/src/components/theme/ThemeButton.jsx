import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from './ThemesContext.jsx'
import styled from 'styled-components/macro'

const ThemeButtonContainer = styled.div`
    width: 70px;
    height: 30px;
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => (props.themeForegroundColor ? props.themeForegroundColor : null)};
    position: relative;
    border: 2px solid ${(props) => (props.themeBackgroundColor ? props.themeBackgroundColor : null)};

    @media (max-width: 375px) {
        width: 80px;
    }
`

const ThemeButtonContent = styled.div`
    width: 60px;
    height: 22px;
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => (props.themeBackgroundColor ? props.themeBackgroundColor : null)};
    position: relative;

    @media (max-width: 375px) {
        width: 90%;
    }
`
const ThemeButtonToggle = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => (props.themeForegroundColor ? props.themeForegroundColor : null)};
    position: absolute;
    left: ${(props) => (props.buttonNumber ? props.buttonNumber + '%' : null)};
    transition: all 0.5s ease-in-out;

    // @media (max-width: 375px) {
    //     width: 16px;
    //     height: 16px;
    // }
`

// foreground
// background

// 建立切換主題顏色按鈕元件
function ThemeButton({ onToggle }) {
    const { theme, toggleTheme } = useContext(ThemeContext) // 引用切換主題方法
    const [buttonNumber, setButtonNumber] = useState(5) // 控制按鈕原型左右距離

    return (
        <>
            <ThemeButtonContainer
                themeForegroundColor={theme.foreground}
                themeBackgroundColor={theme.background}
                onClick={() => {
                    if (buttonNumber < 60) {
                        setButtonNumber(buttonNumber + 60)
                        onToggle && onToggle(true)
                    } else if (buttonNumber > 60) {
                        setButtonNumber(5)
                        onToggle && onToggle(false)
                    }
                    toggleTheme()
                }}
            >
                <ThemeButtonContent themeForegroundColor={theme.foreground} themeBackgroundColor={theme.background}>
                    <ThemeButtonToggle
                        themeForegroundColor={theme.foreground}
                        themeBackgroundColor={theme.background}
                        buttonNumber={buttonNumber}
                    ></ThemeButtonToggle>
                </ThemeButtonContent>
            </ThemeButtonContainer>
        </>
    )
}

export default ThemeButton
