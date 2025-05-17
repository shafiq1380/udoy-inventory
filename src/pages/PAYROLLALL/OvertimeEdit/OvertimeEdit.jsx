import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Table } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { fetchAllowanceDetailsByIdRequest, fetchAllowanceDataForUpdateByIdRequest } from '../../../store/allowance-details-by-id/actions';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
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

const OvertimeEdit = () => {
    const userID = JSON.parse(localStorage.getItem('userID'));

    const navigate = useNavigate();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const [allowanceTitle, setAllowanceTitle] = useState('');
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);
    const [allowanceData, setAllowanceData] = useState([]);

    useEffect(() => {
        if (state && state.id) {
            dispatch(fetchAllowanceDetailsByIdRequest(state.id));
            dispatch(fetchAllowanceDataForUpdateByIdRequest(state.id));
        }
    }, [dispatch, state]);

    const { loading, allowanceDetailsById, allowanceDataUpdateById, error } = useSelector(state => state.allowanceDetailsByIdReducer);

    useEffect(() => {
        const data = allowanceDataUpdateById && allowanceDataUpdateById.map((item) => {
            const otRate = item.basic ? +(item.basic / 208 * 2).toFixed(2) : +(item.basicSal / 208 * 2).toFixed(2);
            const basic = item.basic !== null ? item.basic : item.basicSal;
            const basicSal = item.basicSal !== null ? item.basicSal : item.basic;
            return {
                ...item,
                basic,
                basicSal,
                otRate,
                totAdition: item.otHour ? Math.round(item.otHour * otRate) : 0,
                revStamp: item.revStamp,
                netPayable: item.otHour ? Math.round(item.otHour * otRate) - (item.revStamp || 10) : 0,
            }
        });

        setAllowanceData(data);

        if (data && data.length > 0) {
            setAllowanceTitle(allowanceDetailsById[0]?.allowTitle);
            setPayrollDate(allowanceDetailsById[0].allowDate);
        }
    }, [allowanceDetailsById, allowanceDataUpdateById, state]);

    const totalAddition = allowanceData && allowanceData.reduce((a, b) => a + b.totAdition, 0).toFixed(2) || 0;
    const totalDeduction = allowanceData && allowanceData.reduce((a, b) => a + b.revStamp, 0).toFixed(2) || 0;
    const totalPayable = allowanceData && allowanceData.reduce((a, b) => a + b.netPayable, 0).toFixed(2) || 0;
    const columnCount = allowanceData.filter(item => item.otHour > 0 && item.otHour !== null && item.otHour !== undefined && item.otHour !== '').length;
    const totalHour = useMemo(() => allowanceData && allowanceData.reduce((a, b) => a + b.otHour, 0).toFixed(2), [allowanceData])

    const handleFromDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates.length > 0 ? selectedDates[0] : new Date();
        const year = selectedDate.getFullYear();
        const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
        const day = ('0' + selectedDate.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        setPayrollDate(formattedDate);
    }, []);

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

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newData = [...allowanceData];
        const item = { ...newData[index] };

        const parseValue = (val) => val ? parseFloat(val) : null;

        const updateTotalAdditionAndNetPayable = (item) => {
            item.totAdition = parseInt(Math.round(item.otHour * item.otRate));
            item.netPayable = item.totAdition - (item.revStamp || 0);
        };

        switch (name) {
            case 'basic':
                item.basic = parseValue(value);
                item.otRate = +(item.basic / 208 * 2).toFixed(2);
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
                    item.totAdition = 0;
                    item.netPayable = 0;
                } else {
                    item.revStamp = item.revStamp || 10;
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
                item.netPayable = item.totAdition - revStampValue;
                break;

            default:
                return;
        }

        newData[index] = item;
        setAllowanceData(newData);
    };

    const handleUpdateAllowance = useCallback(() => {
        const filteredData = allowanceData.filter(item => item.otHour !== null && item.otHour !== undefined && item.otHour !== '');

        if (!allowanceTitle.trim()) {
            toast.error("Please enter allowance title.", toastOptions);
            return;
        }

        const data = {
            data: {
                allowanceTypeID: 1,
                allowanceID: state && state.id,
                allowanceDate: payrollDate,
                title: allowanceTitle.trim(),
                userCode: userID,
                detailData: filteredData.map((item) => ({
                    employeeID: item.empID,
                    basic: item.basic,
                    otRate: +item.otRate,
                    otHour: item.otHour || 0,
                    totalAddition: item.totAdition,
                    revStamp: item.revStamp,
                    netPayable: item.netPayable
                }))
            }
        };

        // console.log("Update Allowance Data", data);

        try {
            Post('/api/v1/Payroll/AllowanceDataUpdate', data)
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
                })
                .catch((error) => {
                    console.log("Update Allowance Error", error);
                    toast.error("Failed to update allowance. Please try again.", toastOptions);
                });
        } catch (error) {
            console.log("Update Allowance Error", error);
        }
    }, [allowanceTitle, payrollDate, userID, allowanceData, navigate, state]);

    const editOvertime = allowanceData && allowanceData.length > 0 ? false : true;

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Over Time Edit" />
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
                            <h3 className="text-center text-uppercase">Overtime Edit Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                {
                    editOvertime ? <div className="text-center"><CustomSpinner /></div>
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
                                                        <td className="text-black text-end">{allowanceDataUpdateById.length}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Entry Count</td>
                                                        <td className='text-black text-end'>{columnCount}</td>
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
                                                <th className="col-1 text-end">Basic</th>
                                                <th className="col-1 text-end">Rate</th>
                                                <th className="col-1 text-end">Hour</th>
                                                <th className="col-1 text-end">Amount</th>
                                                <th className="col-1 text-end">Rev Stamp</th>
                                                <th className="col-1 text-end">Payable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allowanceData && allowanceData.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.empID}</td>
                                                        <td>{item.empCode}</td>
                                                        <td>{item.empName}</td>
                                                        <td>{item.deptName}</td>
                                                        <td>{item.designation}</td>
                                                        <td className="text-end">{item.basicSal}</td>
                                                        <td className="text-end">
                                                            <Input
                                                                type="number"
                                                                className="form-control text-end"
                                                                name="basic"
                                                                placeholder="Basic"
                                                                id="basic"
                                                                value={item.basic}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td className="text-end">{item.otRate}</td>
                                                        <td className="text-end">
                                                            <input
                                                                type="number"
                                                                className="form-control text-end"
                                                                name="otHour"
                                                                id="otHour"
                                                                value={item.otHour}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                onWheel={(e) => e.target.blur()}
                                                                placeholder='Hour'
                                                            />
                                                        </td>
                                                        <td className="text-end">{item.totAdition}</td>
                                                        <td className="text-end">
                                                            <Input
                                                                type='number'
                                                                value={item.revStamp}
                                                                placeholder='Stamp'
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                onWheel={(e) => e.target.blur()}
                                                                className="form-control text-end"
                                                                name='revStamp'
                                                            />
                                                        </td>
                                                        <td className="text-end">{item.netPayable.toFixed(2)}</td>
                                                    </tr>
                                                )
                                            })}
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

export default OvertimeEdit;
