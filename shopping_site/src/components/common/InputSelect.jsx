const InputSelect = ({ children, name, value, id, type, labelText, labelClass, selectClass, handleChangeValues }) => {
    return (
        <>
            <label htmlFor={id} className={labelClass}>
                {labelText}
            </label>
            <select
                name={name}
                id={id}
                type={type}
                className={selectClass}
                onChange={(e) => {
                    handleChangeValues(e)
                }}
                value={value}
            >
                {children}
            </select>
        </>
    )
}
export default InputSelect
