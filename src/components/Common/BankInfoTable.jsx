import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { Table, UncontrolledTooltip } from 'reactstrap'

const BankInfoTable = ({ data, columns, deleteData, editBranchBtn }) => {

    return (
        <div className="table-responsive react-table">
            <Table bordered hover>
                <thead>
                    <tr>
                        {
                            columns?.map((header, index) =>
                                <th key={index}>
                                    {header}
                                </th>)
                        }
                    </tr>
                </thead>

                <tbody>
                    {data?.map((rowItem, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{rowItem.bankCode}</td>
                            <td>{rowItem.branchCode}</td>
                            <td>{rowItem.branchName}</td>
                            <td>{rowItem.branchAddress}</td>
                            <td>{rowItem.contactNumber}</td>
                            <td>
                                <div className="d-flex gap-3">
                                    {/* <i className="mdi mdi-pencil font-size-18 text-success pointer" id="edittooltip"
                                        onClick={() => editBranchBtn(rowItem)}
                                    /> */}
                                    <FaEdit id="edittooltip" size={18} onClick={() => editBranchBtn(rowItem)} />
                                    <UncontrolledTooltip placement="top" target="edittooltip">
                                        Edit
                                    </UncontrolledTooltip>
                                    <i className="mdi mdi-delete font-size-18 text-danger" id="deletetooltip"
                                    // onClick={}
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

export default BankInfoTable