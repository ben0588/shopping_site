import { useContext } from 'react'
import ReactLoading from 'react-loading'
import styled from 'styled-components'
import ProductContext from '../payment/ProductContext'

const LoadingContainer = styled.div`
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
`

const Loading = () => {
    const { productContextValues } = useContext(ProductContext) // 商品環境
    // 加載商品時給予isLoading狀態，會開啟此讀取元件
    return (
        <>
            {productContextValues.state.isLoading && (
                <LoadingContainer>
                    <ReactLoading type='bubbles' color='white' height={60} width={100} />
                </LoadingContainer>
            )}
        </>
    )
}
export default Loading
