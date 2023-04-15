import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import demoImage from './images/other/ben0588Demo.png' // 轉發封面圖
import { Helmet, HelmetProvider } from 'react-helmet-async' // 鑽寫 SEO 功能

// ------- 共用元件 -------
import Layout from './components/layout/Layout.jsx' // 佈局設定
import NotFoundPage from './pages/errorPage/NotFoundPage.jsx' // 頁面不存在時提示
// ------- 導覽列 -------
import HomePage from './pages/homePage/HomePage.jsx' // 首頁
import ActivityPage from './pages/activityPage/ActivityPage.jsx' // 優惠活動
import HotNewsPage from './pages/hotPage/HotPage.jsx' // 熱門&最新商品
import NewsPage from './pages/newsPage/NewsPage.jsx' // 最新消息
// ------- 會員系統 -------
import AuthContext from './components/auth/AuthContext.jsx' // 會員驗證功能
import UserLoginPage from './pages/userPage/UserLoginPage.jsx' // 會員登入頁
import UserRegisterPage from './pages/userPage/UserRegisterPage.jsx' // 會員註冊頁
import UserInfoPage from './pages/userPage/UserInfoPage.jsx' // 會員個人資料頁
import UserProtectedRouter from './pages/userPage/UserProtectedRouter.jsx' // 判定是否登入中
import UserForgotPasswordRouter from './pages/userPage/UserForgotPasswordRouter.jsx' // 忘記密碼&新密碼路由
import UserForgetPasswordPage from './pages/userPage/UserForgetPasswordPage.jsx' // 忘記密碼功能
import UserNewPasswordPage from './pages/userPage/UserNewPasswordPage.jsx' // 直接創立新密碼
import UserPutInfoSection from './pages/userPage/UserEditInfoSection.jsx' // 修改個人資料
import UserCouponsSection from './pages/userPage/UserCouponsSection.jsx' // 會員優惠卷
import UserOrdersSection from './pages/userPage/UserOrdersSection.jsx' // 會員訂單
import UserWishlistSection from './pages/userPage/UserWishlistSection.jsx' // 會員追蹤清單
import UserPutPwdPage from './pages/userPage/UserEditPasswordPage.jsx' // 會員修改密碼
// ------- 管理者系統 -------
import AdminPage from './pages/adminPage/AdminPage' // 管理者頁面路由
import AdminLoginSection from './pages/adminPage/AdminLoginPage' // 預設登入畫面
import AdminAuthPage from './pages/adminPage/AdminAuthPage' // 管理者權限訪問
import AdminAuthHomeSection from './pages/adminPage/AdminAuthHomeSection' // 成功登入後的layout
import AdminOrderSection from './pages/adminPage/AdminOrderSection' // 訂單管理
import AdminProductsSection from './pages/adminPage/AdminProductsSection' // 產品列表
// ------- 商品管理 -------
import ProductPage from './pages/productPage/ProductPage.jsx' // 商品頁
import ProductSection from './pages/productPage/ProductSection.jsx' // 商品 Outlet 路由主頁
import ProductIInfoPage from './pages/productPage/ProductInfoSection' // 商品詳情
import ProductDescribeSection from './pages/productPage/ProductDescribeSection.jsx' // 商品描述
import ProductMethodSection from './pages/productPage/ProductMethodSection.jsx' // 商品送貨及付款方式
import ProductScoreSection from './pages/productPage/ProductScoreSection.jsx' // 商品評價
// ------- 購物車頁 -------
import ShoppingCartPage from './pages/shoppingCartPage/ShoppingCartPage.jsx' // 購物車頁面
import ShoppingCartSection from './pages/shoppingCartPage/ShoppingCartSection' // 購物車資訊
import ShoppingCartPaymentSection from './pages/shoppingCartPage/ShoppingCartPaymentSection' // 付款頁面
import ShoppingCartOrdersSection from './pages/shoppingCartPage/ShoppingCartOrdersSection' // 購物車訂單
// ------- 其他頁面 -------
import ServiceTermsPage from './pages/termsPage/ServiceTermsPage.jsx' // 服務條款頁面
import PrivacyPolicy from './pages/termsPage/PrivacyPolicyPage.jsx' // 隱私政策
// ------- 功能元件 -------
import FirstLoading from './components/common/FirstLoading.jsx'

