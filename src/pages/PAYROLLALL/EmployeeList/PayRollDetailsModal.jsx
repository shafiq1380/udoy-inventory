import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, Table } from 'reactstrap'

import { Post } from '../../../utils/https';

const PayRollDetailsModal = ({ isOpen, toggle, empPayId }) => {

    const [payrollData, setPayrolldata] = useState([]);

    // console.log(empPayId)
    useEffect(() => {
        setPayrolldata({})
        if (empPayId) {
            Post('/api/Payroll/GetEmployeePaySetup', { data: empPayId })
                .then(res => {
                    // console.log('Details', res.data)
                    if (res) {
                        setPayrolldata(res.data.data)
                    }
                })
        }
    }, [empPayId])

    const addition = payrollData?.paySetup?.reduce((total, item) => {
        if (item.amount !== undefined && item.forType === 'C') {
            return total + Number(item.amount)
        }
        return total
    }, 0)

    const deduction = payrollData?.paySetup?.reduce((total, item) => {
        if (item.amount !== undefined && item.forType === 'D') {
            return total + Number(item.amount)
        }
        return total
    }, 0)

    // console.log(payrollData)

    return (
        <Modal
            isOpen={isOpen}
            top={true}
            tabIndex="-1"
            toggle={toggle}
            size='lg'
        >
            <ModalHeader toggle={toggle}>Payroll Details</ModalHeader>
            {
                payrollData?.employeeName !== null ?
                    <>
                        <ModalBody className='custom-scrollbar'>
                            <p className='m-0'>Name</p>
                            <p className='fs-4  text-black'>{payrollData?.employeeName}</p>

                            <div className='d-flex gap-3'>
                                <div>
                                    <p className='m-0'>Emp Code</p>
                                    <p className='fs-5 text-black'>{payrollData?.employeeCode}</p>
                                </div>
                                <div>
                                    <p className='m-0'>Emp Type</p>
                                    <p className='fs-5 text-black'> {payrollData?.employeeTypeDet}</p>
                                </div>
                                <div>
                                    <p className='m-0'>Emp Department  </p>
                                    <p className='fs-5 text-black'> {payrollData?.employeeDepartment ? payrollData?.employeeDepartment : 'N/A'}</p>
                                </div>
                            </div>
                            <div className='d-flex gap-5 border-bottom mb-3 pb-3 border-2 border-success '>
                                <div>
                                    <p className='m-0'>Emp Designation</p>
                                    <p className='fs-5 text-black m-0 '> {payrollData?.employeeDesignation ? payrollData?.employeeDesignation : 'N/A'}</p>
                                </div>
                                {/* <div>
                                    <p className='m-0'>Absent Days</p>
                                    <p className='fs-5 text-black m-0 '> {payrollData?.absentDays ? payrollData?.absentDays : 'N/A'}</p>
                                </div> */}
                            </div>


                            <div className='border-bottom pb-3 border-2 border-success'>
                                <Row className='mt-2'>
                                    <Col md={6}>
                                        <div>
                                            <p className='text-black fs-4 text-center m-0'>Addition</p>
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Description
                                                        </th>
                                                        <th>
                                                            Amonut
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        payrollData?.paySetup?.map(item => {
                                                            if (item.amount > 0 && item.forType === 'C') {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            {item.forCode}
                                                                        </td>
                                                                        <td className='text-end'>
                                                                            {item.amount}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </tbody>
                                                <tfoot className='text-success fs-5'>
                                                    <tr>
                                                        <td>
                                                            Total
                                                        </td>
                                                        <td className='text-end'>
                                                            {addition}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </Table>

                                        </div>
                                    </Col>
                                    <Col md={6}>

                                        <div>
                                            <p className='text-black text-center fs-4 m-0'>Deduction</p>
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Description
                                                        </th>
                                                        <th className='text-end'>
                                                            Amonut
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        payrollData?.paySetup?.map(item => {
                                                            if (item.amount > 0 && item.forType === 'D') {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            {item.forCode}
                                                                        </td>
                                                                        <td className='text-end'>
                                                                            {item.amount}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </tbody>
                                                <tfoot className='text-danger fs-5 '>
                                                    <tr>
                                                        <td>
                                                            Total
                                                        </td>
                                                        <td className='text-end'>
                                                            {deduction}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </Table>

                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* total amount */}

                            <Row className='mt-4'>
                                {/* <Col md={4}>
                                    <p className='text-black fs-5'>Total Addition : {addition}</p>
                                </Col>
                                <Col md={4}>
                                    <p className='text-black fs-5'>Total Deduction : {deduction}</p>
                                </Col> */}
                                <Col md={12}>
                                    <p className={`fs-5 ${(addition - deduction) > 0 ? 'text-black text-end' : 'text-danger text-end'}`}>Net Payable : {addition - deduction}</p>
                                </Col>
                            </Row>
                        </ModalBody>
                    </>
                    :
                    <div className='d-flex justify-content-center py-5'>
                        {/* <Spinner size={'sm'} color="primary" style={{ width: '2.5rem', height: "2.5rem" }} /> */}
                        <h1>No Data Found</h1>
                    </div>
            }

            <ModalFooter>
                <Button type="button" color="danger" onClick={toggle}>
                    Close
                </Button>
            </ModalFooter>
        </Modal >
    )
}

export default PayRollDetailsModal

const RenderModalItem = ({ title, value }) => {
    return (
        <div className='d-flex gap-3 p-1'>
            <p className='m-0'>{title}</p>
            <p className='m-0 text-black '>{value}</p>
        </div>
    )
}