import styled from 'styled-components/macro'
// 引用 svg 建立成元件方式使用

import { ReactComponent as LogoSvg } from '../../images/logo/logo_icon.svg'
// import  LogoSvg  from '../../images/icon/logosvg.svg'
import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemesContext.jsx' // 管理主題色
import { Link } from 'react-router-dom'
import AuthContext from '../auth/AuthContext'

const HeaderLogoContainer = styled.h1`
    max-width: 150px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:${(props) => props.background}
    background-repeat: no-repeat;
    background-position: left 20%;
    transition: all 0.5s ease;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    border: none;

    &::after {
        content: 'Origin-Tennis';
        position: absolute;
        left: 60%;
        top: 50%;
        transform: translate(-60%, -50%);
        font-size: 1.2rem;
        font-weight: bolder;
        color: ${(props) => props.foreground};
        text-shadow: 0px 0px 1px ${(props) => props.foreground};
    }
`
function Logo({ onTitleUpdate }) {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const { contextValue } = useContext(AuthContext) // 驗證會員context環境
    const { handlerTitleUpdate } = contextValue
    // 未來背景圖片可更改成 png 一樣可達成動態 H1 標籤名稱
    return (
        <HeaderLogoContainer
            className='header-logo-container'
            foreground={theme.foreground}
            background={theme.background}
        >
            <Link
                className='header-logo-link'
                to='/'
                onClick={() => {
                    handlerTitleUpdate && handlerTitleUpdate('首頁')
                }}
            >
                源點。線上網球購物中心
                <LogoSvg className='header-logo-svg' fill={theme.foreground} />
            </Link>
        </HeaderLogoContainer>
    )
}

export default Logo
