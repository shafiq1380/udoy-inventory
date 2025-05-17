import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Table } from 'reactstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Flatpickr from "react-flatpickr";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Post } from '../../../../utils/https';
import CustomSpinner from '../../../../components/Common/CustomSpinner';
import { getPFDataInsertByTypeRequest } from '../../../../store/pf-data-insert-by-types/actions';
import Select from 'react-select'

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

const EmployeeLoanOpeningInterestCreate = () => {
    const navigate = useNavigate();
    const userID = JSON.parse(localStorage.getItem('userID'));
    const dispatch = useDispatch();
    const { loading, pfDataInsertByType, error } = useSelector(state => state.pfDataInsertByTypeReducer);
    const [allowanceData, setAllowanceData] = useState([]);
    const [allowanceTitle, setAllowanceTitle] = useState('');
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);
    const [transType, setTransType] = useState(null);

    useEffect(() => {
        if (pfDataInsertByType) {
            const data = pfDataInsertByType.map((item) => ({
                ...item,
                gPfLoan: null,
                cPfLoan: null,
                houseBuildingLoans: null,
                computerLoans: null,
                motorCycleLoans: null,
                welfareLoans: null,
                advanceAgainstFacilities: null,
                advanceAgainstPurchase: null,
                advanceAgainstSalary: null,
                advanceAgainstTADA: null,
                advanceAgainstTax: null,
                advanceAgainstExpenses: null,
                advanceAgainstBonus: null
            }));
            setAllowanceData(data);
        }
    }, [loading, pfDataInsertByType, error]);

    useEffect(() => {
        dispatch(getPFDataInsertByTypeRequest(3));
    }, [dispatch]);

    const handleFromDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates.length > 0 ? selectedDates[0] : new Date();
        const year = selectedDate.getFullYear();
        const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
        const day = ('0' + selectedDate.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        setPayrollDate(formattedDate);
    }, []);

    const columnCount = allowanceData.filter(item =>
        item.gPfLoan ||
        item.cPfLoan ||
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

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...allowanceData];

        // Negative value can not provide and zero can not be provided
        if (Number(value) < 0) {
            toast.error("Values cannot be negative.", toastOptions);
            list[index][name] = '';
        } else {
            list[index][name] = value;
        }

        setAllowanceData(list);
    };


    const handleTransType = (selectedOption) => {
        setTransType(selectedOption.value);
    };

    const handleCreateAllowance = () => {

        const filteredData = allowanceData.filter(item =>
            item.gPfLoan ||
            item.cPfLoan ||
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
            item.advanceAgainstBonus > 0
        );

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
                transactionID: 0,
                pfType: 3,
                transactionType: transType,
                transactionDate: payrollDate,
                title: allowanceTitle,
                userCode: userID,
                detailData: filteredData.map((item) => ({
                    hdrID: 0,
                    empID: item.id,
                    gPfDeduction: 0,
                    cPfOwn: 0,
                    cPfCompany: 0,
                    gPfLoan: +item.gPfLoan,
                    cPfLoan: +item.cPfLoan,
                    houseBuildingLoans: +item.houseBuildingLoans,
                    computerLoans: +item.computerLoans,
                    motorCycleLoans: +item.motorCycleLoans,
                    welfareLoans: +item.welfareLoans,
                    advanceAgainstFacilities: +item.advanceAgainstFacilities,
                    advanceAgainstPurchase: +item.advanceAgainstPurchase,
                    advanceAgainstSalary: +item.advanceAgainstSalary,
                    advanceAgainstTADA: +item.advanceAgainstTADA,
                    advanceAgainstTax: +item.advanceAgainstTax,
                    advanceAgainstExpenses: +item.advanceAgainstExpenses,
                    advanceAgainstBonus: +item.advanceAgainstBonus
                }))
            }
        };

        // console.log("data --------->>>>>>>", data)

        try {
            Post('/api/v1/Payroll/PfDataInsert', data)
                .then((res) => {
                    if (res.data.success) {
                        toast.success("Allowance created successfully.", toastOptions);
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

    const createCPF = allowanceData && allowanceData.length > 0 ? false : true;

    const handleKeyDown = (e, index, fieldName) => {
        const key = e.key;
        const row = e.target.closest('tr');
        const inputs = Array.from(row.querySelectorAll('input'));

        const currentIndex = inputs.findIndex(input => input === e.target);
        if (key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < inputs.length) {
                inputs[nextIndex].focus();
            }
        } else if (key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                inputs[prevIndex].focus();
            }
        }
    };

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Employee Loan Opening/Interest Create" />
                <Button
                    type="button"
                    color="success"
                    className="btn-rounded px-3"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={20} color='white' />
                </Button>

                <Card className='mt-2'>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">Employee Loan Opening/Interest Create SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card>
                {
                    createCPF ? <div className="text-center"><CustomSpinner /></div>
                        :
                        <>
                            <Card className='mt-3'>
                                <CardBody>
                                    <Row>
                                        <Col md={3}>
                                            <Label size='lg' for='date'>Transaction Date</Label>
                                            <Col md={10}>
                                                <InputGroup size='lg'>
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
                                                <Label size='lg' for="allowanceTitle">Transaction Title *</Label>
                                                <InputGroup size='lg'>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Allowance Title"
                                                        name="allowanceTitle"
                                                        id="allowanceTitle"
                                                        onChange={(e) => setAllowanceTitle(e.target.value)}
                                                        value={allowanceTitle}
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
                                                        onClick={handleCreateAllowance}
                                                        disabled={!transType || !payrollDate || !allowanceTitle || columnCount === 0}
                                                    >
                                                        Create Allowance
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Col>
                                        <Col md={3}>
                                            <Table bordered>
                                                <tbody>
                                                    <tr>
                                                        <td>Total Employee</td>
                                                        <td className='text-black text-end'>{allowanceData && allowanceData.length}</td>
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
                                                {
                                                    allowanceData && allowanceData.map((item, index) => {

                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.id}</td>
                                                                <td>{item.pfID}</td>
                                                                <td>{item.empCode}</td>
                                                                <td>{item.empName}</td>
                                                                <td>{item.deptName}</td>
                                                                <td>{item.designation}</td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="houseBuildingLoans"
                                                                        id="houseBuildingLoans"
                                                                        value={item.houseBuildingLoans}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'houseBuildingLoans')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="computerLoans"
                                                                        id="computerLoans"
                                                                        value={item.computerLoans}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'computerLoans')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="motorCycleLoans"
                                                                        id="motorCycleLoans"
                                                                        value={item.motorCycleLoans}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'motorCycleLoans')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="gPfLoan"
                                                                        id="gPfLoan"
                                                                        value={item.gPfLoan}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'gPfLoan')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="cPfLoan"
                                                                        id="cPfLoan"
                                                                        value={item.cPfLoan}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'cPfLoan')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="welfareLoans"
                                                                        id="welfareLoans"
                                                                        value={item.welfareLoans}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'welfareLoans')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstFacilities"
                                                                        id="advanceAgainstFacilities"
                                                                        value={item.advanceAgainstFacilities}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstFacilities')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstPurchase"
                                                                        id="advanceAgainstPurchase"
                                                                        value={item.advanceAgainstPurchase}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstPurchase')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstSalary"
                                                                        id="advanceAgainstSalary"
                                                                        value={item.advanceAgainstSalary}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstSalary')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstTADA"
                                                                        id="advanceAgainstTADA"
                                                                        value={item.advanceAgainstTADA}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstTADA')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstTax"
                                                                        id="advanceAgainstTax"
                                                                        value={item.advanceAgainstTax}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstTax')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstExpenses"
                                                                        id="advanceAgainstExpenses"
                                                                        value={item.advanceAgainstExpenses}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstExpenses')}
                                                                    />
                                                                </td>
                                                                <td className="text-end">
                                                                    <Input
                                                                        type="number"
                                                                        name="advanceAgainstBonus"
                                                                        id="advanceAgainstBonus"
                                                                        value={item.advanceAgainstBonus}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onWheel={(e) => e.target.blur()}
                                                                        className="form-control text-end"
                                                                        style={{ width: '100px' }}
                                                                        tabIndex={index * 100 + 1}
                                                                        onKeyDown={(e) => handleKeyDown(e, index, 'advanceAgainstBonus')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                            </tbody>
                                            <tfoot>
                                                <tr className='fw-bold'>
                                                    {/* <td colSpan="7" className="text-end">Total</td>
                                                <td className="text-end">{totalCPFOwn}</td>
                                                <td className="text-end">{totalCPFCompany}</td>
                                                <td className="text-end">{totalCPFLoan}</td> */}
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

export default EmployeeLoanOpeningInterestCreate;
