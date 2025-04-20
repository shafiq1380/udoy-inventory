import React, { useEffect, useState } from "react"
import { Button, Col, Label, Modal, ModalBody, Row } from "reactstrap"
import CustomInputField from "./CustomInputField";

const UpdateModal = ({ show, onCloseClick, updateBranchData, branchData, updateBank }) => {

    const [branchInfo, setBranchInfo] = useState()

    useEffect(() => {
        setBranchInfo(branchData)
    }, [branchData])

    const handleInput = (e) => {
        const { name, value } = e.target
        setBranchInfo({ ...branchInfo, status: 1, [name]: value })
    }

    return (
        <Modal isOpen={show} toggle={() => onCloseClick('update')} centered={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => onCloseClick('update')} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    {
                        updateBank ?
                            <Row>
                                <CustomInputField
                                    label={'Bank Code'}
                                    placeholder={'Enter Bank Code'}
                                    notEditable={true}
                                    handleInput={handleInput}
                                    value={branchInfo?.bankCode}
                                    name={"bankCode"}
                                />
                                <CustomInputField
                                    label={'Bank Name'}
                                    placeholder={'Enter bank name'}
                                    handleInput={handleInput}
                                    value={branchInfo?.bankName}
                                    name={"bankName"}
                                />
                                <Col className="col-12 mb-3">
                                    <Label className="activeStatus">
                                        Active Status
                                    </Label>
                                    <select
                                        className="form-select"
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
                            :
                            <Row>
                                <CustomInputField
                                    label={'Bank Code'}
                                    placeholder={'Enter Bank Code'}
                                    handleInput={handleInput}
                                    value={branchInfo?.bankCode}
                                    name={"bankCode"}
                                    notEditable={true}
                                />
                                <CustomInputField
                                    label={'Branch Code'}
                                    placeholder={'Enter Branch Code'}
                                    handleInput={handleInput}
                                    value={branchInfo?.branchCode}
                                    name={"branchCode"}
                                    notEditable={true}
                                />
                                <CustomInputField
                                    label={'Branch Name'}
                                    placeholder={'Enter Branch name'}
                                    handleInput={handleInput}
                                    value={branchInfo?.branchName}
                                    name={"branchName"}
                                />
                                <CustomInputField
                                    label={'Branch Address'}
                                    placeholder={'Enter Branch Address'}
                                    handleInput={handleInput}
                                    value={branchInfo?.branchAddress}
                                    name={"branchAddress"}
                                />
                                <CustomInputField
                                    label={'Contact Number'}
                                    placeholder={'Enter Contact Number'}
                                    handleInput={handleInput}
                                    value={branchInfo?.contactNumber}
                                    name={"contactNumber"}
                                />

                                <Col className="col-12 mb-3">
                                    <Label className="activeStatus">
                                        Active Status
                                    </Label>
                                    <select
                                        className="form-select"
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


                    }

                    <div className="text-right">
                        {/* <button type="button" className="btn btn-danger" onClick={onDeleteClick}>Delete Now</button> */}
                        <Button
                            type="button"
                            color="success"
                            className="mb-2 me-2  px-3 "
                            onClick={() => updateBranchData(branchInfo)}
                        >
                            Update
                        </Button>
                    </div>
                </ModalBody>
            </div>
        </Modal>
    )
}

export default UpdateModal