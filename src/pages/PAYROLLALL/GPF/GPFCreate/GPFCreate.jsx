import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, InputGroup, Label, Row, Spinner, Table } from 'reactstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Flatpickr from "react-flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Post } from '../../../../utils/https';
import CustomSpinner from '../../../../components/Common/CustomSpinner';
import { getPFDataInsertByTypeRequest } from '../../../../store/pf-data-insert-by-types/actions';
import Select from 'react-select'
import './CSS.css';
import { authorization } from '../../../../components/Common/Authorization';
import { drop, get, set } from 'lodash';
import { fetchPFDetailsByIdRequest } from '../../../../store/pf-details-by-id/actions';


const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const GPFCreate = () => {
    const navigate = useNavigate();
    const [allowanceData, setAllowanceData] = useState([]);
    const [allowanceTitle, setAllowanceTitle] = useState('');
    const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);
    const [transType, setTransType] = useState(null);
    const [trnLoading, setTranLoading] = useState(false)
    const [transTypes, setTransTypes] = useState([]);

    //formating the date for getting data 
    const [getDataDate, setGetDataDate] = useState(); // new Date().toISOString().split('T')[0]
    const [formulaType, setFormulaType] = useState('32');
    const [loadingData, setLoadingData] = useState(false);


    const [tempSearchId, setTempSearchId] = useState(null)
    const [searchId, setSearchId] = useState(null)

    //filter the designation data
    const [filteredData, setFilteredData] = useState(allowanceData);
    const [selectedDesignation, setSelectedDesignation] = useState('');

    const userID = JSON.parse(localStorage.getItem('userID'));
    const dispatch = useDispatch();

    const { loading, pfDataInsertByType, error } = useSelector(state => state.pfDataInsertByTypeReducer);

    const { loading: pfDetailsLoading, pfDetailsById } = useSelector(state => state.pfDetailsByIdReducer);



    const transactionTypeList = async () => {
        const data = await Post('/api/v1/ProvidentFund/GetGPFTransactionTypeList', {})
            .then(res =>
                setTransTypes(res.data.data.reverse())
            );
    }


    const handleFromDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates.length > 0 ? selectedDates[0] : new Date();
        const year = selectedDate.getFullYear();
        const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
        const day = ('0' + selectedDate.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        setPayrollDate(formattedDate);
    }, []);

    const columnCount = allowanceData.filter(item => item.amount || item.gpfLoan > 0).length;
    const totalGPFDeduction = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.amount || 0), 0), [allowanceData]);

    // filter the designation from the data
    const uniqueDesignations = [...new Set(allowanceData.map(item => item.designation))];
    const uniqueDepartment = [...new Set(allowanceData.map(item => item.deptName))];

    // const totalGPFLoan = useMemo(() => allowanceData.reduce((acc, item) => acc + (+item.gpfLoan || 0), 0), [allowanceData]);


    const handleSearchID = () => {
        setGetDataDate(null)
        setSearchId(tempSearchId)
    }

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        const allowanceList = [...allowanceData]

        const itemIndex = allowanceList.findIndex((item) => item.id === id);

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

        const itemIndex = allowanceList.findIndex((item) => item.id === id);

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


    // console.log(filteredData)

    const handleTransType = (selectedOption) => {
        setTransType(selectedOption.value);
    };

    const handleCreateAllowance = () => {
        setTranLoading(true)
        const filteredData = allowanceData.filter(item => item.amount || item.gpfLoan > 0);

        // console.log(transType)

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
                transactionTypeID: transType,
                transactionDate: payrollDate,
                title: allowanceTitle,
                userCode: userID,
                detailData: filteredData.map((item) => ({
                    hdrID: 0,
                    empID: item.id,
                    amount: +item.amount,
                    remarks: item?.remarks,
                    remarks2: item?.remarks2
                }))
            }
        };

        // console.log("data --------->>>>>>>", data)

        try {
            Post('/api/v1/ProvidentFund/GPFDataInsert', data)
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
                        setTranLoading(false)
                    }
                });
        } catch (error) {
            console.error("Create Allowance Error", error);
        }
    };

    const createGPF = allowanceData && allowanceData.length > 0 ? false : true;


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
        if (pfDataInsertByType) {
            const data = pfDataInsertByType.map((item) => ({
                ...item,
                gPfDeduction: null,
                gPfLoan: null,
                cPfOwn: 0,
                cPfCompany: 0,
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
            }));
            setAllowanceData(data);
            //for filter the Designation
            setFilteredData(data)
        }
    }, [loading, pfDataInsertByType, error]);

    useEffect(() => {
        dispatch(getPFDataInsertByTypeRequest(1));
        transactionTypeList();
    }, []);


    useEffect(() => {
        if (searchId) {
            setAllowanceData([]);
            setFilteredData([]);
            dispatch(fetchPFDetailsByIdRequest(searchId));
        }

    }, [searchId]);

    useEffect(() => {
        // console.log(searchId)
        if (pfDetailsById) {
            const updatedSecondArray = allowanceData?.map((item) => {
                const matched = pfDetailsById?.find((first) => first.empID === item.id);
                // console.log(matched)
                return matched ?
                    { ...item, ['amount']: matched.amount, ['remarks']: matched?.remarks, ['remarks2']: matched?.remarks2 } : { ...item, ['amount']: 0, ['remarks']: '', ['remarks2']: '' };
            });
            setAllowanceData(updatedSecondArray)
            setFilteredData(updatedSecondArray)
        }
    }, [pfDetailsById])



    // formating the date and get data by date 

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDate = (dte) => {
        setSearchId(null)
        setTempSearchId(null)
        // const date = dte?.split('/').reverse().join('-')
        setGetDataDate(dte)
    }

    const getGpfDataByDate = async () => {
        setLoadingData(true)
        const data = {
            salaryDate: getDataDate?.split('/').reverse().join('-'),
            forID: formulaType
        }
        // console.log(data)
        setAllowanceData([]);
        setFilteredData([]);
        const response = await Post('/api/v1/ProvidentFund/GetGPFSalaryByDate', { data: data })
            .then(res => {
                setLoadingData(false)
                const updatedSecondArray = allowanceData?.map((item) => {
                    const matched = res.data?.find((first) => first.empID === item.id);
                    // console.log(matched)
                    return matched ?
                        { ...item, ['amount']: matched?.forVal, ['remarks']: matched?.remarks, ['remarks2']: matched?.remarks2 } : { ...item, ['amount']: 0, ['remarks']: '', ['remarks2']: '' };
                });
                setAllowanceData(updatedSecondArray)
                setFilteredData(updatedSecondArray)
                // setAllowanceData(res.data.data)
                // setFilteredData(res.data.data)
            });
    }

    // console.log(allowanceData)

    useEffect(() => {
        authorization(107)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="GPF Transaction Create" />
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
                            <h3 className="text-center text-uppercase">GPF Transaction SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card>
                {
                    createGPF ? <div className="text-center"><CustomSpinner /></div>
                        :
                        <>
                            <Card className='mt-3'>
                                <CardBody>
                                    <Row >
                                        <Col md={5}>

                                            <Row className="align-items-center">
                                                <Col md={5}>
                                                    <Label size='lg' for='date'>Transaction Date</Label>
                                                </Col>
                                                <Col md={6}>
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
                                                </Col>
                                            </Row>

                                            <Row className="align-items-center py-3">
                                                <Col md={5}>
                                                    <Label size='lg' for="allowanceTitle">
                                                        Transaction Title <span className='text-danger'>*</span></Label>
                                                </Col>
                                                <Col md={6}>
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
                                                </Col>
                                            </Row>

                                            <Row className="align-items-center">
                                                <Col md={5}>
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
                                                        value={transTypes?.find((item) => item.value === transType)}
                                                    />

                                                </Col>
                                            </Row>

                                            <Col md={11}>
                                                <div className=" mt-2 mt-md-3 text-end">
                                                    <Button
                                                        type="button"
                                                        color="success"
                                                        className="btn-rounded  mb-2 me-2"
                                                        onClick={handleCreateAllowance}
                                                        disabled={!transType || !payrollDate || !allowanceTitle || columnCount === 0 || trnLoading}
                                                    >
                                                        {trnLoading ?
                                                            <div className='px-4'> <Spinner style={{ width: '1rem', height: '1rem' }} /> </div> : " Create Transaction"}
                                                    </Button>
                                                </div>
                                            </Col>

                                        </Col>


                                        <Col md={3}>
                                            <Col md={10}>
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
                                                            <td>Amount</td>
                                                            <td className="text-black text-end">{totalGPFDeduction}</td>
                                                        </tr>

                                                    </tbody>
                                                </Table></Col>
                                        </Col>

                                        <Col md={4} className='  rounded px-4 py-2 mb-3'
                                            style={{ border: '1px solid #e9e9e9' }}>

                                            <div>
                                                <Label className='text-info fw-bold'>GPF ID</Label>
                                                <Input search type="search"
                                                    onChange={(e) => setTempSearchId(e.target.value)}
                                                    placeholder="get GPF data by ID"
                                                    value={tempSearchId || ''}
                                                />
                                                <div className=" mt-1 mt-md-2 ">
                                                    <Button
                                                        type="button"
                                                        color="primary"
                                                        className="btn-rounded  mb-2 me-2 px-4"
                                                        disabled={!tempSearchId || pfDetailsLoading}
                                                        onClick={handleSearchID}
                                                    >
                                                        Get Data
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <Row>
                                                    <Col md={5}>
                                                        <Label className='text-info fw-bold'>Month</Label>
                                                        <Flatpickr
                                                            className="form-control "
                                                            placeholder="YYYY, M, dd"
                                                            options={{
                                                                plugins: [
                                                                    new monthSelectPlugin({
                                                                        shorthand: true,
                                                                        dateFormat: "d/m/Y",
                                                                        altInput: true,
                                                                        altFormat: "Y-m-d",
                                                                        theme: "light",
                                                                    })
                                                                ],
                                                                static: true
                                                            }}

                                                            onChange={(selectedDates, dateStr) => {
                                                                // handleDate(selectedDates)

                                                                const selectedDate = selectedDates[0];
                                                                const year = selectedDate.getFullYear();
                                                                const month = selectedDate.getMonth();

                                                                const lastDayOfMonth = getLastDayOfMonth(year, month);

                                                                const formattedDate = formatDate(lastDayOfMonth);
                                                                handleDate(dateStr);

                                                            }}
                                                            value={getDataDate}
                                                        />
                                                    </Col>
                                                    <Col md={7}>
                                                        <Label className='text-info fw-bold'>Formula Type</Label>
                                                        <Select
                                                            id="transactionType"
                                                            name="transactionType"
                                                            options={[
                                                                { id: '32', transactionName: 'GPF deduction' },
                                                                { id: '34', transactionName: 'GPF loan recovered' },
                                                            ].map((data) => ({
                                                                value: data.id,
                                                                label: data.transactionName,
                                                            }))}
                                                            onChange={e => setFormulaType(e.value)}
                                                            value={[
                                                                { value: '32', label: 'GPF deduction' },
                                                                { value: '34', label: 'GPF loan recovered' },
                                                            ].find((item) => item.value === formulaType)}
                                                        />
                                                    </Col>
                                                </Row>
                                                <div className=" mt-1 mt-md-2 ">
                                                    <Button
                                                        type="button"
                                                        color="primary"
                                                        className="btn-rounded  mb-2 me-2 px-4"
                                                        disabled={!getDataDate || loadingData}
                                                        onClick={getGpfDataByDate}
                                                    >
                                                        Get Data
                                                    </Button>
                                                </div>
                                            </div>

                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    {
                                        pfDetailsLoading || loadingData ? <div className="text-center"><CustomSpinner /></div>
                                            :
                                            <div style={{ overflowX: 'auto', height: '80vh' }} className="transaction-scrollbar">
                                                <Table className="table table-striped table-bordered table-sm" width="100%">
                                                    <thead className="table-light" style={{ position: 'sticky', top: -1, background: 'black', }}>
                                                        <tr>
                                                            <th className="col-0">SL</th>
                                                            <th className="col-0">EMP ID</th>
                                                            {/* <th className="col-0">PF ID</th> */}
                                                            <th className="col-1">
                                                                <div>PF ID</div>
                                                                <Input className='p-2' placeholder={`Search..(${allowanceData?.length})`}
                                                                    onChange={handleSearchPfid}
                                                                />
                                                            </th>
                                                            <th className="col-0">
                                                                <div>Code</div>
                                                                <Input className='p-2' placeholder={` Search..(${allowanceData?.length})`}
                                                                    onChange={handleSearchEmpCode}
                                                                />
                                                            </th>
                                                            <th className="col-2">
                                                                <div>Name</div>
                                                                <Input className='p-2' placeholder={` Search..(${allowanceData?.length})`}
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
                                                            <th className="col-2">MR/PV No</th>
                                                            <th className="col-2">Period Of Subscription</th>
                                                            <th className="col-1 text-end">Amount</th>
                                                            {/* <th className="col-2">GPF Loan</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            filteredData && filteredData?.map((item, index) => {

                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.id}</td>
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
                                                                                onChange={(e) => handleChangeRemarks(e, item.id)}
                                                                                value={item?.remarks ? item?.remarks : ''}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="remarks2"
                                                                                id="amount"
                                                                                className="form-control"
                                                                                onChange={(e) => handleChangeRemarks(e, item.id)}
                                                                                value={item?.remarks2 ? item?.remarks2 : ''}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="number"
                                                                                name="amount"
                                                                                id="amount"
                                                                                className="form-control text-end"
                                                                                onChange={(e) => handleInputChange(e, item.id)}
                                                                                value={item?.amount ? item?.amount : ''}
                                                                                onWheel={(e) => e.target.blur()}
                                                                            />
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className='fw-bold'>
                                                            <td colSpan="8" className="text-end">Total</td>
                                                            <td className="text-end">{totalGPFDeduction}</td>
                                                            {/* <td className="text-end">{totalGPFLoan}</td> */}
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </div>
                                    }
                                </CardBody>
                            </Card>
                        </>
                }


            </Container >

            <ToastContainer />

        </div >

    );
};

export default GPFCreate;
