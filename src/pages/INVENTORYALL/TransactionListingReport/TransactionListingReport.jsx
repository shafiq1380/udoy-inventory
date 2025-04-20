import React, { useEffect, useState } from 'react'
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post, REPORT_URL } from '../../../utils/https';
import Select from 'react-select'
import EmpRptCheckBox from '../../PAYROLLALL/EmployeePayrollReport/EmpRptCheckBox';
import Flatpickr from "react-flatpickr";
import CustomSpinner from '../../../components/Common/CustomSpinner';
import axios from 'axios';
import { fetchAllGroup, fetchAllItemList } from '../../../store/InventoryItemList/actions';
import { useDispatch, useSelector } from 'react-redux';
import { authorization } from '../../../components/Common/Authorization';

const TransactionListingReport = () => {

    // document.title = "Transaction Listing Report | SMART Accounting System"
    const dispatch = useDispatch();

    const [allTransactionTypes, setAllTransactionTypes] = useState([]);
    const getDefaultDate = () => {
        const defaultDate = new Date();
        return `${('0' + (defaultDate.getDate())).slice(-2)}/${('0' + (defaultDate.getMonth() + 1)).slice(-2)}/${defaultDate.getFullYear()}`;
    };

    const [fromDates, setFromDates] = useState(getDefaultDate());
    const [toDates, setToDates] = useState(getDefaultDate());
    const [trnTypeId, setTrnTypeId] = useState({});
    const [productCategory, setProductCategory] = useState([])
    const [btnDropdown, setBtnDropdown] = useState(false)

    useEffect(() => {
        getAllTransactionTypes()
    }, []);

    const getAllTransactionTypes = () => {
        try {
            Post('/api/InvTransaction/GetTransactionTypeList')
                .then((response) => {
                    // console.log("response", response.data.data)
                    if (response.status === 200) {
                        setAllTransactionTypes(response.data.data)
                    }
                })
        } catch (error) {
            console.log("Error ------->>>", error)
        }
    };

    const { allItemList } = useSelector(state => state.AllItemList);
    const { itemGroupList } = useSelector(state => state.AllItemList)
    const [allStoreList, setAllStoreList] = useState([]);

    const [ledgerData, setLedgerData] = useState({
        allItem: 0,
        itemId: 0,
        allGroup: 0,
        groupId: 0,
        allCategory: 0,
        categoryId: 0,
        allStore: 0,
        storeId: 0,
        trnAllId: 0,
        trnTypeId: 0,
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
    const [additionalInfo, setAdditionalInfo] = useState(0);

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
        } else if (name === 'trnType') {
            setTrnTypeId(e)
            setLedgerData({
                ...ledgerData, ['trnTypeId']: e.value, ['trnAllId']: 0
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
        } else if (name === 'allTrnType') {
            setTrnTypeId({})
            setLedgerData({
                ...ledgerData, ['trnAllId']: checked ? 1 : 0, ['trnTypeId']: 0
            })
        }
    };

    const handleZeroCheckBox = (e) => {
        const { checked } = e.target;
        setAdditionalInfo(checked ? 1 : 0);
    };

    const handleFromDateChange = (selectedDates, dateStr) => {
        setFromDates(dateStr);
    };

    const handleToDateChange = (selectedDates, dateStr) => {
        setToDates(dateStr);
    };


    const handleShowReport = async () => {

        setLoading(!loading)

        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));

        const allItem = ledgerData.allItem
        const itemId = ledgerData.itemId
        const allGroup = ledgerData.allGroup
        const groupId = ledgerData.groupId
        const categoryAll = ledgerData.allCategory
        const categoryId = ledgerData.categoryId
        const allStore = ledgerData.allStore
        const storeId = ledgerData.storeId
        const transactionAll = ledgerData.trnAllId
        const trnType = ledgerData.trnTypeId
        const startDate = fromDates;
        const endDate = toDates;

        // console.log("cCode --->>", cCode, typeof cCode)
        // console.log("token --->>", token, typeof token)
        // console.log("userID --->>", userID, typeof userID)
        // console.log("item --->>", itemId, typeof itemId)
        // console.log("group --->>", groupId, typeof groupId)
        // console.log("store --->>", storeId, typeof storeId)
        // console.log("trnId --->>", transactionAll, typeof transactionAll)
        // console.log("trnType --->>", trnType, typeof trnType)
        // console.log("startDate --->>", startDate, typeof startDate)
        // console.log("endDate --->>", endDate, typeof endDate)

        // /InvReport/GetTransactionListingReport(string cCode, string auth, string downloadtype, string UserID, int ItemAll, int GroupAll, int StoreAll, int TranAll, int? ItemID, int? GroupID, int? StoreID, int? TranTypeID, string StartDate, string EndDate)



        const BASEURL = `${REPORT_URL}/api/InvReport/GetTransactionListingReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&ItemAll=${allItem}&GroupAll=${allGroup}&CatAll=${categoryAll}&StoreAll=${allStore}&TranAll=${transactionAll}&ItemID=${itemId}&GroupID=${groupId}&CatID=${categoryId}&StoreID=${storeId}&TranTypeID=${trnType}&StartDate=${startDate}&EndDate=${endDate}&AdditionalInfo=${additionalInfo}`;

        // console.log("BASEURL --->>", BASEURL)


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
        const allItem = ledgerData.allItem
        const itemId = ledgerData.itemId
        const allGroup = ledgerData.allGroup
        const groupId = ledgerData.groupId
        const categoryAll = ledgerData.allCategory
        const categoryId = ledgerData.categoryId
        const allStore = ledgerData.allStore
        const storeId = ledgerData.storeId
        const transactionAll = ledgerData.trnAllId
        const trnType = ledgerData.trnTypeId
        const startDate = fromDates;
        const endDate = toDates;

        const BASEURL = `${REPORT_URL}/api/InvReport/GetTransactionListingReport?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&ItemAll=${allItem}&GroupAll=${allGroup}&CatAll=${categoryAll}&StoreAll=${allStore}&TranAll=${transactionAll}&ItemID=${itemId}&GroupID=${groupId}&CatID=${categoryId}&StoreID=${storeId}&TranTypeID=${trnType}&StartDate=${startDate}&EndDate=${endDate}&AdditionalInfo=${additionalInfo}`;

        window.location.href = BASEURL

    };


    useEffect(() => {
        authorization(89)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Transaction Listing Report" />

                <Card>
                    <CardBody>
                        <Row>
                            <Col md={8} sm={12}>

                                <Row className='align-items-center'>
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

                                <Row className='align-items-center'>
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

                                <Row className='align-items-center'>
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

                                <Row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Store List</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4 '>
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


                                <Row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>Transaction Types</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'>
                                        <Col md={1} className="d-flex align-items-center">
                                            <EmpRptCheckBox
                                                handleCheckBox={handleCheckBox}
                                                name="allTrnType"
                                                value={ledgerData.trnAllId === 1 ? true : false}
                                            />
                                        </Col>
                                    </Col>
                                    <Col md={7}>
                                        <Select
                                            onChange={(e) => handleSelectedData(e, 'trnType')}
                                            value={trnTypeId}
                                            options={allTransactionTypes?.map((item) => {
                                                return {
                                                    label: item.trnCode + " : " + item.trnDesc,
                                                    value: item.id
                                                };
                                            })}
                                            placeholder="Select Transaction Type"
                                        />
                                    </Col>
                                </Row>

                                <Row className='mt-2 mb-2'>
                                    <Col md={3}>
                                        <Label for="transactionFrom" size="lg" className="pt-0">From Date</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={7}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                // options={{
                                                //     altInput: true,
                                                //     altFormat: "F j, Y",
                                                //     dateFormat: "d/m/Y"
                                                // }}
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

                                <Row className='mt-2 mb-2'>
                                    <Col md={3}>
                                        <Label for="transactionFrom" size="lg" className="pt-0">To Date</Label>
                                    </Col>
                                    <Col md={1} className='mx-md-4'></Col>
                                    <Col sm={10} md={7}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                // options={{
                                                //     altInput: true,
                                                //     altFormat: "F j, Y",
                                                //     dateFormat: "d/m/Y"
                                                // }}
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

                                <Row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg' className='pt-0'>With Additional Info</Label>
                                    </Col>
                                    <Col md={2} className='mx-md-4'>
                                        <input
                                            type="checkbox"
                                            className="form-check-input checkboxboder mx-2 p-3"
                                            name="additionalInfo"
                                            checked={additionalInfo}
                                            onChange={handleZeroCheckBox}
                                            id="additionalInfo"
                                            value={1}
                                        />
                                    </Col>
                                </Row>

                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 mb-2 me-2 px-4"
                                            onClick={handleShowReport}
                                            disabled={
                                                (ledgerData.allItem === 0 && ledgerData.itemId === 0) ||
                                                (ledgerData.allGroup === 0 && ledgerData.groupId === 0) ||
                                                (ledgerData.allCategory === 0 && ledgerData.categoryId === 0) ||
                                                (ledgerData.allStore === 0 && ledgerData.storeId === 0) ||
                                                (ledgerData.trnAllId === 0 && ledgerData.trnTypeId === 0)
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
                                                (ledgerData.trnAllId === 0 && ledgerData.trnTypeId === 0)
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
                                                        (ledgerData.trnAllId === 0 && ledgerData.trnTypeId === 0)
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
        </div>
    )
}

export default TransactionListingReport