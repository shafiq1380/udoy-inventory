import React, { useEffect, useId, useRef, useState } from 'react'
import { Container, Card, CardBody, Row, Col, Label, InputGroup, CardHeader, Input, Button } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { fetchAllItemList } from '../../../store/InventoryItemList/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../../utils/https';
import { getCurrentStockRequest } from '../../../store/current-stock/actions';
import SaveEditResponseModal from './SaveEditResponseModal';

import JoditEditor from 'jodit-react';
import { authorization } from '../../../components/Common/Authorization';
import CmnSaveEditResponseModal from '../COMMOMCOMPONENT/CmnSaveEditResponseModal';
import { TbSearch } from 'react-icons/tb';
import SearchItemSelectModal from '../COMMOMCOMPONENT/SearchItemSelectModal';



const customStyles = {
    option: (provided, state) => ({
        ...provided,
        '&:hover': {
            backgroundColor: '#00CCFF ',
        },
    }),
};

const MaterialRequisitionAndIssue = () => {

    // document.title = "Material Purchase Requisition | SMART Accounting System";

    const toastOptions = {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const initialRow = {
        itemID: '',
        itemName: '',
        unit: '',
        stock: '',
        isSerial: false,
        quantity: '',
        storeCode: '',
        itemSerial: ''
    };

    const dispatch = useDispatch()

    // Global State
    const { allItemList } = useSelector(state => state.AllItemList)
    const { currentStock } = useSelector(state => state.currentStockReducer)
    // const { userID } = useSelector(state => state.Login.userInformation)


    const userID = JSON.parse(localStorage.getItem('userID'))

    // Local State
    const [materialComponent, setMaterialComponent] = useState([initialRow]);
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0]);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
    const [reqDate, setReqDate] = useState(new Date().toISOString().split("T")[0]);

    const [remarks, setRemarks] = useState('');
    const [requisitionTo, setRequisitionTo] = useState(null);
    const [requisitionFor, setRequisitionFor] = useState('');


    const [selectedTranValues, setselectedTranValues] = useState([]);
    console.log("selectedTranValues", selectedTranValues)
    const [selectedStoreValues, setselectedStoreValues] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [allStoreList, setAllStoreList] = useState([]);
    // const [allPartnerList, setAllPartnerList] = useState([]);
    const [consumption, setConsumption] = useState({ value: "SRS", label: "Department / Other" });

    // department 

    const [departmentList, setDepartmentList] = useState([])


    // Aditional information
    const [content, setContent] = useState();
    const contentRef = useRef(content);

    //response modal after submit the from data
    const [responseModal, setResponseModal] = useState(false);
    const [responseId, setResponseId] = useState(null);
    const [error, setError] = useState(null)
    const [mrrRef, setMrrRef] = useState('')

    const fetchTrnList = () => {
        Post('/api/InvTransaction/GetTransactionTypeList')
            .then((res) => {
                // console.log("res", res?.data?.data.find(item => item.trnCode === 'MRR'))
                const data = res?.data?.data.find(item => item.trnCode === consumption?.value)?.trnAddValFormat
                setContent(data)
            })
    };


    const fetchAllStoreList = () => {
        Post('/api/InvTransaction/GetStorePermissionByUser', { data: userID })
            .then((res) => {
                // console.log("res", res)
                setAllStoreList(res.data.data)
            })
    };


    // new code for search item list for purchase requisition
    const [productData, setProdutDate] = useState([])
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [indext, setIndext] = useState(null)


    const fetchProduct = () => {
        Post('/api/Product/GetAllItemSearch')
            .then((res) => {
                if (res.data.success === true) {
                    setProdutDate(res.data.data)
                }
            })
    };

    const getDepartment = async () => {
        try {
            await Post('/api/EmployeeManagement/GetAllDepartment')
                .then(res => setDepartmentList(res.data.data))
        } catch (error) {

        }
    }

    const handleShowSearchModal = (index) => {
        setIndext(index)
        setShowSearchModal(true)
    }

    const handleCloseSearchModal = () => {
        setShowSearchModal(false)
    }

    //Close New Code 


    const consumpTionList = [
        { value: "SRS", label: "Department / Other" },
        { value: 'PIS', label: "Production" },
    ]

    useEffect(() => {
        dispatch(fetchAllItemList())
        fetchAllStoreList()
        fetchProduct()
        getDepartment()
        // fetchPartner()
        // fetchTrnList()
    }, [])

    useEffect(() => {
        // console.log("anup")
        fetchTrnList()
    }, [consumption?.value])

    const handleTranDate = (trDate) => {
        setTransactionDate(trDate)
    };

    const validation = (newComponent) => {
        if (requisitionFor === "") {
            toast.error("Please Fill The Requisition For Field", toastOptions);
            return false;
        }
        if (requisitionTo?.label === "") {
            toast.error("Please Fill The Requisition To Field", toastOptions);
            return false;
        }
        // console.log(newComponent)
        const isValid = newComponent.every((item) => {
            if (item.itemDesc === "") {
                toast.error("Please select an Item", toastOptions);
                return false;
            }
            // else if (item.unit === '') {
            //     toast.error("Please select an Unit", toastOptions);
            //     return false;
            // }
            else if (item.storeCode === '') {
                toast.error("Please enter Store Name", toastOptions);
                return false;
            }
            else if (item.quantity === '') {
                toast.error("Please enter Quantity", toastOptions);
                return false;
            }
            else if (item.actualPurchaseAmount === '') {
                toast.error("Please enter Actual Purchase Amount", toastOptions);
                return false;
            } else if (item.isSerial === 1 && !item?.itemSerial) {
                toast.error("Please enter Serial number", toastOptions);
                return false;
            }
            return true;
        });
        return isValid
    }

    const addRow = () => {
        const newComponent = [...materialComponent];
        const isValid = validation(newComponent)

        if (isValid) {
            newComponent.push({
                itemName: '',
                unit: '',
                quantity: '',
                storeCode: '',
            });
            setMaterialComponent(newComponent);
        };
        setselectedStoreValues([])
    };


    const removeRow = (index) => {
        const updatedRows = [...materialComponent];
        updatedRows.splice(index, 1);
        setMaterialComponent(updatedRows);

        const updatedselectedTranValues = [...selectedTranValues];
        updatedselectedTranValues.splice(index, 1);
        setselectedTranValues(updatedselectedTranValues);
    };

    const handleAccountCodeChange = (event, index) => {
        const selectedTranId = event.value;
        const selectedAccount = allItemList.find((item) => item.id === selectedTranId);

        const updatedselectedTranValues = [...selectedTranValues];
        updatedselectedTranValues[index] = event;
        setselectedTranValues(updatedselectedTranValues);

        setSelectedIndex(index);

        if (selectedAccount) {
            // Dispatch getCurrentStockRequest action
            // dispatch(getCurrentStockRequest(selectedAccount.itemDisplayName));
            const updatedRows = [...materialComponent];
            updatedRows[index].itemID = selectedAccount.id;
            updatedRows[index].itemName = selectedAccount.itemDisplayName;
            updatedRows[index].unit = selectedAccount.uom;
            updatedRows[index].isSerial = selectedAccount.isSerial;
            setMaterialComponent(updatedRows);
        }

        // if (materialComponent[index]?.voucherDetails?.length) {
        //     const updatedRows = [...materialComponent];
        //     updatedRows[index].voucherDetails = [];
        //     setMaterialComponent(updatedRows);
        // }

    };


    const handleChange = (event, index, field) => {
        setSelectedIndex(index)
        if (field === "storeCode") {
            setselectedStoreValues(event)
            const data = event.value;
            const updatedRows = [...materialComponent];
            updatedRows[index][field] = data;
            setMaterialComponent(updatedRows);
        } else {
            const { value } = event.target;
            const updatedRows = [...materialComponent];
            updatedRows[index][field] = value;
            setMaterialComponent(updatedRows);
        }
    };

    useEffect(() => {
        // Whenever currentStock changes, update materialComponent
        if (currentStock !== null && selectedIndex !== null) {
            const updatedRows = [...materialComponent];
            updatedRows[selectedIndex].stock = currentStock;
            setMaterialComponent(updatedRows);
        }
    }, [currentStock]);


    useEffect(() => {
        // Whenever selectedStoreValues?.value changes, dispatch getCurrentStockRequest
        if (materialComponent[selectedIndex]?.itemID && materialComponent[selectedIndex]?.storeCode) {
            dispatch(getCurrentStockRequest({
                itemID: materialComponent[selectedIndex]?.itemID,
                storeID: materialComponent[selectedIndex]?.storeCode
            }));
        }
    }, [materialComponent[selectedIndex]?.itemID, materialComponent[selectedIndex]?.storeCode]);


    const calculateTotalPrice = () => {
        let totalPrice = 0;
        for (let i = 0; i < materialComponent.length; i++) {
            totalPrice += materialComponent[i].quantity * materialComponent[i].rate;
        }
        return totalPrice.toFixed(4);
    };



    const handleTableChange = (value) => {
        contentRef.current = value;
        // console.log(value)
    };



    const saveReqIssue = () => {
        if (!validation(materialComponent)) { return }

        const addInfo = contentRef.current.match(/<table[^>]*>[\s\S]*?<\/table>/i)[0];

        const data = {

            data: {
                invTransactionHdr: {
                    id: 0,
                    trnCode: consumption?.value,
                    maxSl: 0,
                    trnRefNo: "",
                    trnStatus: 1,
                    trnDate: transactionDate,
                    createDate: transactionDate,
                    createBy: userID,
                    updateDate: transactionDate,
                    updateBy: userID,
                    trnPartyID: 0,
                    issueStoreId: 0,
                    receiveStoreId: 0,
                    requisitionFor: requisitionFor,
                    requisitionTo: requisitionTo?.label,
                    requisitionBy: userID,
                    requisitionDate: reqDate,
                    issueBy: userID,
                    issueDate: issueDate,
                    remarks: remarks,
                    additionalInfo: addInfo,
                    userCode: userID
                },
                invTransactionDet: materialComponent.map((item) => {
                    const totalPrice = item.quantity * item.rate;
                    return {
                        hdrID: 0,
                        lno: 0,
                        trnTypeId: consumption?.value === 'SRS' ? 2 : 4,
                        trnType: "IS",
                        trnCode: consumption?.value,
                        itemID: item.itemID,
                        storeID: item.storeCode,
                        linQty: +item.quantity,
                        linRate: +item.rate,
                        linAmount: 0,
                        invRate: 1,
                        invAmount: totalPrice,
                        itemSerial: item?.itemSerial ? item?.itemSerial : ""
                    }
                })
            }
        }

        // setMaterialComponent([initialRow])
        // setselectedTranValues([{}])
        // setselectedStoreValues([{ label: '', value: '' }])
        // setSelectedIndex(null)


        if (!data.data.invTransactionHdr.trnCode) {
            toast.error("Please select consumption", toastOptions);
            return false;
        }


        // console.log("Data ---------->>>", data)

        Post('/api/InvTransaction/InsertInvTransaction', data)
            .then(res => {
                if (res.data.success = true) {

                    if (res.data.success = true) {
                        // console.log(res.data)
                        setResponseId(res.data.data)
                        setError(res?.data?.errorMessage)
                        setResponseModal(!responseModal)
                        // setMaterialComponent([initialRow])
                        // setselectedTranValues([{}])
                        // setselectedStoreValues([{ label: '', value: '' }])
                        // setSelectedIndex(null)
                    }
                    if (res.data.success = true && res.data.errorMessage === null) {
                        setMaterialComponent([initialRow])
                        setselectedTranValues([{}])
                        setselectedStoreValues([{ label: '', value: '' }])
                        setSelectedIndex(null)
                        setRequisitionFor('')
                        setRequisitionTo(null)
                        setRemarks('')
                        setContent(null)
                        fetchTrnList()
                    }

                }
            }
            )
            .catch(err => console.log(err))

    };

    const responseModalClose = (e) => {
        setResponseModal(false)
        setError(null)
    }

    const getMrrInfo = () => {
        const data = { data: mrrRef.trim() }
        try {
            Post('/api/InvTransaction/GetTransactionByTrnRef', data)
                .then((res) => {
                    // console.log("Res ----------->>>>", res.data.data)
                    if (res.data.success === true) {
                        const newMaterialComponent = res?.data?.data[0]?.invTransactionDet.map((item) => {
                            return {
                                itemID: item.itemID,
                                itemName: '',
                                unit: '',
                                stock: item.currentStock,
                                isSerial: item.itemSerial === "" ? false : true,
                                itemSerial: item.itemSerial !== '' ? item.itemSerial : '',
                                quantity: item.linQty,
                                storeCode: item.storeID
                            }
                        })
                        setMaterialComponent(newMaterialComponent)

                    } else if (res.data.success === false) {
                        toast.error("No Data Found ith this Reference", toastOptions)
                    } else {
                        toast.warn("Something went wrong", toastOptions)
                    }
                })
        } catch (error) {
            console.log("error", error)
        }
    };


    useEffect(() => {
        authorization(77)
    }, [])

    // console.log('Final', requisitionTo)
    // console.log('re', reqDate)

    return (
        <div className='custom-fontSize'>

            <Container fluid>

                {/* <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center">MATERIAL RECEIVE FROM PURCHASE SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card> */}

                {/* <Card>
                    <CardBody>
                        <Row className='mb-3 '>
                            <Col sm="12" md="2" lg="2">
                                <Label for="transactionDate" size='lg'>Transaction Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(e, date) => handleTranDate(date)}
                                        onClose={(e, date) => handleTranDate(date)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={transactionDate}
                                    />
                                </InputGroup>
                            </Col>

                            <Col sm="12" md="2" lg="2">
                                <Label for="consumption" size='lg'>Consumption</Label>
                                <Select
                                    styles={customStyles}
                                    onChange={(event) => setConsumption(event)}
                                    options={consumpTionList?.map((item) => {
                                        return {
                                            label: item.label,
                                            value: item.value
                                        };
                                    })}
                                    // autoFocus
                                    placeholder="Select Item Name"
                                    value={consumption}
                                />
                            </Col>

                            <Col sm="12" md="2" lg="2" >
                                <Label for="issue" size='lg'>Issue To</Label>
                                <Select
                                    styles={customStyles}
                                    onChange={(event) => setRequisitionTo(event)}
                                    options={departmentList?.map((item) => {
                                        return {
                                            label: item.departmentName,
                                            value: item.id
                                        };
                                    }) || []}
                                    // onInputChange={(e) => setRequisitionTo(e)}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setRequisitionTo({ label: e.target.value, value: e.target.value })
                                        }
                                    }}
                                    placeholder="Select Issue To"
                                    value={requisitionTo}
                                />
                            </Col>

                            <Col sm="12" md="2" lg="2">
                                <Label for="issue" size='lg'>Issue Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(e, date) => setIssueDate(date)}
                                        onClose={(e, date) => setIssueDate(date)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={issueDate}
                                    />
                                </InputGroup>
                            </Col>


                            <Col sm="12" md="3" lg="3" >
                                <Label for="additionalRequirements" size='lg'>Additional Information</Label>
                                <div style={{ height: '180px', overflow: 'scroll' }}>
                                    <JoditEditor
                                        value={content}
                                        onChange={handleTableChange}
                                        config={{
                                            toolbar: false,
                                            statusbar: false,
                                        }}
                                    />
                                </div>
                            </Col>


                        </Row>

                        <Row style={{ marginTop: '-150px' }}>

                            <Col sm="12" md="2" lg="2">
                                <Label for="requisition" size='lg'>Requisition Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(e, date) => setReqDate(date)}
                                        onClose={(e, date) => setReqDate(date)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={reqDate}
                                    />
                                </InputGroup>
                            </Col>

                            <Col sm="12" md="3" lg="3">
                                <Label for="requisition for" size='lg'>Requisition For</Label>
                                <textarea
                                    className="form-control"
                                    id="requisition for"
                                    rows="4"
                                    placeholder="Requisition for"
                                    value={requisitionFor}
                                    onChange={(e) => setRequisitionFor(e.target.value)}
                                ></textarea>

                            </Col>

                            <Col sm="12" md="3" lg="3">
                                <Label for="remarks" size='lg'>Remarks</Label>
                                <textarea
                                    className="form-control"
                                    id="remarks"
                                    rows="4"
                                    placeholder="Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                            </Col>
                        </Row>

                    </CardBody>
                </Card> */}

                {/* <Card>
                    <CardBody>

                        <Row className='justify-content-center'>
                            <Col sm="12" md="2" lg="2">
                                <Label for="mrrRef" size='lg' className='fw-bolder'>Get MRR Info By Ref: </Label>
                            </Col>
                            <Col sm="12" md="4" lg="4">
                                <InputGroup>
                                    <Input
                                        type="text"
                                        name="mrrRef" id="mrrRef"
                                        placeholder="Enter MRR Reference Number"
                                        value={mrrRef}
                                        onChange={(e) => setMrrRef(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>

                            <Col sm="12" md="2" lg="2">
                                <Button color="primary" onClick={getMrrInfo}>Get Details</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card> */}

                <Card>
                    <CardBody>
                        <Row>
                            <Col md={4} sm={12} lg={2}>
                                <Label for="transactionDate" size='lg'>Transaction Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(e, date) => handleTranDate(date)}
                                        onClose={(e, date) => handleTranDate(date)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={transactionDate}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4} sm={12} lg={2}>
                                <Label for="consumption" size='lg'>Consumption</Label>
                                <Select
                                    styles={customStyles}
                                    onChange={(event) => setConsumption(event)}
                                    options={consumpTionList?.map((item) => {
                                        return {
                                            label: item.label,
                                            value: item.value
                                        };
                                    })}
                                    // autoFocus
                                    placeholder="Select Item Name"
                                    value={consumption}
                                />
                            </Col>
                            <Col md={4} sm={12} lg={2}>
                                <Label for="issue" size='lg'>Issue To</Label>
                                <Select
                                    styles={customStyles}
                                    onChange={(event) => setRequisitionTo(event)}
                                    options={departmentList?.map((item) => {
                                        return {
                                            label: item.departmentName,
                                            value: item.id
                                        };
                                    }) || []}
                                    // onInputChange={(e) => setRequisitionTo(e)}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setRequisitionTo({ label: e.target.value, value: e.target.value })
                                        }
                                    }}
                                    placeholder="Select Issue To"
                                    value={requisitionTo}
                                />
                            </Col>
                            <Col md={4} sm={12} lg={3}>
                                <Label for="issue" size='lg'>Issue Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(e, date) => setIssueDate(date)}
                                        onClose={(e, date) => setIssueDate(date)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={issueDate}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4} sm={12} lg={3}>
                                <Label for="requisition" size='lg'>Requisition Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(e, date) => setReqDate(date)}
                                        onClose={(e, date) => setReqDate(date)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={reqDate}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4} sm={12} lg={3}>
                                <Label for="additionalRequirements" size='lg'>Additional Information</Label>
                                <div style={{ height: '180px', overflow: 'scroll' }}>
                                    <JoditEditor
                                        value={content}
                                        onChange={handleTableChange}
                                        config={{
                                            toolbar: false,
                                            statusbar: false,
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col md={4} sm={12} lg={3}>
                                <Label for="remarks" size='lg'>Remarks</Label>
                                <textarea
                                    className="form-control"
                                    id="remarks"
                                    placeholder="Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                            </Col>
                            <Col md={4} sm={12} lg={3}>
                                <Label for="requisition for" size='lg'>Requisition For</Label>
                                <textarea
                                    className="form-control"
                                    id="requisition for"
                                    placeholder="Requisition for"
                                    value={requisitionFor}
                                    onChange={(e) => setRequisitionFor(e.target.value)}
                                ></textarea>
                            </Col>
                            <Col md={4} sm={12} lg={3}>
                                <Label for="mrrRef" size='lg' className='fw-bolder'>Get MRR Info By Ref: </Label>
                                <InputGroup>
                                    <Input
                                        type="text"
                                        name="mrrRef" id="mrrRef"
                                        placeholder="Enter MRR Reference Number"
                                        value={mrrRef}
                                        onChange={(e) => setMrrRef(e.target.value)}
                                    />
                                </InputGroup>
                                <Button color="primary" onClick={getMrrInfo} size='lg' className='mt-3'>Get Details</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row className='mb-3'>
                            <div className="table-responsive-sm">
                                <table className="table table-striped table-bordered table-sm" width="100%">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "10px" }}>S/N</th>
                                            <th className="col-3">Item Code and Name</th>
                                            <th className="col-2">Unit</th>
                                            <th className="col-2">Store Name</th>
                                            <th className="col-1">Current Stock</th>
                                            <th className="col-1">Quantity</th>
                                            <th className="col-2">Serial</th>
                                            {/* <th className="col-1">Rate</th>
                                            <th className="col-1">Total Price</th>
                                            <th className="col-1">Serial</th> */}
                                            <th style={{ width: '30px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            materialComponent?.map((row, index) => {
                                                {/* console.log("row ----------->>>>>>>>>>>", row) */ }

                                                return (
                                                    <tr key={index}>
                                                        <td className='text-center'>{index + 1}</td>
                                                        <td>
                                                            <Row>
                                                                <Col md={11}>
                                                                    <Select
                                                                        styles={customStyles}
                                                                        onChange={(event) => handleAccountCodeChange(event, index)}
                                                                        options={productData?.map((item) => {
                                                                            return {
                                                                                label: item.itemCode + " : " + item?.itemDesc,
                                                                                value: item.id
                                                                            };
                                                                        })}
                                                                        autoFocus
                                                                        placeholder="Select Item Name"
                                                                        value={
                                                                            selectedTranValues[index]
                                                                                ? selectedTranValues[index]
                                                                                :
                                                                                productData.map((item) => {
                                                                                    if (item.id === materialComponent[index]?.itemID) {
                                                                                        return {
                                                                                            label: item.itemCode + " : " + item?.itemDesc,
                                                                                            value: item.id
                                                                                        }
                                                                                    }
                                                                                })
                                                                        }
                                                                    />
                                                                    <p className='m-0'>
                                                                        {
                                                                            selectedTranValues?.[index]?.label ||
                                                                            productData?.map((item) => {
                                                                                if (item.id === materialComponent[index]?.itemID) {
                                                                                    return item.itemCode + " : " + item.itemDesc
                                                                                }
                                                                            })
                                                                        }
                                                                    </p>
                                                                </Col>
                                                                <Col md={1}
                                                                    className='mt-2'
                                                                    style={{ marginLeft: '-19px' }}
                                                                >
                                                                    <TbSearch
                                                                        size={20}
                                                                        color='#14A44D'
                                                                        cursor={"pointer"}
                                                                        onClick={() => handleShowSearchModal(index)}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </td>


                                                        <td>
                                                            <input
                                                                type="text"
                                                                name='unit'
                                                                className="form-control"
                                                                placeholder="Unit"
                                                                onChange={(event) => handleChange(event, index, 'unit')}
                                                                value={row.unit ? row.unit : productData.filter(item => item.id === materialComponent[index]?.itemID)[0]?.uom}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                styles={customStyles}
                                                                onChange={(event) => handleChange(event, index, 'storeCode')}
                                                                options={allStoreList.map((item) => {
                                                                    return {
                                                                        label: item.storeCode,
                                                                        value: item.storeID
                                                                    };
                                                                })}
                                                                placeholder="Select Store Name"
                                                                name='storeCode'
                                                                value={
                                                                    selectedStoreValues[index] ||
                                                                    allStoreList.map((item) => {

                                                                        if (item.storeID === materialComponent[index]?.storeCode) {
                                                                            return {
                                                                                label: item.storeCode,
                                                                                value: item.storeID
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name='currentStock'
                                                                className="form-control text-end"
                                                                placeholder="Current Stock"
                                                                // onChange={(event) => handleChange(event, index, 'currentStock')}
                                                                value={row?.stock}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                name='quantity'
                                                                className="form-control text-end"
                                                                placeholder="Quantity"
                                                                onChange={(event) => handleChange(event, index, 'quantity')}
                                                                onWheel={(event) => event.target.blur()}
                                                                value={row.quantity}
                                                            />
                                                        </td>
                                                        {
                                                            row.isSerial === true ?
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name='itemSerial'
                                                                        className="form-control"
                                                                        placeholder="Serial"
                                                                        onChange={(event) => handleChange(event, index, 'itemSerial')}
                                                                        value={
                                                                            row?.itemSerial ||
                                                                            materialComponent[index]?.itemSerial
                                                                        }
                                                                    />
                                                                </td>
                                                                :
                                                                <td></td>
                                                        }
                                                        <td>
                                                            <button className="btn btn-danger" onClick={() => removeRow(index)}>
                                                                -
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                    <tfoot className='bg-light'>
                                        {/* <tr>
                                            <td colSpan="1"></td>
                                            <td colSpan="6" className="text-center fw-bold">
                                                Total Price: {calculateTotalPrice()}
                                            </td>
                                        </tr> */}
                                    </tfoot>
                                </table>
                                <Col className="text-end">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={addRow}
                                    >
                                        +
                                    </button>
                                </Col>
                            </div>
                        </Row>
                        <Row style={{ zIndex: -10 }}>
                            <Col className="text-center" >
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg fw-bold"
                                    onClick={saveReqIssue}
                                >
                                    Save Requisition & Issue
                                </button>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

            </Container>


            <ToastContainer />

            <SearchItemSelectModal
                allItemList={allItemList}
                handleCloseSearchModal={handleCloseSearchModal}
                show={showSearchModal}
                handleAccountCodeChange={handleAccountCodeChange}
                indext={indext}
            />

            <CmnSaveEditResponseModal
                show={responseModal}
                responseModalClose={responseModalClose}
                modalTitle={"Saved Material Requisition And Issue"}
                responseId={responseId}
                error={error}
                nvurl={'/material-requisition-and-issue'}
            />
        </div>
    )
}

export default MaterialRequisitionAndIssue