import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ButtonDropdown, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { fetchAllowanceDetailsByIdRequest } from '../../../../store/allowance-details-by-id/actions';
import { IoMdArrowRoundBack } from 'react-icons/io';
import moment from 'moment';
import { getAllAllowanceReportTypeDownload } from '../../GetAllAllowanceReport/GetAllAllowanceReport';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Post, REPORT_URL } from '../../../../utils/https';
import axios from 'axios';
import CustomSpinner from '../../../../components/Common/CustomSpinner';
import DeleteModal from '../../DeleteModal/DeleteModal';

const toastOptions = {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
};

const DetailsFestivalBonus = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    // console.log("state", state.id)
    const dispatch = useDispatch();
    const [btnDropdown, setBtnDropdown] = useState(false);
    const userID = JSON.parse(localStorage.getItem('userID'));
    const [pdfLink, setPdfLink] = useState()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);


    useEffect(() => {
        if (state?.id) {
            dispatch(fetchAllowanceDetailsByIdRequest(state.id));
        }
    }, [dispatch, state]);

    const { loading, allowanceDetailsById, error } = useSelector(state => state.allowanceDetailsByIdReducer);

    useEffect(() => {
        setIsLoading(loading);
        setIsError(!!error);
    }, [loading, error]);

    const totalAddition = useMemo(
        () => allowanceDetailsById.reduce((a, b) => a + b.totAdition, 0).toFixed(2),
        [allowanceDetailsById]
    );
    const totalDeduction = useMemo(
        () => allowanceDetailsById.reduce((a, b) => a + b.revStamp, 0).toFixed(2),
        [allowanceDetailsById]
    );
    const totalPayable = useMemo(
        () => allowanceDetailsById.reduce((a, b) => a + b.netPayable, 0).toFixed(2),
        [allowanceDetailsById]
    );

    const totalHour = useMemo(
        () => allowanceDetailsById && allowanceDetailsById.reduce((a, b) => a + b.otHour, 0).toFixed(2),
        [allowanceDetailsById]
    );

    const handlePostAllowance = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 2,          // typeID = 2 for Festival Bonus
                userCode: userID
            }
        };

        // console.log("data", data)

        try {
            const res = await Post('/api/v1/Payroll/PostAllowanceData', data);
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

    const handleShowModal = () => { setIsDeleteModalOpen(true); };
    const handleCloseModal = () => { setIsDeleteModalOpen(false) };


    const handleRemoveAllowance = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 2,          // typeID = 2 for Festival Bonus
                userCode: userID
            }
        };

        try {
            const res = await Post('/api/v1/Payroll/RemoveAllowanceData', data);
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

    const handleDownloadReport = useCallback((type) => {
        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const auth = JSON.parse(localStorage.getItem('authKey'));
        getAllAllowanceReportTypeDownload(auth, cCode, type, state.id);
    }, [state.id]);


    const handleShowReport = async () => {
        setReportLoading(true);
        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const auth = JSON.parse(localStorage.getItem('authKey'));
        const BASEURL = `${REPORT_URL}/api/PayrollReport/GetAllowanceReport?cCode=${cCode}&auth=${auth}&downloadtype=pdf&AllowID=${state.id}`;
        try {
            const response = await axios.get(`${BASEURL}`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfLink(url);
        } catch (error) {
            console.error('Error fetching PDF:', error);
        } finally {
            setReportLoading(false);
        }
    };

    const handleEditAllowance = () => {
        navigate('/edit-festival-bonus', { state: state });
    };


    const handleCreateVoucher = useCallback(async () => {
        const data = {
            data: {
                id: state?.id,
                typeID: 2,          // typeID = 2 for Festival Bonus
                userCode: userID
            }
        };

        try {
            const res = await Post('/api/v1/Payroll/AllowanceVoucherCreate', data);
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


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Festival Details" />
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
                            <h3 className="text-center text-uppercase">Festival Details Screen</h3>
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
                ) : allowanceDetailsById.length > 0 ? (
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
                                                    value={moment(allowanceDetailsById[0].allowDate).format("DD/MM/YYYY")}
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
                                                    value={allowanceDetailsById[0]?.allowTitle || ''}
                                                    disabled
                                                />
                                            </InputGroup>
                                            <h3 className="text-uppercase mt-4">
                                                Allowance Status:
                                                {" "}
                                                {
                                                    allowanceDetailsById[0].allowStatus === 1 ?
                                                        <span className="text-primary fw-bolder">Save</span>
                                                        :
                                                        <span className='text-success fw-bolder'>Post</span>
                                                }
                                            </h3>
                                            {
                                                allowanceDetailsById.length > 0 &&
                                                allowanceDetailsById[0].allowStatus === 2 &&
                                                allowanceDetailsById[0].voucherID === null &&
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
                                                allowanceDetailsById.length > 0 &&
                                                allowanceDetailsById[0].allowStatus === 1 &&
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
                                                    <td className="text-black text-end">{allowanceDetailsById.length}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Addition</td>
                                                    <td className="text-black text-end">{totalAddition}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Deduction</td>
                                                    <td className="text-black text-end">{totalDeduction}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Payable</td>
                                                    <td className="text-black text-end">{totalPayable}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <Table className="table table-striped table-bordered table-sm" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="col-0">SL</th>
                                            <th className="col-0">ID</th>
                                            <th className="col-0">Code</th>
                                            <th className="col-2">Name</th>
                                            <th className="col-2">Designation</th>
                                            <th className="col-2">Department</th>
                                            <th className="col-1 text-end">Basic</th>
                                            <th className="col-1 text-end">Rate</th>
                                            <th className="col-1 text-end">Hour</th>
                                            <th className="col-1 text-end">Amount</th>
                                            <th className="col-1 text-end">Rev Stamp</th>
                                            <th className="col-1 text-end">Payable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allowanceDetailsById.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.empID}</td>
                                                <td>{item.empCode}</td>
                                                <td>{item.empName}</td>
                                                <td>{item.deptName}</td>
                                                <td>{item.designation}</td>
                                                <td className="text-end">{item.basic}</td>
                                                <td className="text-end">{item.otRate}</td>
                                                <td className="text-end">{item.otHour}</td>
                                                <td className="text-end">{item.totAdition}</td>
                                                <td className="text-end">{item.revStamp}</td>
                                                <td className="text-end">{item.netPayable}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className='fw-bold'>
                                            <td colSpan="8" className="text-end">Total</td>
                                            <td className="text-end">{totalHour}</td>
                                            <td className="text-end">{totalAddition}</td>
                                            <td className="text-end">{totalDeduction}</td>
                                            <td className="text-end">{totalPayable}</td>
                                        </tr>
                                    </tfoot>
                                </Table>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 me-2 px-4"
                                            onClick={handleShowReport}
                                        >
                                            Show Report
                                        </Button>
                                    </div>
                                    <div>
                                        <ButtonDropdown
                                            toggle={() => setBtnDropdown(!btnDropdown)}
                                            isOpen={btnDropdown}
                                        >
                                            <DropdownToggle color="white border border-white">
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded px-4"
                                                >
                                                    Export Report
                                                </Button>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleDownloadReport('pdf')}>Export TO PDF</DropdownItem>
                                                <DropdownItem onClick={() => handleDownloadReport('doc')}>Export To Word</DropdownItem>
                                                <DropdownItem onClick={() => handleDownloadReport('xls')}>Export To Excel</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
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

                <Row style={{ height: '100vh', marginBottom: '20px' }}>
                    {reportLoading ? <CustomSpinner /> : pdfLink && <iframe src={pdfLink} width="100%" height="100%" frameBorder="0"></iframe>}
                </Row>

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

export default DetailsFestivalBonus;
