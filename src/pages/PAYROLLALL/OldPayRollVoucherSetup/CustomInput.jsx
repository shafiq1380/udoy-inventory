import React from 'react'

import { Input } from 'reactstrap'

const CustomInput = ({ data, handleOpeningData, index }) => {
    // console.log(data.amount)
    return (
        <Input
            className="p-1 text-end"
            name={data?.forCode}
            value={data?.amount}
            onChange={(e) => handleOpeningData(e, index)}
            onWheel={(e) => e.target.blur()}
            type="number"
        />
    )
}

export default CustomInput