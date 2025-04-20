/* eslint-disable react/prop-types */
import React from 'react'

const EditInputComponent = ({ type, placeholder, className, name, value, onChange, readonly }) => {
    return (
        <input
            type={type}
            className={className}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readonly}
        />
    )
}

export default EditInputComponent