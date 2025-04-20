import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { Table, UncontrolledTooltip } from 'reactstrap'

const GlobalTableContainer = ({ data, columns, deleteData }) => {
    return (
        <div className="table-responsive react-table">
            <Table bordered hover>
                <thead>
                    <tr>
                        {
                            columns?.map(header =>
                                <th>
                                    {header}
                                </th>)
                        }
                    </tr>
                </thead>

                <tbody>
                    {data?.map((rowItem, index) => (
                        <tr key={index}>
                            <td>{rowItem.sl}</td>
                            <td>{rowItem.selectAccountCode}</td>
                            <td>{rowItem.particulars}</td>
                            {rowItem.debit_dr ?
                                <td>{Number(rowItem.debit_dr).toFixed(2)}</td>
                                : <td className='text-center'>-</td>
                            }
                            {rowItem.credit_cr ?
                                <td>{Number(rowItem.credit_cr).toFixed(2)}</td>
                                : <td className='text-center'>-</td>
                            }
                            <td>{rowItem.currency}</td>
                            <td>{rowItem.forenginCurrency}</td>
                            <td>{rowItem.analysis}</td>
                            <td>
                                <div className="d-flex gap-3">
                                    {/* <i className="mdi mdi-pencil font-size-18 text-success" id="edittooltip" /> */}
                                    <FaEdit id="edittooltip" size={18} />
                                    <UncontrolledTooltip placement="top" target="edittooltip">
                                        Edit
                                    </UncontrolledTooltip>
                                    <i className="mdi mdi-delete font-size-18 text-danger" id="deletetooltip"
                                        onClick={() => deleteData(rowItem.sl)}
                                    />
                                    <UncontrolledTooltip placement="top" target="deletetooltip">
                                        Delete
                                    </UncontrolledTooltip>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default GlobalTableContainer