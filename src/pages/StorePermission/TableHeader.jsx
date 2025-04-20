import React from 'react'
import { Input } from 'reactstrap'

const TableHeader = ({ title, hide, placeholder, onSearchTextHandler }) => {
    return (
        <div>
            <p className='mb-1'>{title}</p>
            {!hide && <Input
                type="text"
                placeholder={` Search(${placeholder})`}
                onChange={(e) => onSearchTextHandler(e.target.value)}
                className='p-1'
            />}
            {hide && <p className='p-2'></p>}
        </div>
    )
}

export default TableHeader