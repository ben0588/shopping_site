import { forwardRef, memo } from 'react'

const TextInput = memo((props, ref) => {
    const {
        useFormState,
        children,
        register,
        errors,
        id,
        labelText,
        labelClass,
        type,
        inputClass,
        rules,
        placeholder,
        defaultValues,
        value,
        readOnly,
        disabled,
        Button,
    } = props
    // register、errors、id、labelText、type、labelClassName、inputClassName、rules、placeholder、

    return (
        <>
            <label htmlFor={id} className={labelClass}>
                {labelText}
                {/* children 用來放 icon 位置 */}
                {children}
            </label>
            <input
                type={type}
                // error 存在時套用錯誤樣式，當表單有資料時給予通過樣式，否則預設無樣式
                className={`${inputClass} ${errors?.[id] ? 'inputInvalid' : useFormState?.[id] ? 'inputValid' : ''}`}
                id={id}
                {...register(id, rules)}
                placeholder={placeholder}
                readOnly={readOnly && readOnly}
                disabled={disabled && disabled}
            />
            <br />
            {errors?.[id]?.message && (
                <div className='inputInvalidText '>
                    {errors?.[id]?.message}
                    {Button && Button}
                </div>
            )}
        </>
    )
})
export default TextInput
