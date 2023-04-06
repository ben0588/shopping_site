export function useUser(useId) {
    const [user, setUser] = useState({
        loading: false,
        data: null,
        error: null,
    }) // 定義狀態

    // 更新會員資料
    const updateUser = () => {
        console.log('call user update api')
    }

    // 刪除會員資料
    const deleteUser = () => {
        console.log('call user delete api')
    }

    useEffect(() => {
        // 進入加載狀態
        setUser({
            ...user,
            loading: true,
        })
        // 把userId放入
        getMember(useId)
            .then((response) => {
                // 取得資料成功更新狀態
                setUser({
                    ...user,
                    data: response,
                    loading: false,
                    error: null,
                })
            })
            .catch((error) => {
                setUser({
                    data: null,
                    error: error,
                    loading: false,
                })
            })
    }, [useId])

    return { user, updateUser, deleteUser }
}
