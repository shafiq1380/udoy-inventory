import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Table } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import { Post } from '../../../../utils/https';
import CustomSpinner from '../../../../components/Common/CustomSpinner';
import { fetchPFDetailsByIdRequest, pfDataForUpdateByIdRequest } from '../../../../store/pf-details-by-id/actions';
import Select from 'react-select'
import { authorization } from '../../../../components/Common/Authorization';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const transTypes = [
    { value: 1, label: "Interest" },
    { value: 2, label: "Opening" },
    { value: 3, label: "Transaction" }
];

const CPFEdit = () => {
    const userID = JSON.parse(localStorage.getItem('userID'));
    const navigate = useNavigate();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const [allowanceTitle, setAllowanceTitle] = useState('')
    const [transType, setTransType] = useState(null);
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);
    const [allowanceData, setAllowanceData] = useState([]);

    useEffect(() => {
        if (state && state.id) {
            dispatch(pfDataForUpdateByIdRequest(state.id));
            dispatch(fetchPFDetailsByIdRequest(state.id));
        }
    }, [dispatch, state]);

    const { pfDataUpdateLists, pfDetailsById } = useSelector(state => state.pfDetailsByIdReducer);

    // console.log("pfDataUpdateLists", pfDataUpdateLists)

    useEffect(() => {
        const data = pfDataUpdateLists.map((item) => ({
            ...item
        }));
        setAllowanceData(data);

        if (data && data.length > 0) {
            setAllowanceTitle(pfDetailsById[0]?.transactionTitle);
            setTransType(pfDetailsById[0]?.transactionType);
            setPayrollDate(pfDetailsById[0]?.transactionDate);
        };

    }, [pfDataUpdateLists, pfDetailsById, state]);


    const handleTransType = (selectedOption) => {
        setTransType(selectedOption.value);
    };

    const handleFromDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates.length > 0 ? selectedDates[0] : new Date();
        const year = selectedDate.getFullYear();
        const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
        const day = ('0' + selectedDate.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        setPayrollDate(formattedDate);
    }, []);

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...allowanceData];
        if (Number(value) < 0) {
            toast.error("Values cannot be negative.", toastOptions);
            list[index][name] = '';
        } else {
            list[index][name] = value;
        }
        setAllowanceData(list);
    };

    const handleUpdateAllowance = () => {

        const filteredData = allowanceData.filter(item => item.cPfOwn || item.cPfCompany || item.cPfLoan !== null);

        if (allowanceTitle.trim() === '') {
            toast.error("Please enter Allowance Title.", toastOptions);
            return;
        };

        if (!transType) {
            toast.error("Please select Transaction Type.", toastOptions);
            return;
        };
        if (filteredData.length === 0) {
            toast.error("Please enter GPF Deduction or GPF Loan", toastOptions);
            return;
        };

        const data = {
            data: {
                transactionID: state.id,
                pfType: 2,
                transactionType: transType,
                transactionDate: payrollDate,
                title: allowanceTitle,
                userCode: userID,
                detailData: filteredData.map((item) => ({
                    hdrID: 0,
                    empID: item.empID,
                    gPfDeduction: 0,
                    gPfLoan: 0,
                    cPfOwn: +item.cPfOwn,
                    cPfCompany: +item.cPfCompany,
                    cPfLoan: 0,
                    houseBuildingLoans: 0,
                    computerLoans: 0,
                    motorCycleLoans: 0,
                    welfareLoans: 0,
                    advanceAgainstFacilities: 0,
                    advanceAgainstPurchase: 0,
                    advanceAgainstSalary: 0,
                    advanceAgainstTADA: 0,
                    advanceAgainstTax: 0
                }))
            }
        };

        // console.log("data --------->>>>>>>", data)

        try {
            Post('/api/v1/Payroll/PfDataUpdate', data)
                .then((res) => {
                    if (res.data.success) {
                        toast.success("Allowance updated successfully.", toastOptions);
                        setTimeout(() => {
                            setAllowanceTitle('');
                            setAllowanceData([]);
                            navigate(-1);
                        }, 1000);
                    } else {
                        toast.error(res.data.errorMessage, toastOptions);
                    }
                });
        } catch (error) {
            console.error("Create Allowance Error", error);
        }
    };

    const editWPPFAllowance = allowanceData && allowanceData.length > 0 ? false : true;

    const columnCount = allowanceData.filter(item => item.cPfOwn || item.cPfCompany || item.cPfLoan > 0).length;
    const totalCPFOwn = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.cPfOwn || 0), 0), [allowanceData]);
    const totalCPFCompany = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.cPfCompany || 0), 0), [allowanceData]);
    // const totalCPFLoan = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.cPfLoan || 0), 0), [allowanceData]);


    useEffect(() => {
        authorization(108)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="CPF Allowance Edit" />
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
                            <h3 className="text-center text-uppercase">CPF Allowance Edit Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                {editWPPFAllowance ? <div className="text-center"><CustomSpinner /></div>
                    :
                    <>
                        <Card className="mt-3">
                            <CardBody>
                                <Row>
                                    <Col md={3}>
                                        <Label size="lg" for="date">Allowance Date</Label>
                                        <Col md={10}>
                                            <InputGroup size="lg">
                                                <Flatpickr
                                                    className="form-control"
                                                    placeholder="DD-MM-YYYY"
                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                        altInput: true,
                                                        altFormat: "d/m/Y",
                                                        allowInput: true
                                                    }}
                                                    id="date"
                                                    name="date"
                                                    onChange={handleFromDateChange}
                                                    onClose={handleFromDateChange}
                                                    value={payrollDate}
                                                />
                                            </InputGroup>
                                            <Label size="lg" for="allowanceTitle">Allowance Title *</Label>
                                            <InputGroup size="lg">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Allowance Title"
                                                    name="allowanceTitle"
                                                    id="allowanceTitle"
                                                    value={allowanceTitle}
                                                    onChange={(e) => setAllowanceTitle(e.target.value)}
                                                />
                                            </InputGroup>

                                            <Label size='lg' className="form-label" for="transactionType">
                                                Transaction Type *
                                            </Label>
                                            <Select
                                                id="transactionType"
                                                name="transactionType"
                                                options={transTypes}
                                                onChange={handleTransType}
                                                value={transTypes.find((item) => item.value === transType)}
                                            />


                                            <div className=" mt-2 mt-md-4 text-end">
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded  mb-2 me-2"
                                                    onClick={handleUpdateAllowance}
                                                >
                                                    Update Allowance
                                                </Button>
                                            </div>
                                        </Col>
                                    </Col>
                                    <Col md={3}>
                                        <Table bordered>
                                            <tbody>
                                                <tr>
                                                    <td>Total Employee</td>
                                                    <td className="text-black text-end">{pfDataUpdateLists.length}</td>
                                                </tr>
                                                <tr>
                                                    <td>Entry Count</td>
                                                    <td className='text-black text-end'>{columnCount}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total CPF Own</td>
                                                    <td className="text-black text-end">{totalCPFOwn}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total CPF Company</td>
                                                    <td className="text-black text-end">{totalCPFCompany}</td>
                                                </tr>
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
                                        <thead className="table-light" style={{ position: 'sticky', top: -1, zIndex: 1, background: 'black' }}>
                                            <tr>
                                                <th className="col-0">SL</th>
                                                <th className="col-0">EMP ID</th>
                                                <th className="col-0">PF ID</th>
                                                <th className="col-0">Code</th>
                                                <th className="col-2">Name</th>
                                                <th className="col-2">Designation</th>
                                                <th className="col-2">Department</th>
                                                <th className="col-2">C.P.F Own Contribution</th>
                                                <th className="col-2">C.P.F Company Contribution</th>
                                                {/* <th className="col-2">C.P.F Loan</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allowanceData && allowanceData.map((item, index) => {

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.empID}</td>
                                                        <td>{item.pfID}</td>
                                                        <td>{item.empCode}</td>
                                                        <td>{item.empName}</td>
                                                        <td>{item.deptName}</td>
                                                        <td>{item.designation}</td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                name="cPfOwn"
                                                                id="cPfOwn"
                                                                className="form-control text-end"
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                value={item.cPfOwn}
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                name="cPfCompany"
                                                                id="cPfCompany"
                                                                className="form-control text-end"
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                value={item.cPfCompany}
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        {/* <td>
                                                        <Input
                                                            type="number"
                                                            name="cPfLoan"
                                                            id="cPfLoan"
                                                            className="form-control text-end"
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            value={item.cPfLoan}
                                                            onWheel={(e) => e.target.blur()}
                                                        />
                                                    </td> */}
                                                    </tr>
                                                )
                                            })}
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
                            </CardBody>
                        </Card>
                    </>
                }
            </Container>
            <ToastContainer />
        </div>
    );
};

export default CPFEdit;
