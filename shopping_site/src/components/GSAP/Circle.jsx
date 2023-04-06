import { gsap, ScrollTrigger } from 'gsap/gsap-core'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const Circle = forwardRef((props, ref) => {
    const el = useRef()

    useImperativeHandle(
        ref,
        () => {
            // return our API
            return {
                moveTo(x, y) {
                    gsap.to(el.current, { x, y })
                },
            }
        },
        []
    )

    return <div className='circle' ref={el}></div>
})

export default Circle
