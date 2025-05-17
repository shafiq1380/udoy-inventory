import React, { useEffect, useId, useState } from "react"
import { Button, Col, Label, Modal, ModalBody, Row, CardTitle, Input } from "reactstrap"
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../../utils/https";

const AnalysisModal = ({ show, onCloseClick, analysisData, id, reloadPage, isEdit }) => {


    const { userID } = useSelector(state => state.Login.userInformation)
    const [error, setError] = useState('')

    const [newData, setNewData] = useState({
        analysisTypeId: id,
        analysisCode: '',
        analysisName: '',
        rStatus: '1',
    })


    const handleInput = (e) => {
        const { name, value } = e.target
        setNewData({ ...newData, [name]: value, entryUserID: userID })
    }

    const addedAnalysis = () => {
        const data = { data: newData }
        try {
            Post('/api/v1/CoaSetup/AddCoaAnalysisCode', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        reloadPage()
                        onCloseClick()
                        setNewData({
                            analysisTypeId: id,
                            analysisCode: '',
                            analysisName: '',
                            rStatus: '1',
                        })
                    }
                }
                )
        } catch (error) {

        }
    }

    const handleUpdateData = () => {
        const updateData = { ...newData, id: analysisData.id }
        const data = { data: updateData }
        try {
            Post('/api/v1/CoaSetup/UpdateCoaAnalysisCode', data)
                .then(res => {
                    console.log(res)
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        reloadPage()
                        onCloseClick()
                        setNewData({
                            analysisCode: '',
                            analysisName: '',
                        })
                    }
                }
                )
        } catch (error) {

        }
    }


    useEffect(() => {
        if (isEdit) {
            setNewData({
                analysisTypeId: id,
                analysisCode: analysisData?.analysisCode,
                analysisName: analysisData?.analysisName,
                rStatus: analysisData?.rStatus,
            })
        }
    }, [analysisData])

    return (
        <Modal isOpen={show} toggle={() => onCloseClick()} top={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => onCloseClick()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <CardTitle className="mb-4" tag="h1" >{isEdit ? 'Edit Analysis' : 'Add Analysis'}</CardTitle>
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Analysis Code
                                </Label>
                                <Input
                                    name='analysisCode'
                                    type="text"
                                    placeholder='Enter Analysis code'
                                    onChange={handleInput}
                                    onBlur={handleInput}
                                    value={newData?.analysisCode || ''}
                                // readOnly={notEditable}
                                // className={notEditable ? 'bg-secondary text-white' : ''}
                                />
                            </div>
                        </Col>

                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Analysis Name
                                </Label>
                                <Input
                                    name='analysisName'
                                    type="text"
                                    placeholder='Enter Analysis Name'
                                    onChange={handleInput}
                                    onBlur={handleInput}
                                    value={newData?.analysisName || ''}
                                // readOnly={notEditable}
                                // className={notEditable ? 'bg-secondary text-white' : ''}
                                />
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
                                    name="rStatus"
                                    value={newData.rStatus}
                                    onChange={handleInput}
                                >
                                    <option value={'1'}>Active</option>
                                    <option value={'0'}>Inactive</option>
                                </select>
                            </Col>
                        }

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
                            onClick={isEdit ? handleUpdateData : addedAnalysis}
                            disabled={!newData?.analysisCode}
                        >

                            {isEdit ? 'Update' : 'Add Analysis'}
                        </Button>
                    </div>
                </ModalBody>
            </div>
        </Modal>
    )
}

export default AnalysisModal