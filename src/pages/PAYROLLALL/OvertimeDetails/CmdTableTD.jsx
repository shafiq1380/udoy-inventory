import React from 'react'

const CmdTableTD = ({ item, index }) => {
    return (
        <>
            <td>{index + 1}</td>
            <td>{item.empID}</td>
            <td>{item.empCode}</td>
            <td>{item.empName}</td>
            <td>{item.deptName}</td>
            <td>{item.designation}</td>
            <td className="text-end">{item.basic}</td>
        </>
    )
}

export default CmdTableTD