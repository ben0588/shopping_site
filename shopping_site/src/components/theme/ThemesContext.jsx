import React, { createContext, useState } from 'react'

// 設定主題色深淺配置
const themes = {
    light: {
        foreground: '#111414',
        background: '#fff',
    },
    dark: {
        foreground: '#fff',
        background: '#111414',
    },
}

// 建立MyContext環境，並且給於預設值
export const ThemeContext = createContext({
    theme: themes.light,
    toggleTheme: () => {},
})

// 建立主題環境
const ThemeProvider = ({ children }) => {
    const [light, setLight] = useState(true) // 設置預設值
    const toggleTheme = () => setLight(!light) // 建立切換主題
    const theme = light ? themes.light : themes.dark // 增加切換判斷
    // 匯出默認設定
    const defaultValue = {
        toggleTheme,
        theme,
    }
    {
        /* 只要在最外層的 MyContext.Provider的value值傳入，裡面元件都可以使用該物件*/
    }
    return <ThemeContext.Provider value={defaultValue}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
