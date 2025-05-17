import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Label, Row, Button } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useLocation, useNavigate } from 'react-router-dom';
import EditInputComponent from './EditInputComponent';
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import { Post } from '../../../utils/https';
import { IoMdArrowRoundBack } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";



const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
];

const pfStatus = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" }
];

const pfInterest = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" }
];

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const EmployeeInformationEdit = () => {

    const { state } = useLocation();

    // console.log("location state ------->>", state);

    const navigate = useNavigate();

    const [inputData, setInputData] = useState({
        empCode: "",
        empName: "",
        employeeTypeID: 0,
        employeeTypeName: "",
        deptID: 0,
        deptName: "",
        designation: "",
        grade: 0,
        dateOfBirth: null,
        dateOfJoining: null,
        nid: "",
        tin: "",
        contactNo: "",
        bloodGroup: "",
        gender: "",
        spouseName: "",
        noOfChild: 0,
        fatherName: "",
        motherName: "",
        nationality: "",
        religion: "",
        maritalStatus: "",
        workingLocation: "",
        activeStatus: 1,
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
        pfID: "",
        pfStatus: null,
        pfInterest: null,
    });

    useEffect(() => {
        if (state) {
            setInputData(state);
        }
    }, [state])

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
        const input = value
        // if ((input.match(/\./g) || []).length > 1) {
        //     return;
        // }
        const numericValue = input.replace(/[^0-9.]/g, '');

        if (name === "grade") {
            setInputData({ ...inputData, [name]: numericValue });
        } else if (name === "noOfChild") {
            setInputData({ ...inputData, [name]: numericValue });
        } else {
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

    const handleWorkLocation = (selectedOption) => {
        setInputData({
            ...inputData,
            workingLocation: selectedOption.value,
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

    // const handlePfStatus = (selectedOption) => {
    //     setInputData({
    //         ...inputData,
    //         pfStatus: selectedOption.value || null,
    //     });
    // };

    // const handlePfInterest = (selectedOption) => {
    //     setInputData({
    //         ...inputData,
    //         pfInterest: selectedOption?.value || null,
    //     });
    // };

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
            await Post('/api/v1/EmployeeManagement/GetAllDepartment')
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

    const handleUpdate = () => {

        if (!inputData.empCode) {
            toast.error("Enter Employee Code", toastOptions);
            return;
        };
        if (!inputData.empName) {
            toast.error("Enter Employee Name", toastOptions);
            return;
        };
        if (!inputData.employeeTypeID) {
            toast.error("Select Employee Type", toastOptions);
            return;
        };
        if (!inputData.deptID) {
            toast.error("Select Department", toastOptions);
            return;
        };
        if (!inputData.designation) {
            toast.error("Enter Designation", toastOptions);
            return;
        };
        if (!inputData.grade) {
            toast.error("Select Grade", toastOptions);
            return;
        };
        if (!inputData.gender) {
            toast.error("Select Gender", toastOptions);
            return;
        };
        if (!inputData.workingLocation) {
            toast.error("Select Work Location", toastOptions);
            return;
        };

        if (inputData.pfID) {
            if (inputData.pfInterest === null || inputData.pfInterest === undefined) {
                toast.error("Select PF Interest", toastOptions);
                return;
            }
            if (inputData.pfStatus === null || inputData.pfStatus === undefined) {
                toast.error("Select PF Status", toastOptions);
                return;
            }
        };

        const data = {
            data: {
                id: inputData.id,
                empCode: inputData.empCode,
                empName: inputData.empName,
                employeeTypeID: inputData.employeeTypeID ? inputData.employeeTypeID : 0,
                employeeTypeName: inputData.employeeTypeName ? inputData.employeeTypeName : "",
                deptID: inputData.deptID ? inputData.deptID : 0,
                deptName: inputData.deptName ? inputData.deptName : "",
                designation: inputData.designation,
                grade: inputData.grade ? inputData.grade : 0,
                dateOfBirth: inputData.dateOfBirth ? inputData.dateOfBirth : null,
                dateOfJoining: inputData.dateOfJoining ? inputData.dateOfJoining : null,
                nid: inputData.nid,
                tin: inputData.tin,
                contactNo: inputData.contactNo,
                bloodGroup: inputData.bloodGroup,
                gender: inputData.gender,
                spouseName: inputData.spouseName,
                noOfChild: inputData.noOfChild ? inputData.noOfChild : 0,
                fatherName: inputData.fatherName,
                motherName: inputData.motherName,
                nationality: inputData.nationality,
                religion: inputData.religion,
                maritalStatus: inputData.maritalStatus,
                workingLocation: inputData.workingLocation,
                activeStatus: inputData.activeStatus,
                inactiveReason: inputData.inactiveReason,
                dateOfInactive: inputData.dateOfInactive ? inputData.dateOfInactive : null,
                perDistrict: inputData.perDistrict,
                perThana: inputData.perThana,
                perPoffice: inputData.perPoffice,
                perPostCode: inputData.perPostCode,
                perAddress: inputData.perAddress,
                preDistrict: inputData.preDistrict,
                preThana: inputData.preThana,
                prePoffice: inputData.prePoffice,
                prePostCode: inputData.prePostCode,
                preAddress: inputData.preAddress,
                bankName: inputData.bankName,
                branchName: inputData.branchName,
                accountNumber: inputData.accountNumber,
                pfID: inputData.pfID,
                pfStatus: inputData.pfID ? inputData.pfStatus : null,
                pfInterest: inputData.pfID ? inputData.pfInterest : null
            }
        }

        console.log("sending data ----->>> ", data);


        if (state !== null) {
            // console.log(data)
            try {
                Post('/api/EmployeeManagement/UpdateEmployee', data)
                    .then(res => {
                        // console.log(res)
                        if (res.data.success === true) {
                            toast.success("Employee Updated Successfully", toastOptions);
                            // setTimeout(() => {
                            navigate('/all-employee-list');
                            // }, 2000);
                        } else {
                            toast.error(res.data.errorMessage, toastOptions);
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        } else {
            const { id, ...dataWithoutId } = inputData;
            const data2 = {
                data: dataWithoutId
            };

            // console.log("sending data ----->>> ", data2)

            try {
                Post('/api/EmployeeManagement/InsertEmployee', data2)
                    .then(res => {
                        if (res.data.success === true) {
                            toast.success("Employee Updated Successfully", toastOptions);
                            // setTimeout(() => {
                            navigate('/all-employee-list');
                            // }, 2000);
                        } else {
                            toast.error(res.data.errorMessage, toastOptions);
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        }

    };

    // console.log(state)

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Edit Employee" breadcrumbItem="Setup / All Employee List" />

                <Button
                    type="button"
                    color="success"
                    className="btn-rounded px-3 mb-2"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={20} color='white' />
                </Button>

                <Card>
                    <CardBody>
                        <CardHeader>
                            {
                                state !== null ?
                                    <h3 className="text-center">EDIT EMPLOYEE INFORMATION SETUP SCREEN</h3>
                                    :
                                    <h3 className="text-center">ADD EMPLOYEE INFORMATION SETUP SCREEN</h3>
                            }
                        </CardHeader>
                    </CardBody>
                </Card>
                <Row>
                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>
                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Code*</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Employee Code"
                                    name="empCode"
                                    onChange={handleInputChange}
                                    value={inputData.empCode}
                                    readonly={state !== null ? true : false}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Name*</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Employee Name"
                                    name="empName"
                                    onChange={handleInputChange}
                                    value={inputData.empName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Type*</Label>
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

                                <Label className="control-label fw-bolder mb-3 mt-3">Select Department*</Label>
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

                                <Label className="control-label fw-bolder mb-3 mt-3">Designation *</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Designation"
                                    name="designation"
                                    onChange={handleInputChange}
                                    value={inputData.designation}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Grade *</Label>
                                <EditInputComponent
                                    type="text"
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
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter NID"
                                    name="nid"
                                    onChange={handleInputChange}
                                    value={inputData.nid}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">PF Interest *</Label>
                                <Select
                                    placeholder="Select PF Interest"
                                    options={pfInterest}
                                    onChange={(selectedOption) =>
                                        setInputData({ ...inputData, pfInterest: selectedOption.value })
                                    }
                                    value={pfInterest.find(option => option.value === inputData.pfInterest)}
                                    name="pfInterest"
                                />

                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>

                                <Label className="control-label fw-bolder mb-3 mt-3">TIN</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter TIN"
                                    name="tin"
                                    onChange={handleInputChange}
                                    value={inputData.tin}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Contract Number</Label>
                                <EditInputComponent
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

                                <Label className="control-label fw-bolder mb-3 mt-3">Gender *</Label>
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
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Spouse Name"
                                    name="spouseName"
                                    onChange={handleInputChange}
                                    value={inputData.spouseName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">No of Children</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter No of Children"
                                    name="noOfChild"
                                    onChange={handleInputChange}
                                    value={inputData.noOfChild}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Father Name</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter father Name"
                                    name="fatherName"
                                    onChange={handleInputChange}
                                    value={inputData.fatherName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Mother Name</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Mother Name"
                                    name="motherName"
                                    onChange={handleInputChange}
                                    value={inputData.motherName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Nationality</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Nationality"
                                    name="nationality"
                                    onChange={handleInputChange}
                                    value={inputData.nationality}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">PF Status *</Label>
                                <Select
                                    placeholder="Select PF Status"
                                    options={pfStatus}
                                    onChange={(selectedOption) =>
                                        setInputData({ ...inputData, pfStatus: selectedOption.value })
                                    }
                                    value={pfStatus.find(option => option.value === inputData.pfStatus)}
                                    name="pfStatus"
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

                                <Label className="control-label fw-bolder mb-3 mt-3">Employee Status*</Label>
                                <Select
                                    placeholder={inputData.activeStatus === 0 ? "Inactive" : "Select Employee Status"}
                                    options={statusOptions}
                                    onChange={handleEmployeeStatus}
                                    value={inputData.activeStatus === 0 ? { value: 0, label: "Inactive" } : { value: 1, label: "Active" }}
                                    name='activeStatus'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Work Location * </Label>
                                <Select
                                    placeholder="Select Work Location"
                                    options={[
                                        { value: "Dhaka City", label: "Dhaka City" },
                                        {
                                            value: "Other Divisional City", label: "Other Divisional City"
                                        },
                                        { value: "Other", label: "Other" }
                                    ]}
                                    onChange={handleWorkLocation}
                                    value={inputData.workingLocation ? { value: inputData.workingLocation, label: inputData.workingLocation } : null}
                                    name='workingLocation'
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Inactive Reason</Label>
                                <EditInputComponent
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
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent District"
                                    name="perDistrict"
                                    onChange={handleInputChange}
                                    value={inputData.perDistrict}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Thana</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Thana"
                                    name="perThana"
                                    onChange={handleInputChange}
                                    value={inputData.perThana}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Post Office</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Post Office"
                                    name="perPoffice"
                                    onChange={handleInputChange}
                                    value={inputData.perPoffice}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">PF ID, CPF/GPF</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex: CPF123/GPF123"
                                    name="pfID"
                                    onChange={handleInputChange}
                                    value={inputData.pfID}
                                />

                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="12" md="6" lg="3">
                        <Card>
                            <CardBody>

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Post Code</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Post Code"
                                    name="perPostCode"
                                    onChange={handleInputChange}
                                    value={inputData.perPostCode}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Permanent Address</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Permanent Address"
                                    name="perAddress"
                                    onChange={handleInputChange}
                                    value={inputData.perAddress}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present District</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present District"
                                    name="preDistrict"
                                    onChange={handleInputChange}
                                    value={inputData.preDistrict}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Thana</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Thana"
                                    name="preThana"
                                    onChange={handleInputChange}
                                    value={inputData.preThana}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Post Office</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Post Office"
                                    name="prePoffice"
                                    onChange={handleInputChange}
                                    value={inputData.prePoffice}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Post Code</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Post Code"
                                    name="prePostCode"
                                    onChange={handleInputChange}
                                    value={inputData.prePostCode}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Present Address</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Present Address"
                                    name="preAddress"
                                    onChange={handleInputChange}
                                    value={inputData.preAddress}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Bank Name</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Bank Name"
                                    name="bankName"
                                    onChange={handleInputChange}
                                    value={inputData.bankName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Branch Name</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Branch Name"
                                    name="branchName"
                                    onChange={handleInputChange}
                                    value={inputData.branchName}
                                />

                                <Label className="control-label fw-bolder mb-3 mt-3">Bank Account Number</Label>
                                <EditInputComponent
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Bank Account Number"
                                    name="accountNumber"
                                    onChange={handleInputChange}
                                    value={inputData.accountNumber}
                                />

                            </CardBody>
                            <Button
                                color="success mx-4 p-2 mb-4"
                                className='w-full'
                                onClick={handleUpdate}
                            // disabled={inputData.empCode === "" || inputData.empName === "" || inputData.employeeTypeID === "" || inputData.activeStatus === ""}
                            >
                                {state ? "Update" : "Add Employee"}
                            </Button>
                        </Card>
                    </Col>

                </Row>

                <ToastContainer />
            </Container>
        </div>
    )
}

export default EmployeeInformationEdit