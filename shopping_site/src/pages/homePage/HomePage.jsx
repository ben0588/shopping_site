import React, { useEffect } from 'react'

// 引用驗證會員 Context
import { useContext } from 'react'
import { ThemeContext } from '../../components/theme/ThemesContext'

import HomeBannerSection from './HomeBannerSection'
import HomeSellingSection from './HomeSellingSection'
import HomeHotSection from './HomeHotSection'
import HomePhotosSection from './HomePhotosSection'
import HomeNewInfoSection from './HomeNewInfoSection'
import HomeNewProductSection from './HomeNewProductSection'
import HomeBrandSection from './HomeBrandSection'
import AuthContext from '../../components/auth/AuthContext'

function HomePage() {
    const { theme } = useContext(ThemeContext) // 引用主題色
    const { contextValue } = useContext(AuthContext)
    const { handleIsLoading } = contextValue

    // 模擬加載畫面
    useEffect(() => {
        handleIsLoading(true)
        setTimeout(() => {
            handleIsLoading(false)
        }, 2000)
    }, [])

    return (
        <section className='home-container' style={{ backgroundColor: theme.background }}>
            <HomeBannerSection />
            <HomeSellingSection />
            <HomeNewProductSection />
            <HomeHotSection />
            <HomePhotosSection />
            <HomeNewInfoSection />
            <HomeBrandSection />
        </section>
    )
}

export default HomePage
