import React, { useEffect, useState } from 'react'
import { Button, CardTitle, Col, Input, Label, Modal, ModalBody, Row } from 'reactstrap'
import { Post } from '../../../utils/https'
import Select from 'react-select'

const DepartmentModal = ({ show, handleModal, isEdit, updateData }) => {

    const [departmentData, setDepartmentData] = useState({
        departmentName: '',
        deptStatus: 1,
        deptExpType: null
    })
    const [error, setError] = useState()

    // console.log(uomData)

    const handleInputValue = (e) => {
        const { name, value } = e.target
        if (name === "deptExpType") {
            setDepartmentData({ ...departmentData, [name]: parseInt(value) })
            return
        };
        setDepartmentData({ ...departmentData, [name]: value })
    }

    const updateDepartment = async () => {
        const data = { data: departmentData }
        // console.log(data)

        if (data.data.departmentName === '' || data.data.departmentName === null) {
            setError('Please enter Department Name')
            return;
        };

        if (data.data.deptExpType === null || isNaN(data.data.deptExpType)) {
            setError('Please select an Expense Type')
            return;
        };

        try {
            const response = await Post('/api/EmployeeManagement/UpdateDepartment', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setDepartmentData({
                            departmentName: '',
                            deptStatus: 1,
                            deptExpType: null
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }

    const addDepartment = async () => {
        const data = { data: departmentData }
        // console.log(data)

        if (data.data.departmentName === '' || data.data.departmentName === null) {
            setError('Please enter Department Name')
            return;
        };

        if (data.data.deptExpType === null || isNaN(data.data.deptExpType)) {
            setError('Please select an Expense Type')
            return;
        };

        try {
            const response = await Post('/api/EmployeeManagement/InsertDepartment', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setDepartmentData({
                            departmentName: '',
                            deptStatus: 1,
                            deptExpType: null
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (isEdit) {
            setDepartmentData({
                id: updateData.id,
                departmentName: updateData.departmentName,
                deptStatus: updateData.deptStatus,
                deptExpType: updateData.deptExpType
            })
        } else {
            setDepartmentData({
                departmentName: '',
                deptStatus: 1,
                deptExpType: null
            })
        }
        setError('')
    }, [isEdit, updateData, show])

    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: 'white',
        }),
    };


    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true} size="md">
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => handleModal()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <CardTitle className="mb-4" tag="h1" >{isEdit ? 'Edit Department' : 'Add Department'}</CardTitle>
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Department Name *
                                </Label>

                                <Input
                                    name='departmentName'
                                    type="text"
                                    placeholder='Enter Department name'
                                    onChange={handleInputValue}
                                    value={departmentData?.departmentName}
                                // disabled
                                />
                            </div>
                        </Col>
                        <Col className="col-12">
                            <div className="mb-3">
                                {/* <Label className="form-label">
                                    Expenses Type *
                                </Label>
                                <Select
                                    styles={customStyles}
                                    options={[
                                        { value: 1, label: 'Factory' },
                                        { value: 2, label: 'Administration' },
                                        { value: 3, label: 'Selling & Distribution' },
                                    ]}
                                    onChange={handleInputValue}
                                    name="deptExpType"
                                    value={departmentData?.deptExpType}
                                /> */}
                                <Label className="form-label">
                                    Expense Type *
                                </Label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='deptExpType'
                                    name="deptExpType"
                                    value={departmentData?.deptExpType}
                                    onChange={handleInputValue}
                                >
                                    <option>Select Expense Type</option>
                                    <option value={1}>Factory</option>
                                    <option value={2}>Administration</option>
                                    <option value={3}>Selling & Distribution</option>
                                </select>
                            </div>
                        </Col>



                        {
                            isEdit &&
                            <Col className="col-12 mb-3">
                                <Label className="activeStatus">
                                    Active Status
                                </Label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='activeStatus'
                                    name="deptStatus"
                                    value={departmentData?.deptStatus}
                                    onChange={handleInputValue}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </Col>
                        }

                    </Row>

                    {
                        error &&
                        <p className="text-danger mt-3 fs-5">{error}</p>
                    }

                    <div className="text-right mt-md-3">
                        <Button
                            type="button"
                            color="success"
                            onClick={isEdit ? updateDepartment : addDepartment}
                        >
                            {isEdit ? 'Update Department' : 'Add Department'}
                        </Button>
                    </div>
                </ModalBody>
            </div >
        </Modal >
    )
}

export default DepartmentModal