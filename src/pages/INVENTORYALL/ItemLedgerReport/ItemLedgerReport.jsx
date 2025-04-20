import React, { useEffect, useState } from 'react'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGroup, fetchAllItemList } from '../../../store/InventoryItemList/actions';
import { Post, REPORT_URL, REPORT_URL1 } from '../../../utils/https';
import Flatpickr from "react-flatpickr";
import RadioButton from '../../../components/Common/RadioButton';
import EmpRptCheckBox from '../../PAYROLLALL/EmployeePayrollReport/EmpRptCheckBox';
import axios from 'axios';
import CustomSpinner from '../../../components/Common/CustomSpinner';
import { authorization } from '../../../components/Common/Authorization';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ItemLedgerReport = () => {

    const toastOptions = {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // document.title = "Item Ledger Report | SMART Accounting System"

    const dispatch = useDispatch();

    const { allItemList } = useSelector(state => state.AllItemList);
    const { itemGroupList } = useSelector(state => state.AllItemList)
    const [allStoreList, setAllStoreList] = useState([]);

    const [productCategory, setProductCategory] = useState([])
    const [btnDropdown, setBtnDropdown] = useState(false)

    const getDefaultDate = () => {
        const defaultDate = new Date();
        return `${('0' + (defaultDate.getDate())).slice(-2)}/${('0' + (defaultDate.getMonth() + 1)).slice(-2)}/${defaultDate.getFullYear()}`;
    };

    const [fromDates, setFromDates] = useState(getDefaultDate());
    const [toDates, setToDates] = useState(getDefaultDate());

    const handleFromDateChange = (selectedDates, dateStr) => {
        setFromDates(dateStr);
    };

    const handleToDateChange = (selectedDates, dateStr) => {
        setToDates(dateStr);
    };

    const [selectedOption, setSelectedOption] = useState(1);

    const [ledgerData, setLedgerData] = useState({
        allItem: 0,
        itemId: 0,
        allGroup: 0,
        groupId: 0,
        allCategory: 0,
        categoryId: 0,
        allStore: 0,
        storeId: 0,
        fromDate: "",
        toDate: "",
        reportType: 0
    });

    const [itemId, setItemId] = useState({});
    const [groupId, setGroupId] = useState({});
    const [categoryId, setCategoryId] = useState({});
    const [storeId, setStoreId] = useState({});
    const [loading, setLoading] = useState(false)
    const [pdfLink, setPdfLink] = useState()
    const [sZero, setSZero] = useState(0);


    useEffect(() => {
        dispatch(fetchAllItemList())
        dispatch(fetchAllGroup())
        fetchAllStoreList()
        getProductCategory()
    }, [])

    const getProductCategory = async () => {
        try {
            await Post('/api/Product/GetAllItemCategory')
                .then(res => {
                    setProductCategory(res.data.data)
                })
        } catch (error) {

        }
    }

    const fetchAllStoreList = () => {
        Post('/api/Product/GetAllStore')
            .then((res) => {
                setAllStoreList(res.data.data)
            })
    };

    const handleSelectedData = (e, name) => {
        if (name === 'item') {
            // console.log("item e --->>", e)
            setItemId(e)
            setLedgerData({
                ...ledgerData, ['itemId']: e.value, ['allItem']: 0
            })
        } else if (name === 'group') {
            // console.log("group e --->>", e)
            setGroupId(e)
            setLedgerData({
                ...ledgerData, ['groupId']: e.value, ['allGroup']: 0
            })
        } else if (name === 'category') {
            // console.log("category e --->>", e)
            setCategoryId(e)
            setLedgerData({
                ...ledgerData, ['categoryId']: e.value, ['allCategory']: 0
            })
        } else if (name === 'store') {
            // console.log("store e --->>", e)
            setStoreId(e)
            setLedgerData({
                ...ledgerData, ['storeId']: e.value, ['allStore']: 0
            })
        }
    };

    const handleCheckBox = (e) => {
        const { checked, name } = e.target
        if (name === 'allItem') {
            setItemId({})
            setLedgerData({
                ...ledgerData, ['allItem']: checked ? 1 : 0, ['itemId']: 0
            })
        } else if (name === 'allGroup') {
            setGroupId({})
            setLedgerData({
                ...ledgerData, ['allGroup']: checked ? 1 : 0, ['groupId']: 0
            })
        } else if (name === 'allCategory') {
            setCategoryId({})
            setLedgerData({
                ...ledgerData, ['allCategory']: checked ? 1 : 0, ['categoryId']: 0
            })
        } else if (name === 'allStore') {
            setStoreId({})
            setLedgerData({
                ...ledgerData, ['allStore']: checked ? 1 : 0, ['storeId']: 0
            })
        }
    };

    const handleZeroCheckBox = (e) => {
        // console.log("e.target.checked", e.target.checked)
        const { checked } = e.target;
        setSZero(checked ? 1 : 0);
    };

    const handleSelection = (e) => {
        setSelectedOption(parseInt(e.target.value));
    };

    // const handleDateChange = (selectedDates, dateStr) => {
    //     if (selectedDates && selectedDates.length > 0) {
    //         setFromDates(dateStr);
    //     } else {
    //         // Set default date format when no date is selected
    //         const defaultDate = new Date();
    //         const defaultDateStr = `${('0' + (defaultDate.getDate())).slice(-2)}/${('0' + (defaultDate.getMonth() + 1)).slice(-2)}/${defaultDate.getFullYear()}`;
    //         setFromDates(defaultDateStr);
    //     }
    // };

    const handleShowReport = async () => {
        setLoading(!loading)

        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const itemAll = ledgerData.allItem
        const itemId = ledgerData.itemId
        const groupAll = ledgerData.allGroup
        const categoryAll = ledgerData.allCategory
        const categoryId = ledgerData.categoryId
        const groupId = ledgerData.groupId
        const storeAll = ledgerData.allStore
        const storeId = ledgerData.storeId
        const fromDate = fromDates
        const toDate = toDates
        const reportType = selectedOption

        const BASEURL = `${REPORT_URL}/api/InvReport/GetItemLedgerReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&ItemAll=${itemAll}&GroupAll=${groupAll}&CatAll=${categoryAll}&StoreAll=${storeAll}&ItemID=${itemId}&GroupID=${groupId}&CatID=${categoryId}&StoreID=${storeId}&StartDate=${fromDate}&EndDate=${toDate}&ReportType=${reportType}&Szero=${sZero}`;

        await axios.get(`${BASEURL}`, {
            responseType: 'blob',
        })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setLoading(false)
                setPdfLink(url)
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.status === 500) {
                    toast.error(error.response.statusText, toastOptions);
                } else {
                    console.error('Error fetching PDF:', error);
                }
            });
    };

    const handleDownloadReport = (type) => {
        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const itemAll = ledgerData.allItem
        const itemId = ledgerData.itemId
        const groupAll = ledgerData.allGroup
        const categoryAll = ledgerData.allCategory
        const categoryId = ledgerData.categoryId
        const groupId = ledgerData.groupId
        const storeAll = ledgerData.allStore
        const storeId = ledgerData.storeId
        const fromDate = fromDates
        const toDate = toDates
        const reportType = selectedOption

        const BASEURL = `${REPORT_URL}/api/InvReport/GetItemLedgerReport?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&ItemAll=${itemAll}&GroupAll=${groupAll}&CatAll=${categoryAll}&StoreAll=${storeAll}&ItemID=${itemId}&GroupID=${groupId}&CatID=${categoryId}&StoreID=${storeId}&StartDate=${fromDate}&EndDate=${toDate}&ReportType=${reportType}&Szero=${sZero}`;

        window.location.href = BASEURL

    };

    useEffect(() => {
        authorization(86)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Item Ledger Report" />

                <Card>
                    <CardBody>
                        <Row>
                            <Col md={8} sm={12}>
                                <Row row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Item List</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <Col md={1} className="d-flex align-items-center">
                                            <EmpRptCheckBox
                                                handleCheckBox={handleCheckBox}
                                                value={ledgerData.allItem === 1 ? true : false}
                                                name="allItem"
                                            />
                                        </Col>
                                    </Col>
                                    <Col md={7}>
                                        <Select
                                            onChange={(e) => handleSelectedData(e, 'item')}
                                            options={allItemList.map((item) => {
                                                return {
                                                    label: item.itemCode + " : " + item.itemDesc,
                                                    value: item.id
                                                };
                                            })}
                                            placeholder="Select Item"
                                            value={itemId}
                                        />
                                    </Col>
                                </Row>

                                <Row row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Item Group</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <Col md={1} className="d-flex align-items-center">
                                            <EmpRptCheckBox
                                                handleCheckBox={handleCheckBox}
                                                value={ledgerData.allGroup === 1 ? true : false}
                                                name="allGroup"
                                            />
                                        </Col>
                                    </Col>
                                    <Col md={7}>
                                        <Select
                                            onChange={(e) => handleSelectedData(e, 'group')}
                                            options={itemGroupList.map((item) => {
                                                return {
                                                    label: item.groupCode + " : " + item.groupName,
                                                    value: item.id
                                                };
                                            })}
                                            placeholder="Select Group"
                                            value={groupId}
                                        />
                                    </Col>
                                </Row>

                                <Row row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Item Category</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <Col md={1} className="d-flex align-items-center">
                                            <EmpRptCheckBox
                                                handleCheckBox={handleCheckBox}
                                                value={ledgerData.allCategory === 1 ? true : false}
                                                name="allCategory"
                                            />
                                        </Col>
                                    </Col>
                                    <Col md={7}>
                                        <Select
                                            onChange={(e) => handleSelectedData(e, 'category')}
                                            options={productCategory.map((item) => {
                                                return {
                                                    label: item.id + " : " + item.categoryName,
                                                    value: item.id
                                                };
                                            })}
                                            placeholder="Select Group"
                                            value={categoryId}
                                        />
                                    </Col>
                                </Row>

                                <Row row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Store List</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <Col md={1} className="d-flex align-items-center">
                                            <EmpRptCheckBox
                                                handleCheckBox={handleCheckBox}
                                                value={ledgerData.allStore === 1 ? true : false}
                                                name="allStore"
                                            />
                                        </Col>
                                    </Col>
                                    <Col md={7}>
                                        <Select
                                            onChange={(e) => handleSelectedData(e, 'store')}
                                            options={allStoreList.map((item) => {
                                                return {
                                                    label: item.storeCode,
                                                    value: item.id
                                                };
                                            })}
                                            placeholder="Select Store"
                                            value={storeId}
                                        />
                                    </Col>
                                </Row>

                                <Row className='mb-2 mt-2'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>From Date</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={7}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={handleFromDateChange}
                                                onClose={handleFromDateChange}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={fromDates}
                                            />
                                        </InputGroup>

                                    </Col>
                                </Row>

                                <Row className='mb-2'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>To Date</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={7}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={handleToDateChange}
                                                onClose={handleToDateChange}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={toDates}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Label for="option" md={3} sm={2} size="lg">Report Type</Label>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={5}>
                                        <InputGroup size='lg'>
                                            <RadioButton
                                                value={1}
                                                name='selectOption'
                                                selectedOption={selectedOption}
                                                handleOptionChange={handleSelection}
                                                label={'Summary (Qty Only)'}
                                            />
                                            <RadioButton
                                                value={2}
                                                name='selectOption'
                                                selectedOption={selectedOption}
                                                handleOptionChange={handleSelection}
                                                label={'Summary (Qty with Value)'}
                                            />
                                            <RadioButton
                                                value={3}
                                                name='selectOption'
                                                selectedOption={selectedOption}
                                                handleOptionChange={handleSelection}
                                                label={'Detail (Qty Only)'}
                                            />
                                            <RadioButton
                                                value={4}
                                                name='selectOption'
                                                selectedOption={selectedOption}
                                                handleOptionChange={handleSelection}
                                                label={'Detail (Qty with Value)'}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Label for="option" md={3} sm={2} size="lg"></Label>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={5}>
                                        <InputGroup size='lg'>
                                            <input
                                                type="checkbox"
                                                className="form-check-input checkboxboder mx-2 p-3"
                                                name="sZero"
                                                checked={sZero}
                                                onChange={handleZeroCheckBox}
                                                id="sZero"
                                                value={1}
                                            />

                                            <Label for="sZero" className="form-check-label" size="lg">Suppress Zero Transaction</Label>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-4'>
                            <Col md={8} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 me-2 px-4"
                                            onClick={handleShowReport}
                                            disabled={
                                                (ledgerData.allItem === 0 && ledgerData.itemId === 0) ||
                                                (ledgerData.allGroup === 0 && ledgerData.groupId === 0) ||
                                                (ledgerData.allCategory === 0 && ledgerData.categoryId === 0) ||
                                                (ledgerData.allStore === 0 && ledgerData.storeId === 0) ||
                                                !fromDates ||
                                                !toDates
                                            }
                                        >
                                            Show Report
                                        </Button>
                                    </div>
                                    <div>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={
                                                (ledgerData.allItem === 0 && ledgerData.itemId === 0) ||
                                                (ledgerData.allGroup === 0 && ledgerData.groupId === 0) ||
                                                (ledgerData.allCategory === 0 && ledgerData.categoryId === 0) ||
                                                (ledgerData.allStore === 0 && ledgerData.storeId === 0) ||
                                                !fromDates ||
                                                !toDates
                                            }

                                        >
                                            <DropdownToggle color="white border border-white" caret>
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded px-4"
                                                    disabled={
                                                        (ledgerData.allItem === 0 && ledgerData.itemId === 0) ||
                                                        (ledgerData.allGroup === 0 && ledgerData.groupId === 0) ||
                                                        (ledgerData.allCategory === 0 && ledgerData.categoryId === 0) ||
                                                        (ledgerData.allStore === 0 && ledgerData.storeId === 0) ||
                                                        !fromDates ||
                                                        !toDates
                                                    }
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
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

                <Row style={{ height: '100vh', marginBottom: '20px' }}>
                    {
                        loading ? <CustomSpinner /> : <iframe src={pdfLink} width="100%" height="100%" frameBorder="0"></iframe>
                    }
                </Row>

            </Container>

            <ToastContainer />
        </div>
    )
}

export default ItemLedgerReport