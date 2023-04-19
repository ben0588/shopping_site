## 作品說明

### 作品名稱 :  
源點。線上網球購物中心

### 動機 :
過去在求學階段有接觸到網球這項運動，此作品模擬一個線上網站，專門販售網球相關周邊。

### 功能 :
 這個網站提供了各種種類和品牌的網球產品，包括球拍、網球、鞋子、服裝等。使用者可以通過搜尋、篩選和分類等功能，快速找到自己所需的產品。每個產品都有詳細的描述和圖片，讓使用者更好地了解產品的特點和優點。
 
### 購物車和願望清單 :
使用者可以將自己需要的產品添加到購物車中，並在需要的時候進行結算。也可以將未來想購買的商品加入願望清單中。

### 注意事項 : 
會員系統僅提供影片操作展示，[影片網址](https://www.awesomescreenshot.com/video/16645056?key=9c2238c9526bd23680646344798f8527)，請見諒，後端程式架構請查看此專案 : [後端GitHub](https://github.com/ben0588/node_shopping_site)

## 設計相關
-  RWD 響應式 設計範圍:  
    - 1140px
    - 768px
    - 568px
    - 414px
    - 375px
    - 320px
- 色彩分配:
    - 色彩參考 : [FLAT UI COLORS 2](https://flatuicolors.com/)
    - 主色: #00b894
    - 副色: #111414、#fff
    - 其他色: #dfe6e9、#b2bec3、#636e72、#0a2240
    - 提醒色: #b80012
    - 錯誤色: #B00020
- 規範參考 : 
    - 色彩比對值工具 : [Contrast Ratio](https://www.weiyuan.com.tw/contrast_ratio)
    - 設計規範工具 : [Type basics](https://www.ibm.com/design/language/typography/type-basics/#flush-left)
    - 瀏覽器支持工具 : [Can I use](https://caniuse.com/)
- 無版權商品圖製作:
    - canva - [canva](https://www.canva.com/)
- 網站骨架設計:
    - figma : [此網站草圖網址](https://www.figma.com/file/2hTJystLtWwzgA8L0AILYm/Ben--Shopping-%E8%B3%BC%E7%89%A9%E7%B6%B2%E7%AB%99%E7%B7%9A%E6%90%9E%E8%8D%89%E5%9C%96)

## 依賴系統

- React (v18.2.0)
- Node.js (v16.15.0)
- Express (~4.16.1)

## 系統說明
- 安裝依賴項目:
```
npm install
```
- 啟用專案方式:
```
npm start
```
    
## 結構和目錄

-   public - 存放靜態檔案
-   api - 共同管理 api
-   components - 存放功能元件
    -   auth - 驗證元件
    -   activity - 活動元件
    -   carousel - 輪播元件
    -   common - 共用元件
    -   hookForm - React-Hook-Form 獨立元件
    -   payment - 付款元件
    -   layout - 管理網頁佈局
    -   theme - 管理主題色
-   hooks - 自訂義 custom hook
-   images - 存放網站圖片
-   pages - 管理各頁面
-   sass - 管理設置 scss、css 網站樣式

## 前端使用技術

-   react-hook - 函示設計架構
-   react-layout - 佈局設計
-   react-router-dom - 設置路由/身分權限判斷
-   react-hook-form - 管理表單資料管理/驗證
-   useContext & useReducer - 狀態管理
    - 登入狀態 ( 已登入、未登入、loading )
    - 購物車 ( 新增、讀取、編輯、刪除 )
    - 願望清單 ( 新增、讀取、編輯、刪除 )
-   axios - 串接 api 
    - 會員系統 ( 登入、註冊、編輯、刪除 )
    - 第三方登入 ( Facebook / Google / Line / Github )
-   sass - scss 管理網站 css 樣式
-   styled-components - CSS in Js 管理元件樣式
-   react-loading-skeleton - 元件讀取，優化使用者體驗
-   glide.js - 設計 carousel 元件
-   swiper.js - 設計 carousel 元件
-   react-toastify - 提示視窗樣式套件
-   sweetalert2 - 提示視窗樣式套件
-   AOS.js - 視差滾動設計
-   JWT - 驗證 token

## 後端使用技術

-   express - 建立 Web Server 應用
-   jsonwebtoken - 設置用戶權限驗證
-   OAuth2.0 - 管理第三方登入驗證
-   express-session - 驗證管理者權限
-   MySQL - 連接資料庫
-   Amazon SES - 系統發送電子郵件 (忘記密碼功能)
-   swagger-ui-express - 產生線上 api 文件
    -   swagger 線上文件網址 :
        - [影片展示](https://www.awesomescreenshot.com/video/16523212?key=124967b030a390339c2130f7b9627996)