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
import { FaSpinner } from 'react-icons/fa';

const toastOptions = {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
};

const GPFDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    // console.log("state", state.id)
    const dispatch = useDispatch();
    const userID = JSON.parse(localStorage.getItem('userID'));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [trnLoading, setTranLoading] = useState(false)
    const [transTypes, setTransTypes] = useState([]);


    const transactionTypeList = async () => {
        const data = await Post('/api/v1/ProvidentFund/GetGPFTransactionTypeList', {})
            .then(res =>
                setTransTypes(res.data.data)
            );
    }
    useEffect(() => {
        if (state?.id) {
            dispatch(fetchPFDetailsByIdRequest(state.id));
        }
        transactionTypeList()
    }, [dispatch, state]);

    const { loading, pfDetailsById, error } = useSelector(state => state.pfDetailsByIdReducer);

    // console.log("pfDetailsById", pfDetailsById)

    useEffect(() => {
        setIsLoading(loading);
        setIsError(!!error);
    }, [loading, error]);

    const columnCount = pfDetailsById.filter(item => item.amount > 0).length;

    const totalAmount = useMemo(() => pfDetailsById.reduce((a, b) => a + b.amount, 0), [pfDetailsById]);

    // const totalGPFLoan = useMemo(() => pfDetailsById.reduce((a, b) => a + b.gPfLoan, 0).toFixed(2), [pfDetailsById]);


    const handlePostAllowance = useCallback(async () => {
        setTranLoading(true)
        const data = {
            data: {
                id: state?.id,
                typeID: 1,          // typeID = 1 for GPF Allowance
                userCode: userID
            }
        };
        // console.log("data", data)
        try {
            const res = await Post('/api/v1/ProvidentFund/PostGPFData', data);
            if (res.data.success) {
                toast.success('Allowance Posted Successfully', toastOptions);
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.error(res.data.errorMessage, toastOptions);
                setTranLoading(true)
            }
        } catch (error) {
            console.error('Allowance Post Error', error);
        }
    }, [state?.id, userID, navigate]);


    const handleEditAllowance = () => {
        navigate('/gpf-edit', { state: state });
    };

    const handleShowModal = () => { setIsDeleteModalOpen(true); };
    const handleCloseModal = () => { setIsDeleteModalOpen(false) };

    const handleRemoveAllowance = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 1,         // typeID = 1 for GPF Allowance
                userCode: userID
            }
        };

        try {
            const res = await Post('/api/v1/ProvidentFund/RemovePfData', data);
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
                typeID: 1,          // typeID = 1 for GPF Allowance
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


    const exportToExcelDataOnly = () => {
        const data = { data: state?.id };
        try {
            Post(`/api/v1/ProvidentFund/GetGPFTransactionTable`, data)
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
        authorization(107)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="GPF Transaction Details" />
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
                            <h3 className="text-center text-uppercase">GPF Transaction Details Screen</h3>
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
                                    <Col md={6}>
                                        <Row className="align-items-center">
                                            <Col md={4}>
                                                <Label size="lg" for="date">Transaction Date</Label>
                                            </Col>
                                            <Col md={6}>
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

                                            </Col>
                                        </Row>

                                        <Row className="align-items-center py-2">
                                            <Col md={4}>
                                                <Label size="lg" for="allowanceTitle">Transaction Title</Label>
                                            </Col>
                                            <Col md={6}>
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
                                            </Col>
                                        </Row>
                                        <Row className="align-items-center">
                                            <Col md={4}>
                                                <Label size="lg" for="allowanceTitle">Transaction Type</Label>
                                            </Col>
                                            <Col md={6}>
                                                <InputGroup size="lg">
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Allowance Title"
                                                        name="allowanceTitle"
                                                        id="allowanceTitle"
                                                        value={transTypes?.find((item) => item.id === pfDetailsById[0]?.transactioTypeID)?.transactionName}
                                                        disabled
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Col md={10}>
                                            <h3 className="text-uppercase mt-4 ">
                                                Transaction Status:
                                                {" "}
                                                {
                                                    pfDetailsById[0].transactionStatus === 1 ?
                                                        <span className="text-primary fw-bolder">Save</span>
                                                        :
                                                        <span className='text-success fw-bolder'>Post</span>
                                                }
                                            </h3>

                                            {/* {
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
                                            } */}

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
                                                            disabled={trnLoading}
                                                        >
                                                            {trnLoading ?
                                                                <div className='px-4'> <FaSpinner style={{ width: '1rem', height: '1rem' }} /> </div> : "Post"}
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            color="primary"
                                                            className="btn-rounded mt-2 me-2 px-4"
                                                            onClick={handleEditAllowance}
                                                            disabled={trnLoading}
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
                                                            disabled={trnLoading}
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
                                                    <td className="text-black text-end">{columnCount}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount</td>
                                                    <td className="text-black text-end">{totalAmount}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td>Total GPF Loan</td>
                                                    <td className="text-black text-end">{totalGPFLoan}</td>
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
                                                <th className="col-0">PF-ID</th>
                                                <th className="col-0">ID</th>
                                                <th className="col-0">Code</th>
                                                <th className="col-3">Name</th>
                                                <th className="col-2">Designation</th>
                                                <th className="col-2">Department</th>
                                                <th className="col-1">MR/PV No</th>
                                                <th className="col-1">Period Of Subscription</th>
                                                <th className="col-1 text-end">Amount</th>
                                                {/* <th className="col-1 text-end">GPF Loan</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pfDetailsById.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.pfID}</td>
                                                    <td>{item.empID}</td>
                                                    <td>{item.empCode}</td>
                                                    <td>{item.empName}</td>
                                                    <td>{item.deptName}</td>
                                                    <td>{item.designation}</td>
                                                    <td>{item?.remarks}</td>
                                                    <td>{item?.remarks2}</td>
                                                    <td className="text-end">{item?.amount}</td>
                                                    {/* <td className="text-end">{item.gPfLoan}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className='fw-bold'>
                                                <td colSpan="9" className="text-end">Total</td>
                                                <td className="text-end">{totalAmount}</td>
                                                {/* <td className="text-end">{totalGPFLoan}</td> */}
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
        </div >
    );
};

export default GPFDetails;
