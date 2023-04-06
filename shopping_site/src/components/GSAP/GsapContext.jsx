import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import gsap, { ScrollToPlugin, TextPlugin } from 'gsap/all' // 引用 GSAP 套件 與 其他同源套件
import ScrollTrigger from 'gsap/ScrollTrigger'
import Flip from 'gsap/Flip'
import Draggable from 'gsap/Draggable'

// 建立GSAP Context環境，並且給於預設值
const gaspContext = createContext({
    test: null,
})

// 建立GASP環境
export const GaspProvider = ({ children, id }) => {
    const gaspEl = useRef()
    const ctx = gsap.context(() => {}) // 建立創建動畫function
    const [animationClassName, setAnimationClassName] = useState('') // 更新 ca

    // 全域使用 GSAP 動畫設定
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger, TextPlugin) // 註冊動畫套件
        const box1 = document.querySelector('.box1')

        ScrollTrigger.create({
            trigger: box1, // 建立觸發點
            markers: true, // 開啟標記功能
            start: 0,
            end: 0,
            // start, end若不特別設定值，則默認值分別為top bottom以及bottom top，也就是默認貼齊視窗上下邊界

            // 向下滾動進入 start 時觸發 callback
            onEnter: function () {
                animated(box1)
            },

            // 向下滾動超過 end 點觸發 callback
            onLeave: function () {
                hide(box1)
            },

            // 向上滾動超過 end 時觸發 callback ( 回滾時觸發 )
            onEnterBack: function () {
                animated(box1)
            },
        })

        function animated(element) {
            let x = -100

            // 設定元素初始值
            element.style.transform = `translate(${x}px,0px);`
            // element.style.opacity = '0';

            gsap.fromTo(
                element,
                { x: x, y: 0, opacity: 0, visibility: 'hidden' },
                {
                    duration: 1,
                    delay: 0.2,
                    x: 0,
                    y: 0,
                    visibility: 'visible',
                    opacity: '1',
                    ease: 'expo',
                    overwrite: 'auto',
                }
            )
        }

        function hide(element) {
            gsap.set(element, { opacity: 0, visibility: 'hidden' })
            console.log('ok')
        }

        let ctx = gsap.context(() => {
            gsap.from('.cursor', { opacity: 0, duration: 1, repeat: -1 })

            const timeline = gsap.timeline()
            timeline.to('.box1', {
                x: -200,
                duration: 1,
            })
        })
        return () => {
            ctx.revert()
        }
    }, [gaspEl])
    /* 只要在最外層的 MyContext.Provider的value值傳入，裡面元件都可以使用該物件*/
    return (
        <gaspContext.Provider ref={gaspEl} value={{ animationClassName, setAnimationClassName }}>
            {children}
        </gaspContext.Provider>
    )
}
