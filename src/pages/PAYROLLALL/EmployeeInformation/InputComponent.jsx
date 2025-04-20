/* eslint-disable react/prop-types */
import React from 'react'

const InputComponent = ({ type, placeholder, className, name, value, onChange }) => {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  )
}

export default InputComponent