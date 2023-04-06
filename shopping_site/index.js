import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
// import './css/all.css' // 使用全域css設定
import './sass/all.scss'; // 使用全域scss設定
import reportWebVitals from './reportWebVitals';
// import { GaspProvider } from './components/GSAP/GsapContext'
import ThemeProvider from './components/theme/ThemesContext.jsx'; // 匯入主題設定包進 <App/>中變全域設定

/*
    BrowserRouter 路徑間"不會"有#字號，(可以自己控管的server:npm install -g serve & serve -s (開啟))
        當部屬到GitHub pages後，會導致檔案路徑找不到問題

    HashRouter 路徑會"有"個#字號，解決檔案部屬後檔案路徑問題。(非自己控管的sever)
        https://test/#/ 這個「#」，代表的是index.html
        須注意 a href="#" 會造成出錯，要改變

    reportWebVitals 是分析工具，可以使用GA分析，https://bit.ly/CRA-vitals

    <React.StrictMode> 嚴格模式:
        https://zh-hant.reactjs.org/docs/strict-mode.html
        #、發現擁有不安全生命週期的 component
        #、警告使用了 legacy string ref API
        #、警告使用到了被棄用的 findDOMNode
        #、偵測意想不到的副作用
        #、偵測 legacy context API
        #、確保可重用的 state
    @嚴格模式檢查只會在開發模式中執行，嚴格模式不會影響正式環境。

*/
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(
    HashRouter,
    null,
    React.createElement(
        ThemeProvider,
        null,
        React.createElement(App, null)
    )
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();