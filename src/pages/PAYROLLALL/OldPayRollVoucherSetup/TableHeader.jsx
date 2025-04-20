import React from 'react'
import { Input } from 'reactstrap'

const TableHeader = ({ title, onSearchTextHandler, placeholder }) => {
    return (
        <th>
            {title}
            <Input
                type="text"
                placeholder={` Search(${placeholder})`}
                onChange={(e) => onSearchTextHandler(e.target.value)}
                className='p-1'
            />
        </th>
    )
}

export default TableHeader