import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Table, Spinner } from 'reactstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Flatpickr from "react-flatpickr";
import { useNavigate } from 'react-router-dom';
import { fetchAllowanceDataForInsertByTypeRequest } from '../../../store/allowance-insert-by-types/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Post } from '../../../utils/https';
import CustomSpinner from '../../../components/Common/CustomSpinner';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const CreateOT = () => {
    const navigate = useNavigate();
    const userID = JSON.parse(localStorage.getItem('userID'));
    const dispatch = useDispatch();
    const { loading, allowanceDataForInsertByType, error } = useSelector(state => state.allowanceDataForInsertByTypeReducer);
    const [allowanceData, setAllowanceData] = useState([]);

    useEffect(() => {
        if (allowanceDataForInsertByType) {
            const data = allowanceDataForInsertByType.map((item) => ({
                ...item,
                basic: item.basicSal,
                otRate: Number(((item.basicSal / 208) * 2).toFixed(2)),
                otHour: null,
                totalAddition: 0,
                revStamp: null,
                netPayable: 0
            }));
            setAllowanceData(data);
        }
    }, [allowanceDataForInsertByType, error]);

    useEffect(() => {
        dispatch(fetchAllowanceDataForInsertByTypeRequest(1));
    }, [dispatch]);

    const [allowanceTitle, setAllowanceTitle] = useState('');
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);

    const handleFromDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates.length > 0 ? selectedDates[0] : new Date();
        const year = selectedDate.getFullYear();
        const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
        const day = ('0' + selectedDate.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        setPayrollDate(formattedDate);
    }, []);

    const totalAddition = useMemo(() => allowanceData.reduce((a, b) => a + b.totalAddition, 0).toFixed(2), [allowanceData]);
    const totalDeduction = useMemo(() => allowanceData.reduce((a, b) => a + b.revStamp, 0).toFixed(2), [allowanceData]);
    const totalPayable = useMemo(() => allowanceData.reduce((a, b) => a + b.netPayable, 0).toFixed(2), [allowanceData]);
    const columnCount = allowanceData.filter(item => item.otHour > 0 && item.otHour !== null && item.otHour !== undefined && item.otHour !== '').length;
    const totalHour = useMemo(() => allowanceData.reduce((a, b) => a + b.otHour, 0).toFixed(2), [allowanceData]);

    const validateOtHour = (value) => {
        if (!value || value === 0) {
            return value;
        }

        const roundedValue = parseFloat(value.toFixed(2));
        if (roundedValue !== value) {
            const errorMessage = `You cannot set the "Hour" value as ${value}, please use only two decimal places`;
            toast.error(errorMessage, toastOptions);
            return roundedValue;
        }
        return value;
    };

    // const handleInputChange = (e, index) => {
    //     const { name, value } = e.target;
    //     const newData = [...allowanceData];
    //     const item = { ...newData[index] };

    //     const parseValue = (val) => val ? parseFloat(val) : null;
    //     const roundToTwoDecimals = (num) => parseFloat(num.toFixed(2));
    //     const OT_RATE_DIVISOR = 208;
    //     const OT_RATE_MULTIPLIER = 2;
    //     const DEFAULT_REV_STAMP = 10;

    //     const updateTotalAdditionAndNetPayable = (item) => {
    //         item.totalAddition = item.otHour ? roundToTwoDecimals(item.otHour * item.otRate) : 0;
    //         item.netPayable = item.totalAddition - (item.revStamp || 0);
    //     };

    //     switch (name) {
    //         case 'basic':
    //             item.basic = parseValue(value);
    //             item.otRate = roundToTwoDecimals((item.basic / OT_RATE_DIVISOR) * OT_RATE_MULTIPLIER);
    //             updateTotalAdditionAndNetPayable(item);
    //             break;

    //         case 'otHour':
    //             const otHourValue = parseValue(value);

    //             if (otHourValue < 0) {
    //                 toast.error("Cannot set value as Negative.", toastOptions);
    //                 return;
    //             }

    //             item.otHour = validateOtHour(otHourValue);

    //             if (!item.otHour || item.otHour === 0) {
    //                 item.revStamp = 0;
    //                 item.totalAddition = 0;
    //                 item.netPayable = 0;
    //             } else {
    //                 item.revStamp = item.revStamp || DEFAULT_REV_STAMP;
    //                 updateTotalAdditionAndNetPayable(item);
    //             }
    //             break;

    //         case 'revStamp':
    //             const revStampValue = parseValue(value);

    //             if (revStampValue < 0) {
    //                 toast.error("Cannot set negative value for Stamp.", toastOptions);
    //                 return;
    //             }

    //             item.revStamp = revStampValue;
    //             item.netPayable = roundToTwoDecimals(item.totalAddition - revStampValue);
    //             break;

    //         default:
    //             return; // handle unexpected name cases
    //     }

    //     newData[index] = item;
    //     setAllowanceData(newData);
    // };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newData = [...allowanceData];
        const item = { ...newData[index] };

        const parseValue = (val) => val ? parseFloat(val) : null;
        const roundToTwoDecimals = (num) => parseFloat(num.toFixed(2));
        const toInteger = (num) => Math.round(num); // Function to round up

        const OT_RATE_DIVISOR = 208;
        const OT_RATE_MULTIPLIER = 2;
        const DEFAULT_REV_STAMP = 10;

        const updateTotalAdditionAndNetPayable = (item) => {
            item.totalAddition = item.otHour ? parseInt(Math.round(item.otHour * item.otRate)) : 0;
            item.netPayable = item.totalAddition - (item.revStamp || 0);
        };

        switch (name) {
            case 'basic':
                item.basic = parseValue(value);
                item.otRate = roundToTwoDecimals((item.basic / OT_RATE_DIVISOR) * OT_RATE_MULTIPLIER);
                updateTotalAdditionAndNetPayable(item);
                break;

            case 'otHour':
                const otHourValue = parseValue(value);

                if (otHourValue < 0) {
                    toast.error("Cannot set value as Negative.", toastOptions);
                    return;
                }

                item.otHour = validateOtHour(otHourValue);

                if (!item.otHour || item.otHour === 0) {
                    item.revStamp = 0;
                    item.totalAddition = 0;
                    item.netPayable = 0;
                } else {
                    item.revStamp = item.revStamp || DEFAULT_REV_STAMP;
                    updateTotalAdditionAndNetPayable(item);
                }
                break;

            case 'revStamp':
                const revStampValue = parseValue(value);

                if (revStampValue < 0) {
                    toast.error("Cannot set negative value for Stamp.", toastOptions);
                    return;
                }

                item.revStamp = revStampValue;
                item.netPayable = toInteger(item.totalAddition - revStampValue);
                break;

            default:
                return; // handle unexpected name cases
        }

        newData[index] = item;
        setAllowanceData(newData);
    };


    const handleCreateAllowance = useCallback(() => {
        const filteredData = allowanceData.filter(item => item.otHour !== null && item.otHour !== undefined && item.otHour !== '');

        if (allowanceTitle.trim() === '') {
            toast.error("Please enter allowance title.", toastOptions);
            return;
        }

        const data = {
            data: {
                allowanceTypeID: 1,
                allowanceID: 0,
                allowanceDate: payrollDate,
                title: allowanceTitle.trim(),
                userCode: userID,
                detailData: filteredData.map((item) => ({
                    employeeID: item.id,
                    basic: item.basic,
                    otRate: +item.otRate,
                    otHour: item.otHour || 0,
                    totalAddition: +(item.totalAddition).toFixed(2),
                    revStamp: item.revStamp,
                    netPayable: +(item.netPayable).toFixed(2)
                }))
            }
        };

        // console.log("data --------->>>>>>>", data)

        try {
            Post('/api/v1/Payroll/AllowanceDataInsert', data)
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
    }, [allowanceData, allowanceTitle, payrollDate, userID, navigate]);

    const createOvertime = allowanceData && allowanceData.length > 0 ? false : true;


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Create Over Time" />
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
                            <h3 className="text-center text-uppercase">Overtime Allowance SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card>
                {
                    createOvertime ? <div className="text-center"><CustomSpinner /></div>
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
                                                        onClose={handleFromDateChange}
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

                                                <div className=" mt-2 mt-md-4 text-end">
                                                    <Button
                                                        type="button"
                                                        color="success"
                                                        className="btn-rounded  mb-2 me-2"
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
                                                        <td className='text-black text-end'>{allowanceData && allowanceData.length}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Entry Count</td>
                                                        <td className='text-black text-end'>{columnCount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Addition</td>
                                                        <td className='text-black text-end'>{totalAddition}</td>
                                                    </tr>
                                                    <tr >
                                                        <td>Total Deduction</td>
                                                        <td className='text-black text-end'>{totalDeduction}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Payable</td>
                                                        <td className='text-black text-end'>{totalPayable}</td>
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
                                                <th className="col-1 text-end">Rate</th>
                                                <th className="col-1 text-end">Hour</th>
                                                <th className="col-1 text-end">Amount</th>
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
                                                        <td className="text-end">{item.otRate}</td>
                                                        <td className="text-end">
                                                            <Input
                                                                type='number'
                                                                value={item.otHour}
                                                                placeholder='Hour'
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                className="form-control text-end"
                                                                name='otHour'
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td className="text-end">{(item.totalAddition).toFixed(2)}</td>
                                                        <td className="text-end">
                                                            <Input
                                                                type='number'
                                                                value={item.revStamp}
                                                                placeholder='Stamp'
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                className="form-control text-end"
                                                                name='revStamp'
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td className="text-end">{(item.netPayable).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr className='fw-bold'>
                                                <td colSpan="9" className="text-end">Total</td>
                                                <td className="text-end">{totalHour}</td>
                                                <td className="text-end">{totalAddition}</td>
                                                <td className="text-end">{totalDeduction}</td>
                                                <td className="text-end">{totalPayable}</td>
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

export default CreateOT;
