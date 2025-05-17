import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Spinner, Table } from 'reactstrap';
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

const GPFEdit = () => {
    const userID = JSON.parse(localStorage.getItem('userID'));
    const navigate = useNavigate();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const [allowanceTitle, setAllowanceTitle] = useState('')
    const [transType, setTransType] = useState(null);
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);
    const [allowanceData, setAllowanceData] = useState([]);
    const [transTypes, setTransTypes] = useState([]);
    const [trnLoading, setTranLoading] = useState(false)

    //filter the designation data
    const [filteredData, setFilteredData] = useState(allowanceData);
    const [selectedDesignation, setSelectedDesignation] = useState('');

    const { pfDataUpdateLists, pfDetailsById } = useSelector(state => state.pfDetailsByIdReducer);

    const transactionTypeList = async () => {
        const data = await Post('/api/v1/ProvidentFund/GetGPFTransactionTypeList', {})
            .then(res =>
                setTransTypes(res.data.data.reverse())
            );
    }



    useEffect(() => {
        if (state && state.id) {
            dispatch(pfDataForUpdateByIdRequest(state.id));
            dispatch(fetchPFDetailsByIdRequest(state.id));
        }
        transactionTypeList()

    }, [dispatch, state]);


    useEffect(() => {
        const data = pfDataUpdateLists.map((item) => ({
            ...item
        }));
        setAllowanceData(data);
        setFilteredData(data)

        if (data && data.length > 0) {
            setAllowanceTitle(pfDetailsById[0]?.transactionTitle);
            setTransType(pfDetailsById[0]?.transactioTypeID);
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


    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        const allowanceList = [...allowanceData]

        const itemIndex = allowanceList.findIndex((item) => item.empID === id);

        // console.log(itemIndex, id)

        if (itemIndex !== -1) {
            if (Number(value) < 0) {
                toast.error("Values cannot be negative.", toastOptions);
                allowanceList[itemIndex][name] = '';
            } else {
                allowanceList[itemIndex][name] = value;
            }
        }
        setAllowanceData(allowanceList);
    };

    const handleChangeRemarks = (e, id) => {
        const { name, value } = e.target;
        const allowanceList = [...allowanceData]

        const itemIndex = allowanceList.findIndex((item) => item.empID === id);

        // if (itemIndex !== -1) {
        //     if (Number(value) < 0) {
        //         toast.error("Values cannot be negative.", toastOptions);
        //         allowanceList[itemIndex][name] = '';
        //     } else {
        //     }
        // }

        allowanceList[itemIndex][name] = value;
        setAllowanceData(allowanceList);
    };

    // console.log('filteredData', filteredData)

    const handleUpdateAllowance = () => {
        setTranLoading(true)
        const ufilteredData = allowanceData.filter(item => item.amount);

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
                transactionTypeID: transType,
                transactionDate: payrollDate,
                title: allowanceTitle,
                userCode: userID,
                detailData: ufilteredData.map((item) => ({
                    hdrID: item.hdrID || 0,
                    empID: item.empID,
                    amount: +item.amount,
                    remarks: item.remarks,
                    remarks2: item.remarks2
                }))
            }
        };
        // console.log("data --------->>>>>>>", data)
        try {
            Post('/api/v1/ProvidentFund/GPFDataUpdate', data)
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
                        setTranLoading(true)
                    }
                });
        } catch (error) {
            console.error("Create Allowance Error", error);
        }
    };

    const editWPPFAllowance = allowanceData && allowanceData.length > 0 ? false : true;

    const columnCount = allowanceData.filter((item) => item.amount).length;

    const totalAmount = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.amount || 0), 0), [allowanceData]);

    // filter the designation from the data
    const uniqueDesignations = [...new Set(allowanceData.map(item => item.designation))];
    const uniqueDepartment = [...new Set(allowanceData.map(item => item.deptName))];

    // const totalGPFLoan = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.gPfLoan || 0), 0), [allowanceData]);

    //filter with name and code 
    const handleSearchName = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = allowanceData.filter(item =>
            item.empName?.toLowerCase().includes(searchTerm)
        );
        setFilteredData(filteredData);
    };


    const handleSearchEmpCode = (e) => {
        const searchTerm = e.target.value?.toLowerCase();
        const filteredData = allowanceData.filter(item =>
            item.empCode?.toLowerCase().includes(searchTerm)
        );
        setFilteredData(filteredData);
    };


    const handleSearchPfid = (e) => {
        const searchTerm = e.target.value?.toLowerCase();
        const filteredData = allowanceData.filter(item =>
            item.pfID?.toLowerCase().includes(searchTerm)
        );
        setFilteredData(filteredData);
    };

    // Filter the data based on selected designation
    const handleDesignationChange = (event) => {
        const selectedValue = event.value;
        setSelectedDesignation(selectedValue);
        const filtered = selectedValue
            ? allowanceData.filter(item => item.designation === selectedValue) : allowanceData;
        setFilteredData(filtered);
    };

    const handleDepartmentChange = (event) => {
        const selectedValue = event.value;
        setSelectedDesignation(selectedValue);
        const filtered = selectedValue
            ? allowanceData.filter(item => item.deptName === selectedValue) : allowanceData;
        setFilteredData(filtered);
    };



    //custom styles for select box
    const customStyles = {
        control: (base) => ({
            ...base,
            fontWeight: '300',
            // height: '0px !important',
        }),

        option: (base, { isFocused, isSelected }) => ({
            ...base,
            fontWeight: '300',
        }),
    };

    useEffect(() => {
        authorization(107)
    }, [])



    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="GPF Transaction Edit" />
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
                            <h3 className="text-center text-uppercase">GPF Transaction Edit Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                {editWPPFAllowance ? <div className="text-center"><CustomSpinner /></div>
                    :
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
                                                        value={payrollDate ? payrollDate : ""}
                                                    />
                                                </InputGroup>

                                            </Col>
                                        </Row>

                                        <Row className="align-items-center py-2">
                                            <Col md={4}>
                                                <Label size="lg" for="allowanceTitle">Transaction Title <span className='text-danger'>*</span></Label>
                                            </Col>
                                            <Col md={6}>
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
                                            </Col>
                                        </Row>
                                        <Row className="align-items-center">
                                            <Col md={4}>
                                                <Label size='lg' className="form-label" for="transactionType">
                                                    Transaction Type <span className='text-danger'>*</span>
                                                </Label>
                                            </Col>
                                            <Col md={6}>
                                                <Select
                                                    id="transactionType"
                                                    name="transactionType"
                                                    options={transTypes ? transTypes?.map((data) => ({
                                                        value: data.id,
                                                        label: data.transactionName,
                                                    })) : []}
                                                    onChange={handleTransType}
                                                    value={transTypes?.find((item) => item.id === transType)
                                                        ? {
                                                            value: transType,
                                                            label: transTypes.find((item) => item.id === transType).transactionName,
                                                        }
                                                        : null
                                                    }
                                                />
                                            </Col>
                                        </Row>

                                        <Col md={10}>
                                            <div className=" mt-2 mt-md-4 text-end">
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded  mb-2 me-2"
                                                    onClick={handleUpdateAllowance}
                                                    disabled={trnLoading}
                                                >
                                                    {trnLoading ?
                                                        <div className='px-4'> <Spinner style={{ width: '1rem', height: '1rem' }} /> </div> : " Update Transaction"}
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
                                        <thead className="table-light" style={{ position: 'sticky', top: -1, background: 'black' }}>
                                            <tr>
                                                <th className="col-0">SL</th>
                                                <th className="col-0">EMP ID</th>
                                                <th className="col-1">
                                                    <div>PF ID</div>
                                                    <Input className='p-2' placeholder={`Search..(${allowanceData?.length})`}
                                                        onChange={handleSearchPfid}
                                                    />
                                                </th>
                                                <th className="col-0">
                                                    <div>Code</div>
                                                    <Input className='p-2' placeholder={`Search..(${allowanceData?.length})`}
                                                        onChange={handleSearchEmpCode}
                                                    />
                                                </th>
                                                <th className="col-2">
                                                    <div>Name</div>
                                                    <Input className='p-2' placeholder={`Search..(${allowanceData?.length})`}
                                                        onChange={handleSearchName} />
                                                </th>
                                                {/* <th className="col-2">Designation</th> */}
                                                <th className="col-2">
                                                    <div>Designation</div>
                                                    <Select
                                                        id="transactionType"
                                                        name="transactionType"
                                                        options={[
                                                            { value: "", label: "All" },
                                                            ...uniqueDesignations?.map((designation) => ({
                                                                value: designation,
                                                                label: designation,
                                                            })),
                                                        ]}
                                                        onChange={handleDesignationChange}
                                                        styles={customStyles}
                                                    />
                                                </th>
                                                <th className="col-2">
                                                    <div>Department</div>
                                                    <Select
                                                        id="transactionType"
                                                        name="transactionType"
                                                        options={[
                                                            { value: "", label: "All" },
                                                            ...uniqueDepartment?.map((department) => ({
                                                                value: department,
                                                                label: department,
                                                            })),
                                                        ]}
                                                        onChange={handleDepartmentChange}
                                                        styles={customStyles}
                                                    />
                                                </th>
                                                <th className="col-2 ">MR/PV No</th>
                                                <th className="col-2 ">Period Of Subscription</th>
                                                <th className="col-2 text-end">Amount</th>
                                                {/* <th className="col-2">GPF Loan</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData?.map((item, index) => {

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.empID}</td>
                                                        <td>{item.pfID}</td>
                                                        <td>{item.empCode}</td>
                                                        <td>{item.empName}</td>
                                                        <td>{item.designation}</td>
                                                        <td>{item.deptName}</td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                name="remarks"
                                                                id="amount"
                                                                className="form-control"
                                                                onChange={(e) => handleChangeRemarks(e, item.empID)}
                                                                value={item?.remarks ? item?.remarks : ''}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                name="remarks2"
                                                                id="amount"
                                                                className="form-control"
                                                                onChange={(e) => handleChangeRemarks(e, item.empID)}
                                                                value={item?.remarks2 ? item?.remarks2 : ''}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                name="amount"
                                                                id="amount"
                                                                className="form-control text-end"
                                                                onChange={(e) => handleInputChange(e, item.empID)}
                                                                value={item.amount ? item.amount : ''}
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        {/* <td>
                                                        <Input
                                                            type="number"
                                                            name="gPfLoan"
                                                            id="gPfLoan"
                                                            className="form-control text-end"
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            value={item.gPfLoan}
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
                                                <td className="text-end">{totalAmount}</td>
                                                {/* <td className="text-end">{totalGPFLoan}</td> */}
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
        </div >
    );
};

export default GPFEdit;
