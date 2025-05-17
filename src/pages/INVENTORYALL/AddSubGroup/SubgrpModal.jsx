import React, { useEffect, useState } from 'react'
import { Button, CardTitle, Col, Input, Label, Modal, ModalBody, Row, } from 'reactstrap'
import ReactSelectItem from '../component/ReactSelectItem'
import { Post } from '../../../utils/https'

const SubgrpModal = ({ handleModal, show, isEdit, selectItem, updateData, }) => {

    const [subGroupData, setSubGroupData] = useState({})
    const [error, setErronr] = useState('')

    const handleInputField = (event) => {
        const { name, value } = event.target
        setSubGroupData({ ...subGroupData, [name]: value })
    }

    //handle Added subgroup
    const handleSubmitButton = async () => {
        const data = { data: subGroupData }
        try {
            const response = await Post('/api/v1/Product/InsertSubGroup', data)
                .then(res => {
                    if (res.data.success === true) {
                        setErronr('')
                        handleModal()
                        setSubGroupData({
                            "subGroupCode": "",
                            "subGroupName": "",
                        })
                    } else {
                        setErronr(res?.data?.errorMessage)
                    }
                })
        } catch (error) {
            console.log('Error', error)
        }
    }

    //handle update subgroup
    const handleUpdateData = async () => {
        const data = { data: subGroupData }
        try {
            const response = await Post('/api/v1/Product/UpdateSubGroup', data)
                .then(res => {
                    if (res.data.success === true) {
                        setErronr('')
                        handleModal()
                        setSubGroupData({
                            "subGroupCode": "",
                            "subGroupName": "",
                        })
                    } else {
                        setErronr(res?.data?.errorMessage)
                    }
                })
        } catch (error) {
            console.log('Error', error)
        }
    }



    useEffect(() => {
        if (isEdit && updateData) {
            setSubGroupData({
                "id": updateData?.id,
                "groupID": updateData?.groupID,
                "subGroupCode": updateData?.subGroupCode,
                "subGroupName": updateData?.subGroupName,
            })
        } else {
            setSubGroupData({
                "groupID": selectItem?.value,
                "subGroupCode": "",
                "subGroupName": "",
            })
        }
        setErronr('')
    }, [show])


    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => handleModal()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <CardTitle className="mb-4" tag="h1" >{isEdit ? 'Edit Sub Group' : 'Add Sub Group'}</CardTitle>
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Sub Group Code
                                </Label>

                                <Input
                                    name='subGroupCode'
                                    type="text"
                                    placeholder='Enter Sub Group ID'
                                    onChange={handleInputField}
                                    value={selectItem?.label}
                                    disabled
                                />
                            </div>
                        </Col>

                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Sub Group ID
                                </Label>
                                <Input
                                    name='subGroupCode'
                                    type="text"
                                    placeholder='Enter Sub Group ID'
                                    onChange={handleInputField}
                                    value={subGroupData?.subGroupCode || ''}
                                    disabled={isEdit}
                                />
                            </div>
                        </Col>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Sub Group Name
                                </Label>
                                <Input
                                    name='subGroupName'
                                    type="text"
                                    placeholder='Enter Sub Group Name'
                                    onChange={handleInputField}
                                    value={subGroupData?.subGroupName || ''}
                                />
                            </div>
                        </Col>

                        {/* {
                            isEdit &&
                            <Col className="col-12 mb-3">
                                <Label className="activeStatus">
                                    Active Status
                                </Label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='activeStatus'
                                    name="rStatus"
                                // value={newData.rStatus}
                                // onChange={handleInput}
                                >
                                    <option value={'1'}>Active</option>
                                    <option value={'0'}>Inactive</option>
                                </select>
                            </Col>
                        } */}

                    </Row>

                    {
                        error &&
                        <p className="text-danger ">{error}</p>
                    }
                    <div className="text-right">
                        <Button
                            type="button"
                            color="success"
                            onClick={isEdit ? handleUpdateData : handleSubmitButton}
                        >
                            {isEdit ? 'Update' : 'Add Sub Group'}
                        </Button>
                    </div>
                </ModalBody>
            </div >
        </Modal >
    )
}

export default SubgrpModal