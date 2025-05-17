import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { authorization } from '../../../../components/Common/Authorization';

const toastOptions = {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
};

const CPFDetails = () => {
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
                typeID: 2,          // typeID = 2 for CPF Allowance
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
        navigate('/cpf-edit', { state: state });
    };

    const handleShowModal = () => { setIsDeleteModalOpen(true); };
    const handleCloseModal = () => { setIsDeleteModalOpen(false) };

    const handleRemoveAllowance = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 2,         // typeID = 2 for CPF Allowance
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
                typeID: 2,          // typeID = 2 for CPF Allowance
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

    const columnCount = pfDetailsById.filter(item => item.cPfOwn || item.cPfCompany || item.cPfLoan > 0).length;
    const totalCPFOwn = useMemo(() => pfDetailsById.reduce((acc, item) => acc + (+item.cPfOwn || 0), 0), [pfDetailsById]);
    const totalCPFCompany = useMemo(() => pfDetailsById.reduce((acc, item) => acc + (+item.cPfCompany || 0), 0), [pfDetailsById]);
    // const totalCPFLoan = useMemo(() => pfDetailsById.reduce((acc, item) => acc + (+item.cPfLoan || 0), 0), [pfDetailsById]);


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

    useEffect(() => {
        authorization(108)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="CPF Allowance Details" />
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
                            <h3 className="text-center text-uppercase">CPF Allowance Details Screen</h3>
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
                                                {/* <tr>
                                                    <td>Total CPF Own</td>
                                                    <td className="text-black text-end">{totalCPFOwn}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total CPF Company</td>
                                                    <td className="text-black text-end">{totalCPFCompany}</td>
                                                </tr> */}
                                                {/* <tr>
                                                    <td>Total CPF Loan</td>
                                                    <td className="text-black text-end">{totalCPFLoan}</td>
                                                </tr> */}
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
                                                <th className="col-0">SL</th>
                                                <th className="col-0">EMP ID</th>
                                                <th className="col-0">PF ID</th>
                                                <th className="col-0">Code</th>
                                                <th className="col-2">Name</th>
                                                <th className="col-2">Designation</th>
                                                <th className="col-2">Department</th>
                                                <th className="col-2 text-end">C.P.F Own Contribution</th>
                                                <th className="col-2 text-end">C.P.F Company Contribution</th>
                                                {/* <th className="col-2 text-end">C.P.F Loan</th> */}
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
                                                    <td className="text-end">{item.cPfOwn}</td>
                                                    <td className="text-end">{item.cPfCompany}</td>
                                                    {/* <td className="text-end">{item.cPfLoan}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className='fw-bold'>
                                                <td colSpan="7" className="text-end">Total</td>
                                                <td className="text-end">{totalCPFOwn}</td>
                                                <td className="text-end">{totalCPFCompany}</td>
                                                {/* <td className="text-end">{totalCPFLoan}</td> */}
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

export default CPFDetails;
