import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Table } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { IoMdArrowRoundBack } from 'react-icons/io';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Post } from '../../../../utils/https';
import CustomSpinner from '../../../../components/Common/CustomSpinner';
import DeleteModal from '../../DeleteModal/DeleteModal';
import { fetchPFDetailsByIdRequest } from '../../../../store/pf-details-by-id/actions';

const toastOptions = {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
};

const EmployeeLoanOpeningInterestDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    // console.log("state", state.id)
    const dispatch = useDispatch();
    const userID = JSON.parse(localStorage.getItem('userID'));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (state?.id) {
            dispatch(fetchPFDetailsByIdRequest(state.id));
        }
    }, [dispatch, state]);

    const { loading, pfDetailsById, error } = useSelector(state => state.pfDetailsByIdReducer);

    // console.log("pfDetailsById", pfDetailsById)

    useEffect(() => {
        setIsLoading(loading);
        setIsError(!!error);
    }, [loading, error]);

    const handlePostAllowance = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 3,          // typeID = 3 for Employee Loan Opening/Interest
                userCode: userID
            }
        };
        // console.log("data", data)
        try {
            const res = await Post('/api/v1/Payroll/PostPfData', data);
            if (res.data.success) {
                toast.success('Allowance Posted Successfully', toastOptions);
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.error(res.data.errorMessage, toastOptions);
            }
        } catch (error) {
            console.error('Allowance Post Error', error);
        }
    }, [state?.id, userID, navigate]);


    const handleEditAllowance = () => {
        navigate('/employeeLoan-edit', { state: state });
    };

    const handleShowModal = () => { setIsDeleteModalOpen(true); };
    const handleCloseModal = () => { setIsDeleteModalOpen(false) };

    const handleRemoveAllowance = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 3,         // typeID = 3 for Employee Loan Opening/Interest
                userCode: userID
            }
        };

        try {
            const res = await Post('/api/v1/Payroll/RemovePfData', data);
            if (res.data.success) {
                toast.success('Allowance Un-Posted Successfully', toastOptions);
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.error(res.data.errorMessage, toastOptions);
            }
        } catch (error) {
            console.error('Allowance Remove Error', error);
        }
    }, [state?.id, userID, navigate]);

    const handleCreateVoucher = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 3,          // typeID = 3 for Employee Loan Opening/Interest
                userCode: userID
            }
        };

        try {
            const res = await Post('/api/v1/Payroll/PfVoucherCreate', data);
            if (res.data.success) {
                toast.success('Allowance Voucher Created Successfully', toastOptions);
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.error(res.data.errorMessage, toastOptions);
            }
        } catch (error) {
            console.error('Allowance Post Error', error);
        }
    }, [state?.id, userID, navigate]);

    const columnCount = pfDetailsById.filter(item =>
        item.cPfLoan ||
        item.gPfLoan ||
        item.houseBuildingLoans ||
        item.computerLoans ||
        item.motorCycleLoans ||
        item.welfareLoans ||
        item.advanceAgainstFacilities ||
        item.advanceAgainstPurchase ||
        item.advanceAgainstSalary ||
        item.advanceAgainstTADA ||
        item.advanceAgainstTax ||
        item.advanceAgainstExpenses ||
        item.advanceAgainstBonus > 0).length;

    const totalCPfLoan = pfDetailsById.filter(item => item.cPfLoan).reduce((acc, cur) => acc + cur.cPfLoan, 0);

    const totalGPfLoan = pfDetailsById.filter(item => item.gPfLoan).reduce((acc, cur) => acc + cur.gPfLoan, 0);

    const totalHouseBuildingLoan = pfDetailsById.filter(item => item.houseBuildingLoans).reduce((acc, cur) => acc + cur.houseBuildingLoans, 0);

    const totalComputerLoan = pfDetailsById.filter(item => item.computerLoans).reduce((acc, cur) => acc + cur.computerLoans, 0);

    const totalMotorCycleLoan = pfDetailsById.filter(item => item.motorCycleLoans).reduce((acc, cur) => acc + cur.motorCycleLoans, 0);

    const totalWelfareLoan = pfDetailsById.filter(item => item.welfareLoans).reduce((acc, cur) => acc + cur.welfareLoans, 0);

    const totalAdvanceAgainstFacilities = pfDetailsById.filter(item => item.advanceAgainstFacilities).reduce((acc, cur) => acc + cur.advanceAgainstFacilities, 0);

    const totalAdvanceAgainstPurchase = pfDetailsById.filter(item => item.advanceAgainstPurchase).reduce((acc, cur) => acc + cur.advanceAgainstPurchase, 0);

    const totalAdvanceAgainstSalary = pfDetailsById.filter(item => item.advanceAgainstSalary).reduce((acc, cur) => acc + cur.advanceAgainstSalary, 0);

    const totalAdvanceAgainstTADA = pfDetailsById.filter(item => item.advanceAgainstTADA).reduce((acc, cur) => acc + cur.advanceAgainstTADA, 0);

    const totalAdvanceAgainstTax = pfDetailsById.filter(item => item.advanceAgainstTax).reduce((acc, cur) => acc + cur.advanceAgainstTax, 0);

    const totalAdvanceAgainstExpenses = pfDetailsById.filter(item => item.advanceAgainstExpenses).reduce((acc, cur) => acc + cur.advanceAgainstExpenses, 0);

    const totalAdvanceAgainstBonus = pfDetailsById.filter(item => item.advanceAgainstBonus).reduce((acc, cur) => acc + cur.advanceAgainstBonus, 0);

    const exportToExcelDataOnly = () => {
        const data = { data: state?.id };
        try {
            Post(`/api/v1/Payroll/GetPfTransactionTable`, data)
                .then(res => {
                    // console.log(res.data)
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                        // console.log(downloadLink)
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Employee Loan Opening/Interest Details" />
                <Button
                    type="button"
                    color="success"
                    className="btn-rounded px-3"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={20} color="white" />
                </Button>

                <Card className="mt-2">
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">Employee Loan Opening/Interest Details Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                {isLoading ? (
                    <div className="text-center">
                        <CustomSpinner />
                    </div>
                ) : isError ? (
                    <Card>
                        <CardBody>
                            <h1 className="text-center text-danger">Error: {error}</h1>
                        </CardBody>
                    </Card>
                ) : pfDetailsById.length > 0 ? (
                    <>

                        <Card className="mt-3">
                            <CardBody>
                                <Row>
                                    <Col md={4}>
                                        <Label size="lg" for="date">Allowance Date</Label>
                                        <Col md={10}>
                                            <InputGroup size="lg">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Allowance Date"
                                                    name="allowanceDate"
                                                    id="allowanceDate"
                                                    value={moment(pfDetailsById[0].transactionDate).format("DD/MM/YYYY")}
                                                    disabled
                                                />
                                            </InputGroup>
                                            <Label size="lg" for="allowanceTitle">Allowance Title *</Label>
                                            <InputGroup size="lg">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Allowance Title"
                                                    name="allowanceTitle"
                                                    id="allowanceTitle"
                                                    value={pfDetailsById[0].transactionTitle}
                                                    disabled
                                                />
                                            </InputGroup>

                                            <Label size="lg" for="allowanceTitle">Transaction Type</Label>
                                            <InputGroup size="lg">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Allowance Title"
                                                    name="allowanceTitle"
                                                    id="allowanceTitle"
                                                    value={pfDetailsById[0].transactionType === 1 ? "Interest" : 2 ? "Opening" : 3 ? "Transaction" : null}
                                                    disabled
                                                />
                                            </InputGroup>

                                            <h3 className="text-uppercase mt-4">
                                                Allowance Status:
                                                {" "}
                                                {
                                                    pfDetailsById[0].transactionStatus === 1 ?
                                                        <span className="text-primary fw-bolder">Save</span>
                                                        :
                                                        <span className='text-success fw-bolder'>Post</span>
                                                }
                                            </h3>

                                            {
                                                pfDetailsById.length > 0 &&
                                                pfDetailsById[0].transactionStatus === 2 &&
                                                // pfDetailsById[0].voucherID === null &&
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded mt-2 me-2 px-4"
                                                    onClick={handleCreateVoucher}
                                                >
                                                    Create Voucher
                                                </Button>
                                            }

                                            {
                                                pfDetailsById.length > 0 &&
                                                pfDetailsById[0].transactionStatus === 1 &&
                                                <div className='d-flex flex-wrap justify-content-start'>
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            color="success"
                                                            className="btn-rounded mt-2 me-2 px-4"
                                                            onClick={handlePostAllowance}
                                                        >
                                                            Post
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            color="primary"
                                                            className="btn-rounded mt-2 me-2 px-4"
                                                            onClick={handleEditAllowance}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            color="danger"
                                                            className="btn-rounded mt-2 me-2 px-4"
                                                            onClick={handleShowModal}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            }
                                        </Col>
                                    </Col>
                                    <Col md={4}>
                                        <Table bordered>
                                            <tbody>
                                                <tr>
                                                    <td>Total Employee</td>
                                                    <td className="text-black text-end">{pfDetailsById.length}</td>
                                                </tr>
                                                <tr>
                                                    <td>Entry Count</td>
                                                    <td className='text-black text-end'>{columnCount}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <div style={{ overflowX: 'auto', height: '80vh' }} className="transaction-scrollbar">
                                    <Table className="table table-striped table-bordered table-sm" width="100%">
                                        <thead className="table-light " style={{ position: 'sticky', top: -1, zIndex: 1, background: 'black' }}>
                                            <tr>
                                                <th className="col-1">SL</th>
                                                <th className="col-1">EMP ID</th>
                                                <th className="col-1">PF ID</th>
                                                <th className="col-1">Code</th>
                                                <th className="col-1">Name</th>
                                                <th className="col-1">Designation</th>
                                                <th className="col-1">Department</th>
                                                <th className="col-1">House Building Loans</th>
                                                <th className="col-1">Computer Loans</th>
                                                <th className="col-1">Motor Cycle and Bi-Cycle Loans</th>
                                                <th className="col-1">GPF Loans</th>
                                                <th className="col-1">CPF Loans</th>
                                                <th className="col-1">Welfare Loans</th>
                                                <th className="col-1">Advance Against Facilities</th>
                                                <th className="col-1">Advance Against Purchase</th>
                                                <th className="col-1">Advance Against Salary</th>
                                                <th className="col-1">Advance Against TA/DA</th>
                                                <th className="col-1">Advance Against Income TAX</th>
                                                <th className="col-1">Advance Against Expenses</th>
                                                <th className="col-1">Advance Against Bonus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pfDetailsById.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.empID}</td>
                                                    <td>{item.pfID}</td>
                                                    <td>{item.empCode}</td>
                                                    <td>{item.empName}</td>
                                                    <td>{item.designation}</td>
                                                    <td>{item.deptName}</td>
                                                    <td className="text-end">{item.houseBuildingLoans}</td>
                                                    <td className="text-end">{item.computerLoans}</td>
                                                    <td className="text-end">{item.motorCycleLoans}</td>
                                                    <td className="text-end">{item.gPfLoan}</td>
                                                    <td className="text-end">{item.cPfLoan}</td>
                                                    <td className="text-end">{item.welfareLoans}</td>
                                                    <td className="text-end">{item.advanceAgainstFacilities}</td>
                                                    <td className="text-end">{item.advanceAgainstPurchase}</td>
                                                    <td className="text-end">{item.advanceAgainstSalary}</td>
                                                    <td className="text-end">{item.advanceAgainstTADA}</td>
                                                    <td className="text-end">{item.advanceAgainstTax}</td>
                                                    <td className="text-end">{item.advanceAgainstExpenses}</td>
                                                    <td className="text-end">{item.advanceAgainstBonus}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className='fw-bold'>
                                                <td colSpan="7">Total</td>
                                                <td className="text-end">{totalHouseBuildingLoan}</td>
                                                <td className="text-end">{totalComputerLoan}</td>
                                                <td className="text-end">{totalMotorCycleLoan}</td>
                                                <td className="text-end">{totalGPfLoan}</td>
                                                <td className="text-end">{totalCPfLoan}</td>
                                                <td className="text-end">{totalWelfareLoan}</td>
                                                <td className="text-end">{totalAdvanceAgainstFacilities}</td>
                                                <td className="text-end">{totalAdvanceAgainstPurchase}</td>
                                                <td className="text-end">{totalAdvanceAgainstSalary}</td>
                                                <td className="text-end">{totalAdvanceAgainstTADA}</td>
                                                <td className="text-end">{totalAdvanceAgainstTax}</td>
                                                <td className="text-end">{totalAdvanceAgainstExpenses}</td>
                                                <td className="text-end">{totalAdvanceAgainstBonus}</td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </div>

                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 mb-2 me-2 px-4"
                                            onClick={exportToExcelDataOnly}
                                        >
                                            Export to Excel (Data Only)
                                        </Button>
                                    </div>
                                </div>

                            </CardBody>
                        </Card>
                    </>
                ) : (
                    <Card>
                        <CardBody>
                            <h1 className="text-center text-danger">No Data Found</h1>
                        </CardBody>
                    </Card>
                )}

                <DeleteModal
                    isDeleteModalOpen={isDeleteModalOpen}
                    handleCloseModal={handleCloseModal}
                    handleRemoveAllowance={handleRemoveAllowance}
                />

                <ToastContainer />
            </Container>
        </div>
    );
};

export default EmployeeLoanOpeningInterestDetails;
