import { memo } from 'react'

const CheckboxInput = memo(
    ({
        children,
        register,
        errors,
        id,
        labelText,
        labelClass,
        type,
        inputClass,
        rules,
        containerClassName,
        useFormState,
    }) => {
        return (
            <>
                <div className={containerClassName}>
                    <input
                        type={type} // error 存在時套用錯誤樣式，當表單有資料時給予通過樣式，否則預設無樣式
                        className={`${inputClass} ${
                            errors?.[id] ? 'inputInvalid' : useFormState?.[id] ? 'inputValid' : ''
                        }`}
                        id={id}
                        {...register(id, rules)}
                    />
                    <label htmlFor={id} className={labelClass}>
                        {labelText}
                    </label>
                    {children}
                </div>
                {errors?.[id]?.message && <samp className='inputInvalidText '>{errors?.[id]?.message}</samp>}
            </>
        )
    }
)

export default CheckboxInput
