const InputTextarea = ({
    name,
    id,
    cols,
    rows,
    formId,
    labelText,
    labelClass,
    textareaClass,
    placeholder,
    value,
    handleChangeValues,
}) => {
    return (
        <>
            <label htmlFor={id} className={labelClass}>
                {labelText}
            </label>
            <textarea
                name={name}
                id={id}
                cols={cols}
                rows={rows}
                form={formId}
                value={value}
                className={textareaClass}
                onChange={(e) => handleChangeValues(e)}
                placeholder={placeholder}
            ></textarea>
        </>
    )
}
export default InputTextarea
