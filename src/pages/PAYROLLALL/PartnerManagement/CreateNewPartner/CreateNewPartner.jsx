/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
import { Post } from '../../../../utils/https';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const CreateNewPartner = ({ newPartnerModal, setNewPartnerModal, partnerTypes }) => {

    const userID = JSON.parse(localStorage.getItem('userID'));


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'white',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'white',
        }),
    };

    const [inputData, setInputData] = useState({
        partnerTypeId: 0,
        partnerTypeName: "",
        partnerName: "",
        partnerAddress: "",
        partnerBillingAddress: "",
        partnerShipToAddress: "",
        partnerEmailAddress: "",
        partnerContractNumber: "",
        partnerCountryName: "",
        partnerDivisionName: "",
        partnerDistrictName: "",
        partnerThanaName: "",
        partnerZoneName: "",
        partnerBINNumber: "",
        coaCode: "",
    });

    const handlePartnerType = (selectedOption) => {
        setInputData({
            ...inputData,
            partnerTypeId: selectedOption.value,
            partnerTypeName: selectedOption.label,
        });
    };

    const handleInputData = (e) => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value
        });
    };

    const createNewPartner = () => {
        const data = {
            data: {
                partnerTypeId: inputData.partnerTypeId,
                partnerTypeName: inputData.partnerTypeName,
                partnerName: inputData.partnerName,
                displayAddress: inputData.partnerAddress,
                billtoAddress: inputData.partnerBillingAddress,
                shiptoAddress: inputData.partnerShipToAddress,
                emailAddress: inputData.partnerEmailAddress,
                contractNumber: inputData.partnerContractNumber,
                countryName: inputData.partnerCountryName,
                divisionIName: inputData.partnerDivisionName,
                districtName: inputData.partnerDistrictName,
                thanaUpozilla: inputData.partnerThanaName,
                zone: inputData.partnerZoneName,
                binNumber: inputData.partnerBINNumber,
                coaCode: inputData.coaCode,
                rStatus: 1,
                entryUserId: userID
            }
        }
        // console.log("Data ----------->>>", data);

        try {
            Post('/api/v1/PartnerManagement/InsertPartner', data)
                .then(res => {
                    // console.log("res", res);
                    if (res.status === 200) {
                        toast.success("Partner Created Successfully");
                        setTimeout(() => {
                            setNewPartnerModal(!newPartnerModal);
                            setInputData({
                                partnerTypeId: "",
                                partnerTypeName: "",
                                partnerName: "",
                                partnerAddress: "",
                                partnerBillingAddress: "",
                                partnerShipToAddress: "",
                                partnerEmailAddress: "",
                                partnerContractNumber: "",
                                partnerCountryName: "",
                                partnerDivisionName: "",
                                partnerDistrictName: "",
                                partnerThanaName: "",
                                partnerZoneName: "",
                                partnerBINNumber: "",
                                coaCode: "",
                            })
                        }, 1000);
                    }
                })
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <Modal
                isOpen={newPartnerModal}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => { setNewPartnerModal(!newPartnerModal) }}
                size="xl"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => { setNewPartnerModal(!newPartnerModal) }}> Create New partner</ModalHeader>
                    <ModalBody>

                        <Row>
                            <Col sm="12" md="6" lg="6">

                                <Label className="control-label">Select Partner Type</Label>
                                <Select
                                    styles={customStyles}
                                    placeholder="Select Partner Type"
                                    options={partnerTypes.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.contractType
                                        }
                                    })}
                                    name='partnerTypeName'
                                    onChange={handlePartnerType}
                                    value={inputData.partnerTypeName ? { value: inputData.partnerTypeId, label: inputData.partnerTypeName } : null}
                                />

                                <br />

                                <Label className="form-label">Partner Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Name"
                                    name='partnerName'
                                    required
                                    value={inputData.partnerName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Partner Address</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Address"
                                    name='partnerAddress'
                                    required
                                    value={inputData.partnerAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Billing Address</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Billing Address"
                                    name='partnerBillingAddress'
                                    required
                                    value={inputData.partnerBillingAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Ship To Address</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Ship To Address"
                                    name='partnerShipToAddress'
                                    required
                                    value={inputData.partnerShipToAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Email Address</Label>
                                <Input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter Partner Email Address"
                                    name='partnerEmailAddress'
                                    required
                                    value={inputData.partnerEmailAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Contract Number</Label>
                                <Input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Partner Contract Number"
                                    name='partnerContractNumber'
                                    required
                                    value={inputData.partnerContractNumber}
                                    onChange={handleInputData}
                                />


                            </Col>

                            <Col sm="12" md="6" lg="6">

                                <Label className="form-label">Country Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Country Name"
                                    name='partnerCountryName'
                                    required
                                    value={inputData.partnerCountryName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Division Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Division Name"
                                    name='partnerDivisionName'
                                    required
                                    value={inputData.partnerDivisionName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">District Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner District Name"
                                    name='partnerDistrictName'
                                    required
                                    value={inputData.partnerDistrictName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Thana Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Thana Name"
                                    name='partnerThanaName'
                                    required
                                    value={inputData.partnerThanaName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Zone Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Zone Name"
                                    name='partnerZoneName'
                                    required
                                    value={inputData.partnerZoneName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">BIN Number</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner BIN Number"
                                    name='partnerBINNumber'
                                    required
                                    value={inputData.partnerBINNumber}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">COA Code</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter COA Code"
                                    name='coaCode'
                                    required
                                    value={inputData.coaCode}
                                    onChange={handleInputData}
                                />

                                <div className='text-end'>
                                    <Button
                                        color="primary"
                                        className='mt-3'
                                        onClick={createNewPartner}
                                    >
                                        Submit
                                    </Button>
                                </div>

                            </Col>
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="danger" onClick={() => { setNewPartnerModal(!newPartnerModal) }}>
                            Close
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default CreateNewPartner