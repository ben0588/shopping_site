import { forwardRef } from 'react'

const InputText = forwardRef(
    (
        {
            children,
            containerClass,
            id,
            type,
            name,
            labelClass,
            inputClass,
            labelText,
            value,
            placeholder,
            handleChangeValues,
            accept,
            multiple,
        },
        ref
    ) => {
        return (
            <span className={containerClass}>
                <label htmlFor={id} className={labelClass}>
                    {labelText}
                </label>
                <input
                    ref={ref}
                    type={type}
                    id={id}
                    name={name}
                    className={inputClass}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => handleChangeValues(e)}
                    accept={type === 'file' ? accept : ''}
                    multiple={id === 'productFiles' || id === 'productDescriptionImages' ? multiple : ''}
                />
                {children}
            </span>
        )
    }
)
export default InputText