const App = () => {
    const { contextValue } = useContext(AuthContext) // 驗證會員 auth context環境

    return (
        <HelmetProvider>
            <div className='App'>
                <Helmet>
                    <meta name='description' content={`ben0588個人DEMO作品網站(無商業) - ${document.title}`}></meta>
                    {/* <meta property='og:url' content={`${window.location.origin}`} /> */}
                    <meta property='og:url' content={`https://wwww123.com`} />
                    <meta property='og:type' content='website' />
                    <meta property='og:title' content={`${document.title}`} />
                    <meta property='og:description' content={`ben0588個人DEMO作品網站(無商業) - ${document.title}`} />
                    <meta property='og:image' content={`${window.location.origin}${demoImage}`} />
                    <meta name='twitter:card' content={`${window.location.origin}${demoImage}`}></meta>
                    <meta property='fb:app_id' content={`${process.env.REACT_APP_FB_ID}`} />
                </Helmet>
                {contextValue.state.firstLoading ? (
                    <Routes>
                        {/* 最外層設定Layout，元件內新增Navbar、footer元件，在中間內容加上<Outlet />代表內容切換 */}
                        <Route path='/' element={<Layout />}>
                            {/* 首頁 */}
                            <Route index element={<HomePage />} />
                            {/* 會員註冊頁面 */}
                            <Route path='/register' element={<UserRegisterPage />} />
                            {/* 會員登入頁面，如果再登入狀態就提示失敗及登出按鈕 v */}
                            <Route element={<UserProtectedRouter />}>
                                <Route path='/login' element={<UserLoginPage />} />
                            </Route>
                            {/* 會員資料頁面，已設定要有權限才可訪問頁面 v */}
                            <Route path='/user' element={<UserInfoPage />}>
                                {/* 預設首頁(個人資料) */}
                                <Route index element={<UserPutInfoSection />} />
                                {/* 會員優惠卷 */}
                                <Route path='coupons' element={<UserCouponsSection />} />
                                {/* 會員訂單 */}
                                <Route path='orders' element={<UserOrdersSection />} />
                                {/* 會員追蹤清單 */}
                                <Route path='wishlist' element={<UserWishlistSection />} />
                                {/* 會員修改密碼 ( 只有官網註冊才可以改 )*/}
                                <Route path='editPassword' element={<UserPutPwdPage />} />
                            </Route>
                            {/* 忘記密碼 & 設定新密碼 */}
                            <Route path='/forgetPassword' element={<UserForgotPasswordRouter />}>
                                <Route index element={<UserForgetPasswordPage />} />
                                <Route path=':token' element={<UserNewPasswordPage />} />
                            </Route>

                            {/* 優惠活動 */}
                            <Route path='/activity' element={<ActivityPage />} />
                            {/* 熱門&新品商品 */}
                            <Route path='/hotNews' element={<HotNewsPage />} />
                            {/* 最新消息 */}
                            <Route path='/newsLatest' element={<NewsPage />} />

                            {/* 全部商品 */}
                            <Route path='/product' element={<ProductPage />}>
                                {/* 商品詳情:動態路由 */}
                                <Route index element={<ProductSection />} />
                                <Route path=':pid' element={<ProductIInfoPage />}>
                                    <Route index element={<ProductDescribeSection />} />
                                    <Route path='method' element={<ProductMethodSection />} />
                                    <Route path='score' element={<ProductScoreSection />} />
                                </Route>
                            </Route>

                            {/* 購物車頁面 */}
                            <Route path='/shoppingCart' element={<ShoppingCartPage />}>
                                <Route index element={<ShoppingCartSection />} />
                                <Route path='payment' element={<ShoppingCartPaymentSection />} />
                                <Route path='orders' element={<ShoppingCartOrdersSection />} />
                            </Route>

                            {/* 服務條款 */}
                            <Route path='/serviceTerms' element={<ServiceTermsPage />} />
                            {/* 隱私政策 */}
                            <Route path='/privacyPolicy' element={<PrivacyPolicy />} />

                            {/* 無法訪問時顯示的畫面 */}
                            <Route path='*' element={<NotFoundPage />} />
                            {/* 管理者登入頁 */}
                            <Route path='/admin' element={<AdminPage />}>
                                <Route index element={<AdminLoginSection />} />
                                {/* 管理者登入成功介面 */}
                                <Route path='auth' element={<AdminAuthPage />}>
                                    <Route index element={<AdminAuthHomeSection />} />
                                    <Route path='products' element={<AdminProductsSection />} />
                                    <Route path='order' element={<AdminOrderSection />} />
                                </Route>
                            </Route>
                        </Route>
                    </Routes>
                ) : (
                    <FirstLoading
                    // 由 authContext 控制狀態傳遞
                    />
                )}
            </div>
        </HelmetProvider>
    )
}

export default App
