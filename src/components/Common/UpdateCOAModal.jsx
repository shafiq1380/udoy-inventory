/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { Button, Col, Label, Modal, ModalBody, Row, CardTitle, Input, ModalHeader } from "reactstrap"
import { useDispatch, useSelector } from "react-redux";
import { UpdateCoaCategory } from "../../store/coa-setup/actions";

const UpdateCOAModal = ({ show, onCloseClick, menuData }) => {

    const [updateData, setUpdateData] = useState(menuData)
    const { userID } = useSelector(state => state.Login.userInformation)

    const { error, dataUpdateLoading } = useSelector(state => state.coaSetupReducer);
    const dispatch = useDispatch()


    const [newData, setNewData] = useState({
        id: updateData.id,
        coaCategory: updateData.coaName,
        status: '1',
        userCode: userID
    })

    const handleInput = (e) => {
        const { name, value } = e.target
        setNewData({ ...newData, [name]: value })
    }

    const handleUpdateData = () => {

        const data = { data: newData }
        dispatch(UpdateCoaCategory(data))
        // console.log(updateData.id)
        // setNewData({
        //     id: '',
        //     coaCategory: '',
        //     status: '',
        //     userCode: ''
        // })
    }

    return (
        <Modal isOpen={show} toggle={() => onCloseClick('update')}>
            <div className="modal-content">
                <ModalHeader>
                    <CardTitle tag="h1" >Edit COA Account</CardTitle>
                    <button type="button" onClick={() => onCloseClick('update')} className="btn-close position-absolute end-0 top-0 m-2"></button>
                </ModalHeader>

                <ModalBody className="px-4">
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    COA Account Name
                                </Label>
                                <Input
                                    name='coaCategory'
                                    type="text"
                                    placeholder='Enter COA Account Name'
                                    onChange={handleInput}
                                    onBlur={handleInput}
                                    value={newData?.coaCategory || ''}
                                // readOnly={notEditable}
                                // className={notEditable ? 'bg-secondary text-white' : ''}
                                />
                            </div>
                        </Col>
                        <Col className="col-12 mb-3">
                            <Label className="activeStatus">
                                Active Status
                            </Label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id='activeStatus'
                                name="status"
                                onChange={handleInput}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </Col>
                    </Row>
                    {
                        error &&
                        <p className="text-danger ">{error}</p>
                    }
                    <div className="text-right">
                        <Button
                            type="button"
                            color="success"
                            className="mb-2 me-2  px-3 "
                            onClick={handleUpdateData}
                            disabled={dataUpdateLoading}
                        >
                            {dataUpdateLoading ? 'Loading...' : 'Update'}
                        </Button>
                    </div>
                </ModalBody>
            </div>
        </Modal>
    )
}

export default UpdateCOAModal