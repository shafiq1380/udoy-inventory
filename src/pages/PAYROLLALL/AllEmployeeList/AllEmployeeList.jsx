import React, { useState, useEffect, useMemo } from 'react'
import { Post, fileUploadURL } from '../../../utils/https';
import { Button, Card, CardBody, Col, Container, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, UncontrolledTooltip } from 'reactstrap';
import TableContainer from '../../../components/Common/TableContainer';
import { useLocation, useNavigate, } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MobileNumber, UserEmail, UserID, UserName, UserStatus } from '../../UserList/UserCol';
import { useSelector } from 'react-redux';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import moment from 'moment';
import { authorization } from '../../../components/Common/Authorization';


const AllEmployeeList = () => {

    // document.title = "All Employee List | SMART Accounting System";

    const { loading } = useSelector(state => state.usersReducer);

    const navigate = useNavigate()
    const location = useLocation()

    const [allEmployee, setAllEmployee] = useState([]);
    const [emDtlsModal, setEmDtlsModal] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const getAllEmployee = () => {
        Post('/api/v1/EmployeeManagement/GetAllEmployee')
            .then((res) => {
                if (res.data.data !== null) {
                    setAllEmployee(res.data.data)
                }
            })
    };

    const handleAddNewEmployee = () => {
        navigate('/employee-information-edit')
    }

    // console.log(location.pathName)

    useEffect(() => {
        getAllEmployee();
    }, [location.pathname])

    //Authorization check
    useEffect(() => {
        authorization(61)
    }, [])


    // console.log(allEmployee)

    const columns = useMemo(
        () => [
            {
                Header: "User- ID",
                accessor: "empCode",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "PF-ID",
                accessor: "pfID",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "User-Name",
                accessor: "empName",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "Employee Type",
                accessor: "employeeTypeName",
                filter: 'select',
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Department",
                accessor: "deptName",
                filter: 'select',
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Designation",
                accessor: "designation",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "activeStatus",
                filter: 'select',
                width: 200,
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            {
                Header: "View Details",
                accessor: "id",
                disableFilters: true,
                Cell: (allEmployeeList) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => toggleViewModal(allEmployeeList.row.original)}
                        >
                            View Details
                        </Button>
                    );
                },
            },
            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (allEmployee) => {
                    return (
                        <div className="d-flex gap-3">
                            <FaEdit
                                id="edittooltip"
                                size={18}
                                className="text-success cursor-pointer"
                                onClick={() => editEmployeeInformation(allEmployee.row.original)}
                            />
                            <UncontrolledTooltip placement="top" target="edittooltip">
                                Edit
                            </UncontrolledTooltip>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const toggleViewModal = (usr) => {
        // console.log("usr", usr)
        setUserInfo(usr);
        setEmDtlsModal(!emDtlsModal);
    };

    const editEmployeeInformation = (empInfo) => {
        // console.log("empInfo", empInfo)
        navigate(`/employee-information-edit/${empInfo.id}`, { state: empInfo })
    };

    const editInfo = () => {
        navigate(`/employee-information-edit/${userInfo.id}`, { state: userInfo })
    }

    const handleAttachment = (id) => {
        // console.log("attachment id", id)

        const popupWidth = 900; // Set your desired width
        const popupHeight = 500; // Set your desired height
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 4;
        const url = `${fileUploadURL}catId=3&id=${id}`;
        window.open(
            url,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`
        );
    };


    // console.log(userInfo)

    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs title="All Employee List" breadcrumbItem="Setup / All Employee List" />
            </Container>
            <React.Fragment>

                <div className="container-fluid">
                    {
                        !loading ?
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardBody>
                                            <TableContainer
                                                columns={columns}
                                                data={allEmployee.reverse()}
                                                isGlobalFilter={true}
                                                isAddUserList={true}
                                                customPageSize={100}
                                                className="custom-header-css"
                                                onClickBtn={handleAddNewEmployee}
                                                showbtn
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            :
                            <div className="w-100 d-flex justify-content-center">
                                <div className="spinner-grow text-success  text-center"
                                    style={{ width: '2.5rem', height: "2.5rem" }} role="status">
                                </div>
                            </div>
                    }
                </div>
            </React.Fragment>

            <Modal
                isOpen={emDtlsModal}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={toggleViewModal}
                size="xl"
            >
                <div className="modal-content">
                    <ModalHeader onClick={() => {
                        setEmDtlsModal(!emDtlsModal)
                    }}>Employee  Details</ModalHeader>

                    <ModalBody>
                        <Row>
                            <Col sm="12" md="6" lg="3">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">Employee Code</Label>
                                        <h6 className="control-label">{userInfo.empCode}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Employee Name</Label>
                                        <h6 className="control-label">{userInfo.empName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Employee Type</Label>
                                        <h6 className="control-label">{userInfo.employeeTypeName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Department</Label>
                                        <h6 className="control-label">{userInfo.deptName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Designation</Label>
                                        <h6 className="control-label">{userInfo.designation}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Grade</Label>
                                        <h6 className="control-label">{userInfo.grade}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Date of Birth</Label>
                                        <h6 className="control-label">{moment(userInfo.dateOfBirth).format("YYYY-MM-DD")}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Joining Date</Label>
                                        <h6 className="control-label">{moment(userInfo.dateOfJoining).format("YYYY-MM-DD")}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">NID</Label>
                                        <h6 className="control-label">{userInfo.nid}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">PF Interest</Label>
                                        <h6 className="control-label">{userInfo.pfInterest === 1 ? "Yes" : userInfo.pfInterest === 0 ? "No" : null}</h6>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col sm="12" md="6" lg="3">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">TIN</Label>
                                        <h6 className="control-label">{userInfo.tin}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Contract Number</Label>
                                        <h6 className="control-label">{userInfo.contactNo}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Blood Group</Label>
                                        <h6 className="control-label">{userInfo.bloodGroup}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Gender</Label>
                                        <h6 className="control-label">{userInfo.gender}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Spouse Name</Label>
                                        <h6 className="control-label">{userInfo.spouseName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">No of Children</Label>
                                        <h6 className="control-label">{userInfo.noOfChild}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Father Name</Label>
                                        <h6 className="control-label">{userInfo.fatherName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Mother Name</Label>
                                        <h6 className="control-label">{userInfo.motherName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Nationality</Label>
                                        <h6 className="control-label">{userInfo.nationality}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">PF Status</Label>
                                        <h6 className="control-label">{userInfo.pfStatus === 1 ? "Yes" : userInfo.pfStatus === 0 ? "No" : null}</h6>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col sm="12" md="6" lg="3">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">Religion</Label>
                                        <h6 className="control-label">{userInfo.religion}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Marital Status</Label>
                                        <h6 className="control-label">{userInfo.maritalStatus}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Employee Status</Label>
                                        <h6 className="control-label">{userInfo.activeStatus === 1 ? "Active" : "Inactive"}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Work Location</Label>
                                        <h6 className="control-label">{userInfo?.workingLocation}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Inactive Reason</Label>
                                        <h6 className="control-label">{userInfo.inactiveReason}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Date of Inactive</Label>
                                        <h6 className="control-label">{moment(userInfo.dateOfInactive).format("YYYY-MM-DD")}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent District</Label>
                                        <h6 className="control-label">{userInfo.perDistrict}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Thana</Label>
                                        <h6 className="control-label">{userInfo.perThana}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Post Office</Label>
                                        <h6 className="control-label">{userInfo.perPoffice}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Post Code</Label>
                                        <h6 className="control-label">{userInfo.perPostCode}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">PF ID, CPF/GPF</Label>
                                        <h6 className="control-label">{userInfo.pfID}</h6>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col sm="12" md="6" lg="3">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">Permanent Address</Label>
                                        <h6 className="control-label">{userInfo.perAddress}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Present District</Label>
                                        <h6 className="control-label">{userInfo.preDistrict}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Present Thana</Label>
                                        <h6 className="control-label">{userInfo.preThana}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Present Post Office</Label>
                                        <h6 className="control-label">{userInfo.prePoffice}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Present Post Code</Label>
                                        <h6 className="control-label">{userInfo.prePostCode}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Present Address</Label>
                                        <h6 className="control-label">{userInfo.preAddress}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Bank Name</Label>
                                        <h6 className="control-label">{userInfo.bankName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Branch Name</Label>
                                        <h6 className="control-label">{userInfo.branchName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Bank Account Number</Label>
                                        <h6 className="control-label">{userInfo.accountNumber}</h6>

                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                    </ModalBody>

                    {/* <ModalBody>
                        <Row>
                            <Col sm="12" md="6" lg="3" className="p-3">

                                <Label className="control-label fw-bolder">Employee Code</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Employee Name</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Employee Type</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Department</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Designation</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Grade</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Date of Birth</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Joining Date</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">NID</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">TIN</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Contract Number</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Blood Group</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Gender</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Spouse Name</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">No of Children</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Father Name</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Mother Name</Label>
                                <br />
                                <br />

                                <Label className="control-label fw-bolder">Nationality</Label>


                            </Col>

                            <Col sm="12" md="6" lg="3" className="p-3">


                                <Label className="control-label">{userInfo.empCode}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.empName}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.employeeTypeName}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.deptName}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.designation}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.grade}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{moment(userInfo.dateOfBirth).format("YYYY-MM-DD")}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{moment(userInfo.dateOfJoining).format("YYYY-MM-DD")}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.nid}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.tin}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.contactNo}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.bloodGroup}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.gender}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.spouseName}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.noOfChild}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.fatherName}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.motherName}</Label>
                                <br />
                                <br />

                                <Label className="control-label">{userInfo.nationality}</Label>

                            </Col>

                            <Col sm="12" md="6" lg="3">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">Religion</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Marital Status</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Employee Status</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Inactive Reason</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Date of Inactive</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent District</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Thana</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Post Office</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Post Code</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Permanent Address</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Present District</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Present Thana</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Present Post Office</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Present Post Code</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Present Address</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Bank Name</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Branch Name</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label fw-bolder">Bank Account Number</Label>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col sm="12" md="6" lg="3">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label">{userInfo.religion}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.maritalStatus}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.activeStatus === 1 ? "Active" : "Inactive"}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.inactiveReason}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{moment(userInfo.dateOfInactive).format("YYYY-MM-DD")}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.perDistrict}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.perThana}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.perPoffice}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.perPostCode}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.perAddress}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.preDistrict}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.preThana}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.prePoffice}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.prePostCode}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.preAddress}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.bankName}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.branchName}</Label>
                                        <br />
                                        <br />

                                        <Label className="control-label">{userInfo.accountNumber}</Label>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </ModalBody> */}

                    <ModalFooter>

                        <Button type="button" color="success" onClick={() => handleAttachment(userInfo.id)}>
                            Attachment
                        </Button>

                        <Button type="button" color="secondary" onClick={() => editInfo(userInfo.id)}>
                            Edit
                        </Button>

                        <Button type="button" color="danger" onClick={() => {
                            setEmDtlsModal(!emDtlsModal)
                        }}>
                            Close
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>

        </div>
    )
}

export default AllEmployeeList