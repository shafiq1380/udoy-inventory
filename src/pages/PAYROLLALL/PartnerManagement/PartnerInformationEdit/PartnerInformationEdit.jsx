import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Label, Row } from 'reactstrap';
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import Select from 'react-select'
import { Post } from '../../../../utils/https';


const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
];

const PartnerInformationEdit = () => {

    const { state } = useLocation();

    const navigate = useNavigate();


    const userID = JSON.parse(localStorage.getItem('userID'));

    const [partnerTypes, setPartnerTypes] = useState([]);

    const [inputData, setInputData] = useState({
        id: 0,
        partnerTypeId: 0,
        partnerTypeName: "",
        partnerName: "",
        displayAddress: "",
        billtoAddress: "",
        shiptoAddress: "",
        emailAddress: "",
        contractNumber: "",
        countryName: "",
        divisionIName: "",
        districtName: "",
        thanaUpozilla: "",
        zone: "",
        binNumber: "",
        coaCode: "",
        rStatus: 1,
    });

    useEffect(() => {
        if (state) {
            setInputData(state);
        }
    }, [state])

    const handleInputData = (e) => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value
        });
    };


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

    const getAllPartnerType = () => {
        try {
            Post('/api/v1/PartnerManagement/GetAllPartnerType')
                .then(res => {
                    res.data.data
                    setPartnerTypes(res.data.data);
                })
        } catch (error) {
            console.log(error)
        }
    };

    // console.log("partnerTypes", partnerTypes)

    useEffect(() => {
        getAllPartnerType();
    }, [inputData.id]);


    const handlePartnerType = (selectedOption) => {
        setInputData({
            ...inputData,
            partnerTypeId: selectedOption.value,
            partnerTypeName: selectedOption.label,
        });
    };

    const handleEmployeeStatus = (selectedOption) => {
        setInputData({
            ...inputData,
            rStatus: selectedOption.value,
        });
    };

    const handleUpdatePartner = () => {
        const data = {
            data: {
                id: state.id,
                partnerTypeId: inputData.partnerTypeId,
                partnerTypeName: inputData.partnerTypeName,
                partnerName: inputData.partnerName,
                displayAddress: inputData.displayAddress,
                billtoAddress: inputData.billtoAddress,
                shiptoAddress: inputData.shiptoAddress,
                emailAddress: inputData.emailAddress,
                contractNumber: inputData.contractNumber,
                countryName: inputData.countryName,
                divisionIName: inputData.divisionIName,
                districtName: inputData.districtName,
                thanaUpozilla: inputData.thanaUpozilla,
                zone: inputData.zone,
                binNumber: inputData.binNumber,
                coaCode: inputData.coaCode,
                rStatus: inputData.rStatus,
                lastUpdateUserId: userID,
            }
        }
        // console.log("Data ----------->>>", data);

        try {
            Post('/api/PartnerManagement/UpdatePartner', data)
                .then(res => {
                    // console.log("res", res);
                    if (res.status === 200) {
                        toast.success("Partner Updated Successfully");
                        setTimeout(() => {
                            setInputData({
                                partnerTypeId: "",
                                partnerTypeName: "",
                                partnerName: "",
                                displayAddress: "",
                                billtoAddress: "",
                                shiptoAddress: "",
                                emailAddress: "",
                                contractNumber: "",
                                countryName: "",
                                divisionIName: "",
                                districtName: "",
                                thanaUpozilla: "",
                                zone: "",
                                binNumber: "",
                                coaCode: "",
                                rStatus: '',
                            })
                            navigate('/partner-account')
                        }, 1500);
                    }
                })
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Edit Partner" breadcrumbItem="Setup / Partner Management" />

                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center">EDIT PARTNER INFORMATION SETUP SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Row>
                    <Col sm="12" md="6" lg="6">

                        <Card>
                            <CardBody>
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
                                    value={inputData.partnerName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Partner Address</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Address"
                                    name='displayAddress'
                                    value={inputData.displayAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Billing Address</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Billing Address"
                                    name='billtoAddress'
                                    value={inputData.billtoAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Ship To Address</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Ship To Address"
                                    name='shiptoAddress'
                                    value={inputData.shiptoAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Email Address</Label>
                                <Input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter Partner Email Address"
                                    name='emailAddress'
                                    value={inputData.emailAddress}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Contract Number</Label>
                                <Input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Partner Contract Number"
                                    name='contractNumber'
                                    value={inputData.contractNumber}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Country Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Country Name"
                                    name='countryName'
                                    value={inputData.countryName}
                                    onChange={handleInputData}
                                />

                            </CardBody>
                        </Card>

                    </Col>

                    <Col sm="12" md="6" lg="6">

                        <Card>
                            <CardBody>

                                <Label className="form-label">Division Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Division Name"
                                    name='divisionIName'
                                    value={inputData.divisionIName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">District Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner District Name"
                                    name='districtName'
                                    value={inputData.districtName}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Thana Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Thana Name"
                                    name='thanaUpozilla'
                                    value={inputData.thanaUpozilla}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">Zone Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner Zone Name"
                                    name='zone'
                                    value={inputData.zone}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">BIN Number</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Partner BIN Number"
                                    name='binNumber'
                                    value={inputData.binNumber}
                                    onChange={handleInputData}
                                />

                                <br />

                                <Label className="form-label">COA Code</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter COA Code"
                                    name='coaCode'
                                    value={inputData.coaCode}
                                    onChange={handleInputData}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Status</Label>
                                <Select
                                    placeholder={inputData.rStatus === 0 ? "Inactive" : "Select Employee Status"}
                                    options={statusOptions}
                                    onChange={handleEmployeeStatus}
                                    value={inputData.rStatus === 0 ? { value: 0, label: "Inactive" } : { value: 1, label: "Active" }}
                                    name='activeStatus'
                                />

                                <div className='text-end'>
                                    <Button
                                        color="primary"
                                        className='mt-3'
                                        onClick={handleUpdatePartner}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>

                <ToastContainer />
            </Container>
        </div>
    )
}

export default PartnerInformationEdit