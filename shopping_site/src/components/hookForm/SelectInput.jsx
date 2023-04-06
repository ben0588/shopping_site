import { useCallback } from 'react'
import { memo } from 'react'

const SelectInput = memo((props) => {
    const { useFormState, children, register, errors, id, labelText, labelClass, type, rules } = props
    // register、errors、id、labelText、type、labelClassName、inputClassName、rules、placeholder、

    // const filterList = jsonData.filter((city) => city.CityName == useFormState?.useCity)

    return (
        <>
            <label htmlFor={id} className={labelClass}>
                {labelText}
            </label>
            <select
                id={id}
                type={type}
                {...register(id, rules)}
                // 當errors中有 useCity時就給於錯誤提示，當表單useCity有大於0就給於通過，否者無狀態
                className={`form-select
                 ${errors?.[id] ? 'is-invalid' : useFormState?.[id]?.length > 0 ? 'is-valid' : ''}`}
            >
                {children}
            </select>
            {errors?.[id] && <div className='invalid-feedback'>{errors?.[id]?.message}</div>}
        </>
    )
})

export default SelectInput
