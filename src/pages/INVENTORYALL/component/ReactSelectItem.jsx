import React, { useEffect, useState } from 'react'
import { Col, Label } from 'reactstrap'
import Select from 'react-select'

const ReactSelectItem = ({ title, handleSelectedItem, name, options, value, col, hidden, text, isClearable }) => {

    const customStyles = {
        option: (provided, state,) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
            backgroundColor: state.isSelected ? '#007bff' : '#ffffff',
        }),
    };


    return (
        <Col md={col ? col : 3} sm={12} className='mt-2'>
            {hidden ? null : < Label for="dateTo" bsSize="md" className="me-2 text-nowrap " >
                {title} <span className='text-danger '>{text}</span></Label >}
            <Select
                styles={customStyles}
                onChange={(event) => handleSelectedItem(event, name)}
                options={options}
                placeholder="Select"
                value={value}
                isClearable={isClearable}
            // autoFocus
            />
        </Col>
    )
}

export default ReactSelectItem