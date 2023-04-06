const InputCheckbox = ({
    name,
    id,
    type,
    labelText,
    labelClass,
    inputClass,
    value,
    containerClass,
    handleChangeValues,
}) => {
    return (
        <div className={containerClass}>
            <input
                name={name}
                type={type}
                id={id}
                className={inputClass}
                value={value}
                onChange={(e) => handleChangeValues(e)}
            />
            <label htmlFor={id} className={labelClass}>
                {labelText}
            </label>
        </div>
    )
}
export default InputCheckbox
