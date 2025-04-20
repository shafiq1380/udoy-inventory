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


const ItemCurrentStockReport = () => {

    // document.title = "Item Current Stock Report | SMART Accounting System"

    const dispatch = useDispatch();

    const { allItemList } = useSelector(state => state.AllItemList);
    const { itemGroupList } = useSelector(state => state.AllItemList)
    const [allStoreList, setAllStoreList] = useState([]);
    const [productCategory, setProductCategory] = useState([])
    const [btnDropdown, setBtnDropdown] = useState(false)

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

    const handleShowReport = async () => {

        setLoading(!loading)

        const cCode = JSON.parse(localStorage.getItem('cCode'));
        const token = JSON.parse(localStorage.getItem('authKey'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const itemAll = ledgerData.allItem
        const itemId = ledgerData.itemId
        const groupAll = ledgerData.allGroup
        const groupId = ledgerData.groupId
        const categoryAll = ledgerData.allCategory
        const categoryId = ledgerData.categoryId
        const storeAll = ledgerData.allStore
        const storeId = ledgerData.storeId


        // console.log("item --->>", itemId, typeof itemId)
        // console.log("group --->>", groupId, typeof groupId)
        // console.log("store --->>", storeId, typeof storeId)

        // /api/InvReport/GetItemCurrentStockReport?cCode=DEV&auth=abcd&downloadtype=pdf&UserID=1090006&ItemAll=1&GroupAll=1&StoreAll=1&ItemID=1&GroupID=1&StoreID=1


        const BASEURL = `${REPORT_URL}/api/InvReport/GetItemCurrentStockReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&ItemAll=${itemAll}&GroupAll=${groupAll}&CatAll=${categoryAll}&StoreAll=${storeAll}&ItemID=${itemId}&GroupID=${groupId}&CatID=${categoryId}&StoreID=${storeId}`;

        // console.log("BASEURL", BASEURL)

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
        const groupId = ledgerData.groupId
        const categoryAll = ledgerData.allCategory
        const categoryId = ledgerData.categoryId
        const storeAll = ledgerData.allStore
        const storeId = ledgerData.storeId

        const BASEURL = `${REPORT_URL}/api/InvReport/GetItemCurrentStockReport?cCode=${cCode}&auth=${token}&downloadtype=${type}&UserID=${userID}&ItemAll=${itemAll}&GroupAll=${groupAll}&CatAll=${categoryAll}&StoreAll=${storeAll}&ItemID=${itemId}&GroupID=${groupId}&CatID=${categoryId}&StoreID=${storeId}`;

        window.location.href = BASEURL

    };


    useEffect(() => {
        authorization(87)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Item Current Stock Report" />

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

                            </Col>
                        </Row>

                        <Row className='mt-2'>
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
                                                (ledgerData.allStore === 0 && ledgerData.storeId === 0)
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
                                                (ledgerData.allStore === 0 && ledgerData.storeId === 0)
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
                                                        (ledgerData.allStore === 0 && ledgerData.storeId === 0)
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

export default ItemCurrentStockReport