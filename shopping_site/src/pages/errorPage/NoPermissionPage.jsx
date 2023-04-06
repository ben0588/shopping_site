
import styled from 'styled-components/macro'

const NoPermissionSession = styled.section`
    width: 100vw;
    height: 30vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color:red;
    font-size:1rem;
    font-weight:bolder;
`

function NoPermissionPage() {
    return ( 
        <NoPermissionSession>您沒有權限訪問此頁面，請進行常規登入</NoPermissionSession>
     );
}

export default NoPermissionPage;