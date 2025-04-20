import React, { useState } from 'react'
import { Container, CardHeader, Card, CardBody, Row, Col, Label, Button } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import InputComponent from './InputComponent';
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { useEffect } from 'react';
import { Post } from '../../../utils/https';


const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
];

const EmployeeInformation = () => {

    // document.title = "Employee Information | SMART Accounting System";

    const [inputData, setInputData] = useState({
        empCode: "",
        empName: "",
        employeeTypeID: "",
        employeeTypeName: "",
        deptID: "",
        deptName: "",
        designation: "",
        grade: "",
        dateOfBirth: null,
        dateOfJoining: null,
        nid: "",
        tin: "",
        contactNo: "",
        bloodGroup: "",
        gender: "",
        spouseName: "",
        noOfChild: "",
        fatherName: "",
        motherName: "",
        nationality: "",
        religion: "",
        maritalStatus: "",
        activeStatus: "",
        inactiveReason: "",
        dateOfInactive: null,
        perDistrict: "",
        perThana: "",
        perPoffice: "",
        perPostCode: "",
        perAddress: "",
        preDistrict: "",
        preThana: "",
        prePoffice: "",
        prePostCode: "",
        preAddress: "",
        bankName: "",
        branchName: "",
        accountNumber: "",
    });

    const [getEmployeeType, setEmployeeType] = useState([]);
    const [getAllDepartment, setAllDepartment] = useState([]);

    const handleEmployeeTypes = (selectedOption) => {
        setInputData({
            ...inputData,
            employeeTypeID: selectedOption.value,
            employeeTypeName: selectedOption.label,
        });
    };

    const handleDepartment = (selectedOption) => {
        setInputData({
            ...inputData,
            deptID: selectedOption.value,
            deptName: selectedOption.label,
        });
    };

    const handleDOB = (trDate, dateOfBirth) => {
        const name = dateOfBirth;
        if (trDate === "") {
            setInputData({ ...inputData, [name]: null });
        } else {
            setInputData({ ...inputData, [name]: trDate });
        }
    };

    const handleJoiningDate = (trDate, joiningDate) => {
        const name = joiningDate;
        if (trDate === "") {
            setInputData({ ...inputData, [name]: null });
        } else {
            setInputData({ ...inputData, [name]: trDate });
        }
    };

    const handleInactiveDate = (trDate, inActiveDate) => {
        const name = inActiveDate;
        if (trDate === "") {
            setInputData({ ...inputData, [name]: null });
        } else {
            setInputData({ ...inputData, [name]: trDate });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "grade") {
            setInputData({ ...inputData, [name]: parseInt(value) });
        } else if (name === "noOfChild") {
            setInputData({ ...inputData, [name]: parseInt(value) });
        }
        else {
            setInputData({ ...inputData, [name]: value });
        }
    };


    const handleEmployeeStatus = (selectedOption) => {
        setInputData({
            ...inputData,
            activeStatus: selectedOption.value,
        });
    };

    const handleGender = (selectedOption) => {
        setInputData({
            ...inputData,
            gender: selectedOption.value,
        })
    };

    const handleMaritalStatus = (selectedOption) => {
        setInputData({
            ...inputData,
            maritalStatus: selectedOption.value,
        })
    };

    const handleBloodGroup = (selectedOption) => {
        setInputData({
            ...inputData,
            bloodGroup: selectedOption.value,
        });
    };

    const handleReligion = (selectedOption) => {
        setInputData({
            ...inputData,
            religion: selectedOption.value,
        });
    };

    const getAllEmployeeTypes = async () => {
        try {
            await Post('/api/EmployeeManagement/GetAllEmployeeTypes')
                .then(res => {
                    res.data.data
                    setEmployeeType(res.data.data);
                })
        } catch (error) {
            console.log(error)
        }
    };

    const getAllDepartments = async () => {
        try {
            await Post('/api/EmployeeManagement/GetAllDepartment')
                .then(res => {
                    res.data.data
                    setAllDepartment(res.data.data);
                })
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getAllEmployeeTypes()
        getAllDepartments()
    }, [])



    const handleSubmit = () => {
        const data = {
            data: inputData
        };
        console.log("Data ----------->>>>> ", data);

        try {
            Post('/api/EmployeeManagement/InsertEmployee', data)
                .then(res => {
                    // console.log("res --------->>>>>", res)
                    if (res.data.success === false) {
                        toast.error(res.data.errorMessage);
                    } else {
                        toast.success("Employee Added Successfully");
                        setInputData({
                            empCode: "",
                            empName: "",
                            employeeTypeID: "",
                            employeeTypeName: "",
                            deptID: "",
                            deptName: "",
                            designation: "",
                            grade: "",
                            dateOfBirth: null,
                            dateOfJoining: null,
                            nid: "",
                            tin: "",
                            contactNo: "",
                            bloodGroup: "",
                            gender: "",
                            spouseName: "",
                            noOfChild: "",
                            fatherName: "",
                            motherName: "",
                            nationality: "",
                            religion: "",
                            maritalStatus: "",
                            activeStatus: "",
                            inactiveReason: "",
                            dateOfInactive: null,
                            perDistrict: "",
                            perThana: "",
                            perPoffice: "",
                            perPostCode: "",
                            perAddress: "",
                            preDistrict: "",
                            preThana: "",
                            prePoffice: "",
                            prePostCode: "",
                            preAddress: "",
                            bankName: "",
                            branchName: "",
                            accountNumber: "",
                        });
                    }
                })
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Employee Information" breadcrumbItem="Employee Information  / New Employee Information" />

                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center">NEW EMPLOYEE INFORMATION SETUP SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card>
                <Row>
                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>
                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Code*</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Employee Code"
                                    name="empCode"
                                    onChange={handleInputChange}
                                    value={inputData.empCode}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Name*</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Employee Name"
                                    name="empName"
                                    onChange={handleInputChange}
                                    value={inputData.empName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Type</Label>
                                <Select
                                    placeholder="Select Employee Type"
                                    options={getEmployeeType.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.employeeTypes
                                        }
                                    })}
                                    onChange={handleEmployeeTypes}
                                    value={inputData.employeeTypeName ? { value: inputData.employeeTypeID, label: inputData.employeeTypeName } : null}
                                    name='employeeTypeName'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Select Department</Label>
                                <Select
                                    placeholder="Select Department"
                                    options={getAllDepartment.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.departmentName
                                        }
                                    })}
                                    onChange={handleDepartment}
                                    value={inputData.deptName ? { value: inputData.deptID, label: inputData.deptName } : null}
                                    name='deptName'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Designation</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Designation"
                                    name="designation"
                                    onChange={handleInputChange}
                                    value={inputData.designation}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Grade</Label>
                                <InputComponent
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Grade"
                                    name="grade"
                                    onChange={handleInputChange}
                                    value={inputData.grade}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Date of Birth</Label>
                                <Flatpickr
                                    className="form-control"
                                    placeholder="dd/mm/yyyy"
                                    options={{
                                        altInput: true,
                                        dateFormat: "Y-m-d"
                                    }}
                                    id="date"
                                    name="date"
                                    onChange={(e, date) => handleDOB(date, "dateOfBirth")}
                                    value={inputData.dateOfBirth}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Joining Date</Label>
                                <Flatpickr
                                    className="form-control"
                                    placeholder="dd/mm/yyyy"
                                    options={{
                                        altInput: true,
                                        dateFormat: "Y-m-d"
                                    }}
                                    id="date"
                                    name="date"
                                    onChange={(e, date) => handleJoiningDate(date, "dateOfJoining")}
                                    value={inputData.dateOfJoining}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">NID</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter NID"
                                    name="nid"
                                    onChange={handleInputChange}
                                    value={inputData.nid}
                                />

                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>

                                <Label className="control-label fw-bolder mb-3 mt-3">TIN</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter TIN"
                                    name="tin"
                                    onChange={handleInputChange}
                                    value={inputData.tin}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Contract Number</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Contract Number"
                                    name="contactNo"
                                    onChange={handleInputChange}
                                    value={inputData.contactNo}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Blood Group</Label>
                                <Select
                                    placeholder="Select Blood Group"
                                    options={[
                                        { value: "A+", label: "A+" },
                                        { value: "A-", label: "A-" },
                                        { value: "B+", label: "B+" },
                                        { value: "B-", label: "B-" },
                                        { value: "O+", label: "O+" },
                                        { value: "O-", label: "O-" },
                                        { value: "AB+", label: "AB+" },
                                        { value: "AB-", label: "AB-" },
                                    ]}
                                    onChange={handleBloodGroup}
                                    value={inputData.bloodGroup ? { value: inputData.bloodGroup, label: inputData.bloodGroup } : null}
                                    name='bloodGroup'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Gender</Label>
                                <Select
                                    placeholder="Select Gender"
                                    options={[
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                        { value: "Other", label: "Other" },
                                    ]}
                                    onChange={handleGender}
                                    value={inputData.gender ? { value: inputData.gender, label: inputData.gender } : null}
                                    name='gender'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Spouse Name</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Spouse Name"
                                    name="spouseName"
                                    onChange={handleInputChange}
                                    value={inputData.spouseName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">No of Children</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter No of Children"
                                    name="noOfChild"
                                    onChange={handleInputChange}
                                    value={inputData.noOfChild}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Father Name</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter father Name"
                                    name="fatherName"
                                    onChange={handleInputChange}
                                    value={inputData.fatherName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Mother Name</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Mother Name"
                                    name="motherName"
                                    onChange={handleInputChange}
                                    value={inputData.motherName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Nationality</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Nationality"
                                    name="nationality"
                                    onChange={handleInputChange}
                                    value={inputData.nationality}
                                />

                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>

                                <Label className="control-label fw-bolder mb-3 mt-3">Religion</Label>
                                <Select
                                    placeholder="Select Religion"
                                    options={[
                                        { value: "Islam", label: "Islam" },
                                        { value: "Hindu", label: "Hindu" },
                                        { value: "Christian", label: "Christian" },
                                        { value: "Buddhist", label: "Buddhist" },
                                    ]}
                                    onChange={handleReligion}
                                    value={inputData.religion ? { value: inputData.religion, label: inputData.religion } : null}
                                    name='religion'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Marital Status</Label>
                                <Select
                                    placeholder="Select Marital Status"
                                    options={[
                                        { value: "Married", label: "Married" },
                                        { value: "Unmarried", label: "Unmarried" },
                                        { value: "Widow", label: "Widow" },
                                        { value: "Widower", label: "Widower" },
                                        { value: "Separated", label: "Separated" },
                                        { value: "Divorced", label: "Divorced" },
                                        { value: "Single", label: "Single" },
                                    ]}
                                    onChange={handleMaritalStatus}
                                    value={inputData.maritalStatus ? { value: inputData.maritalStatus, label: inputData.maritalStatus } : null}
                                    name='maritalStatus'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Status</Label>
                                <Select
                                    placeholder={inputData.employeeStatus === 0 ? "Inactive" : "Select Employee Status"}
                                    options={statusOptions}
                                    onChange={handleEmployeeStatus}
                                    value={inputData.employeeStatus}
                                    name='activeStatus'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Inactive Reason</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Inactive Reason"
                                    name="inactiveReason"
                                    onChange={handleInputChange}
                                    value={inputData.inactiveReason}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Date of Inactive</Label>
                                <Flatpickr
                                    className="form-control"
                                    placeholder="dd/mm/yyyy"
                                    options={{
                                        altInput: true,
                                        dateFormat: "Y-m-d"
                                    }}
                                    id="date"
                                    name="date"
                                    onChange={(e, date) => handleInactiveDate(date, "dateOfInactive")}
                                    value={inputData.dateOfInactive}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent District</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent District"
                                    name="perDistrict"
                                    onChange={handleInputChange}
                                    value={inputData.perDistrict}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Thana</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Thana"
                                    name="perThana"
                                    onChange={handleInputChange}
                                    value={inputData.perThana}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Post Office</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Post Office"
                                    name="perPoffice"
                                    onChange={handleInputChange}
                                    value={inputData.perPoffice}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Post Code</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Post Code"
                                    name="perPostCode"
                                    onChange={handleInputChange}
                                    value={inputData.perPostCode}
                                />

                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Address</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Address"
                                    name="perAddress"
                                    onChange={handleInputChange}
                                    value={inputData.perAddress}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present District</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present District"
                                    name="preDistrict"
                                    onChange={handleInputChange}
                                    value={inputData.preDistrict}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Thana</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Thana"
                                    name="preThana"
                                    onChange={handleInputChange}
                                    value={inputData.preThana}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Post Office</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Post Office"
                                    name="prePoffice"
                                    onChange={handleInputChange}
                                    value={inputData.prePoffice}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Post Code</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Post Code"
                                    name="prePostCode"
                                    onChange={handleInputChange}
                                    value={inputData.prePostCode}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Address</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Address"
                                    name="preAddress"
                                    onChange={handleInputChange}
                                    value={inputData.preAddress}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Bank Name</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Bank Name"
                                    name="bankName"
                                    onChange={handleInputChange}
                                    value={inputData.bankName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Branch Name</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Branch Name"
                                    name="branchName"
                                    onChange={handleInputChange}
                                    value={inputData.branchName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Bank Account Number</Label>
                                <InputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Bank Account Number"
                                    name="accountNumber"
                                    onChange={handleInputChange}
                                    value={inputData.accountNumber}
                                />

                            </CardBody>
                            <div className='text-end px-2 py-2'>
                                <Button
                                    color="primary"
                                    className='mt-3'
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Card>
                    </Col>

                </Row>

                <ToastContainer />
            </Container>
        </div>
    )
}

export default EmployeeInformation