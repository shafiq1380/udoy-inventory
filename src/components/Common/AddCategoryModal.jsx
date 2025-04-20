/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { Button, Col, Label, Modal, ModalBody, Row, CardTitle, Input, ModalHeader } from "reactstrap"
import { useDispatch, useSelector } from "react-redux";
import { addCoaCategory } from "../../store/coa-setup/actions";

const AddCategoryModal = ({ show, onCloseClick, menuData }) => {

    const [updateData, setUpdateData] = useState(menuData)
    const { userID } = useSelector(state => state.Login.userInformation)

    const { dataUpdateLoading, error, success } = useSelector(state => state.coaSetupReducer);

    const dispatch = useDispatch()

    const [newData, setNewData] = useState({
        parentId: updateData.coaID,
        coaCategory: '',
        userCode: userID
    })

    const handleInput = (e) => {
        const { name, value } = e.target
        setNewData({ ...newData, [name]: value })
    }


    const handleAddedData = () => {
        const data = { data: newData }
        dispatch(addCoaCategory(data))
    }


    return (
        <Modal isOpen={show} toggle={() => onCloseClick()} >
            <div className="modal-content">
                <ModalHeader>
                    <CardTitle tag="h1" >Add COA Category </CardTitle>
                    <button type="button" onClick={() => onCloseClick()} className="btn-close position-absolute end-0 top-0 m-2"></button>
                </ModalHeader>
                <ModalBody className="px-4">

                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    COA Category
                                </Label>
                                <Input
                                    name='coaCategory'
                                    type="text"
                                    placeholder='Enter COA Category'
                                    onChange={handleInput}
                                    onBlur={handleInput}
                                />
                            </div>
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
                            onClick={handleAddedData}
                            disabled={dataUpdateLoading}
                        >
                            {dataUpdateLoading ? 'Loading...' : ' Add Category'}
                        </Button>
                    </div>
                </ModalBody>
            </div>
        </Modal>
    )
}

export default AddCategoryModal