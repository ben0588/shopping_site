var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { createContext, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import gsap from 'gsap/gsap-core.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import TextPlugin from 'gsap/TextPlugin.js';
// ------- 共用元件 -------
import Layout from './components/layout/Layout.jsx'; // 佈局設定
import ErrorPage from './pages/errorPage/ErrorPage.jsx'; // 錯誤顯示畫面
// ------- 導覽列 -------
import HomePage from './pages/homePage/HomePage.jsx'; // 首頁
import ActivityPage from './pages/activityPage/ActivityPage.jsx'; // 優惠活動
import HotNewsPage from './pages/hotPage/HotPage.jsx'; // 熱門&最新商品
import NewsPage from './pages/newsPage/NewsPage.jsx'; // 最新消息
// ------- 會員系統 -------
import UserLoginPage from './pages/userPage/UserLoginPage.jsx'; // 會員登入頁
import UserRegisterPage from './pages/userPage/UserRegisterPage.jsx'; // 會員註冊頁
import UserInfoPage from './pages/userPage/UserInfoPage.jsx'; // 會員個人資料頁
// ------- 管理者系統 -------
import AdminLoginPage from './pages/adminPage/AdminLoginPage'; // 管理者登入頁
import AdminAuthPage from './pages/adminPage/AdminAuthPage'; // 管理者介面頁
// ------- 商品管理 -------
import ShoppingCartPage from './pages/shoppingCartPage/ShoppingCartPage.jsx'; // 購物車頁面
import ProductPage from './pages/productPage/ProductPage.jsx'; // 商品頁
import ProductIInfoPage from './pages/productPage/ProductIInfoPage'; // 商品詳情
// ------- 管理會員驗證 -------
import AuthContext, { AuthProvider } from './components/auth/AuthContext.jsx';
// ------- 功能元件 -------
import Loading from './components/common/Loading.jsx';

function App() {
    var _useContext = useContext(AuthContext),
        authToken = _useContext.authToken,
        getToken = _useContext.getToken; // 驗證會員context環境


    var _useState = useState(true),
        _useState2 = _slicedToArray(_useState, 2),
        isLoading = _useState2[0],
        setIsLoading = _useState2[1]; // 控制loading元件是否完成

    var appRef = useRef(null);

    // // 全域使用 GSAP 動畫設定
    // useLayoutEffect(() => {
    //     gsap.registerPlugin(ScrollTrigger, TextPlugin) // 註冊動畫套件

    //     let ctx = gsap.context(() => {
    //         gsap.from('.box', {
    //             opacity: 0,
    //             duration: 1,
    //             repeat: -1,
    //         })
    //         const timeline = gsap.timeline()
    //         timeline.to('.box1', {
    //             x: -200,
    //             duration: 1,
    //         })
    //     }, appRef)
    //     return () => {
    //         ctx.revert()
    //     }
    // }, [appRef])

    return React.createElement(
        'div',
        { className: 'App' },
        isLoading ? React.createElement(
            AuthProvider,
            null,
            React.createElement(
                Routes,
                null,
                React.createElement(
                    Route,
                    { path: '/', element: React.createElement(Layout, null) },
                    React.createElement(Route, { path: '/', element: React.createElement(HomePage, null) }),
                    React.createElement(Route, { path: '/register', element: React.createElement(UserRegisterPage, null) }),
                    React.createElement(Route, { path: '/login', element: React.createElement(UserLoginPage, null) }),
                    React.createElement(Route, { path: '/user', element: React.createElement(UserInfoPage, null) }),
                    React.createElement(Route, { path: '/activity', element: React.createElement(ActivityPage, null) }),
                    React.createElement(Route, { path: '/hotNews', element: React.createElement(HotNewsPage, null) }),
                    React.createElement(Route, { path: '/newsLatest', element: React.createElement(NewsPage, null) }),
                    React.createElement(
                        Route,
                        { path: '/product', element: React.createElement(ProductPage, null) },
                        React.createElement(Route, { path: ':productID', element: React.createElement(ProductIInfoPage, null) })
                    ),
                    React.createElement(Route, { path: '/shoppingCart', element: React.createElement(ShoppingCartPage, null) }),
                    React.createElement(Route, { path: '/adminLogin', element: React.createElement(AdminLoginPage, null) }),
                    React.createElement(Route, { path: '/adminAuth', element: React.createElement(AdminAuthPage, null) }),
                    React.createElement(Route, { path: '*', element: React.createElement(ErrorPage, null) })
                )
            )
        ) : React.createElement(Loading
        // 給子元件方法，由子元件決定完成後回傳callback狀態
        , { onLoadingOk: function onLoadingOk(state) {
                state && setIsLoading(state);
            }
        })
    );
}

export default App;