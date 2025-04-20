import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Table } from 'reactstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Flatpickr from "react-flatpickr";
import { useNavigate } from 'react-router-dom';
import { fetchAllowanceDataForInsertByTypeRequest } from '../../../../store/allowance-insert-by-types/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Post } from '../../../../utils/https';
import CustomSpinner from '../../../../components/Common/CustomSpinner';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const CreateRecreationLeaveAllowance = () => {
    const navigate = useNavigate();
    const userID = JSON.parse(localStorage.getItem('userID'));
    const dispatch = useDispatch();
    const { loading, allowanceDataForInsertByType, error } = useSelector(state => state.allowanceDataForInsertByTypeReducer);
    const [allowanceData, setAllowanceData] = useState([]);
    const [allowanceTitle, setAllowanceTitle] = useState('');
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        dispatch(fetchAllowanceDataForInsertByTypeRequest(4));
    }, [dispatch]);

    useEffect(() => {
        if (allowanceDataForInsertByType) {
            const data = allowanceDataForInsertByType.map((item) => ({
                ...item,
                basic: item.basicSal,
                revStamp: '',
                netPayable: item.basicSal > 0 ? item.basicSal - 10 : 0
            }));
            setAllowanceData(data);
        }
    }, [allowanceDataForInsertByType]);

    const handleFromDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates.length > 0 ? selectedDates[0] : new Date();
        const formattedDate = selectedDate.toISOString().split('T')[0];
        setPayrollDate(formattedDate);
    }, []);

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newData = [...allowanceData];
        const item = { ...newData[index] };

        const parseValue = (val) => val === "" ? "" : parseFloat(val);
        const roundToTwoDecimals = (num) => parseFloat(num.toFixed(2));

        if (name === 'basic') {
            item.basic = parseValue(value);

            if (item.basic < 0) {
                toast.error('Basic salary cannot be negative', toastOptions);
                return;
            }

            if (item.basic === 0 || item.basic === '') {
                item.revStamp = '';
                item.netPayable = 0;
            } else {
                item.revStamp = item.revStamp || 10;
                item.netPayable = item.basic > 0 ? roundToTwoDecimals(item.basic - (item.revStamp || 0)) : 0;
            }
        } else if (name === 'revStamp' && item.basic > 0) {
            const revStampValue = parseValue(value);

            if (revStampValue < 0) {
                toast.error('Rev. Stamp cannot be negative', toastOptions);
                return;
            }

            item.revStamp = revStampValue > 0 ? revStampValue : 0;
            item.netPayable = item.basic > 0 ? roundToTwoDecimals(item.basic - item.revStamp) : 0;
        }

        newData[index] = item;
        setAllowanceData(newData);
    };

    const totalNetPayable = useMemo(() => {
        return allowanceData.reduce((total, item) => total + (parseFloat(item.netPayable) || 0), 0).toFixed(2);
    }, [allowanceData]);

    const columnCount = useMemo(() => {
        return allowanceData.filter(item => parseFloat(item.revStamp) >= 0 || parseFloat(item.revStamp) === '').length;
    }, [allowanceData]);

    const totalDeduction = useMemo(() => {
        return allowanceData.reduce((total, item) => total + (parseFloat(item.revStamp) || 0), 0).toFixed(2);
    }, [allowanceData]);

    const handleCreateAllowance = useCallback(async () => {
        if (!allowanceTitle.trim()) {
            toast.error("Please enter allowance title.", toastOptions);
            return;
        };
        const filteredData = allowanceData.filter(item => item.revStamp !== "" && item.revStamp !== null);
        const data = {
            data: {
                allowanceTypeID: 4,
                allowanceID: 0,
                allowanceDate: payrollDate,
                title: allowanceTitle.trim(),
                userCode: userID,
                detailData: filteredData.map((item) => ({
                    employeeID: item.id,
                    basic: item.basicSal,
                    otRate: 0,
                    otHour: 0,
                    totalAddition: item.basic,
                    revStamp: item.revStamp,
                    netPayable: +item.netPayable.toFixed(2)
                }))
            }
        };

        try {
            const res = await Post('/api/Payroll/AllowanceDataInsert', data);
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
        } catch (error) {
            toast.error("Error creating allowance.", toastOptions);
            console.error("Create Allowance Error", error);
        }
    }, [allowanceData, allowanceTitle, payrollDate, userID, navigate]);

    const createRecreationAllowance = allowanceData && allowanceData.length > 0 ? false : true;

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Create Recreation Leave" />
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
                            <h3 className="text-center text-uppercase">Recreation Leave Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                {
                    createRecreationAllowance ? <div className="text-center"><CustomSpinner /></div>
                        :
                        <>
                            <Card className='mt-3'>
                                <CardBody>
                                    <Row>
                                        <Col md={3}>
                                            <Label size='lg' for='date'>Allowance Date</Label>
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
                                                        value={payrollDate}
                                                    />
                                                </InputGroup>
                                                <Label size='lg' for="allowanceTitle">Allowance Title *</Label>
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
                                                <div className="mt-2 mt-md-4 text-end">
                                                    <Button
                                                        type="button"
                                                        color="success"
                                                        className="btn-rounded mb-2 me-2"
                                                        onClick={handleCreateAllowance}
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
                                                        <td className='text-black text-end'>{allowanceData.length}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Entry Count</td>
                                                        <td className='text-black text-end'>{columnCount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Deduction</td>
                                                        <td className='text-black text-end'>{totalDeduction}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Payable</td>
                                                        <td className='text-black text-end'>{totalNetPayable}</td>
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
                                                <th className="col-1 text-end">Basic</th>
                                                <th className="col-1 text-end">Rev Stamp</th>
                                                <th className="col-1 text-end">Payable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {

                                                allowanceData && allowanceData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.empCode}</td>
                                                        <td>{item.empName}</td>
                                                        <td>{item.deptName}</td>
                                                        <td>{item.designation}</td>
                                                        <td className="text-end">{item.basicSal}</td>
                                                        <td className="text-end">
                                                            <Input
                                                                type='number'
                                                                value={item.basic}
                                                                placeholder='Basic'
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                className="form-control text-end"
                                                                name='basic'
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td className="text-end">
                                                            {item.basic > 0 && (
                                                                <Input
                                                                    type='number'
                                                                    value={item.revStamp}
                                                                    placeholder='Stamp'
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className="form-control text-end"
                                                                    name='revStamp'
                                                                    min={0}
                                                                    onWheel={(e) => e.target.blur()}
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="text-end">{item.revStamp > 0 ? item.netPayable.toFixed(2) : ''}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className='fw-bold'>
                                                <td colSpan="8" className="text-end">Total</td>
                                                <td className="text-end">{totalDeduction}</td>
                                                <td className="text-end">{totalNetPayable}</td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </CardBody>
                            </Card>
                        </>
                }

            </Container>
            <ToastContainer />
        </div>
    );
};

export default CreateRecreationLeaveAllowance;
