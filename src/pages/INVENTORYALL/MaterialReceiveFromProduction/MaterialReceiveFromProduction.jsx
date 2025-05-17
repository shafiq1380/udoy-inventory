import React, { useEffect, useId, useRef, useState } from 'react'
import { Container, Card, CardBody, Row, Col, Label, InputGroup, CardHeader } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { fetchAllItemList } from '../../../store/InventoryItemList/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../../utils/https';
import { getCurrentStockRequest } from '../../../store/current-stock/actions';

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

const MaterialReceiveFromProduction = () => {

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
        itemSerial: '',
        quantity: '',
        rate: '',
        storeCode: '',
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
    const [remarks, setRemarks] = useState('');


    const [selectedTranValues, setselectedTranValues] = useState([]);
    const [selectedStoreValues, setselectedStoreValues] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [allStoreList, setAllStoreList] = useState([]);
    const [allPartnerList, setAllPartnerList] = useState([]);
    const [selectPartner, setSelectPartner] = useState(null)


    // Aditional information
    const [content, setContent] = useState();
    const contentRef = useRef(content);

    //response modal after submit the from data
    const [responseModal, setResponseModal] = useState(false);
    const [responseId, setResponseId] = useState(null);
    const [error, setError] = useState(null)


    const fetchTrnList = () => {
        Post('/api/v1/InvTransaction/GetTransactionTypeList')
            .then((res) => {
                // console.log("res", res?.data?.data.find(item => item.trnCode === 'MRR'))
                const data = res?.data?.data?.find(item => item.trnCode === 'PMR')?.trnAddValFormat
                setContent(data)
                // console.log(data)
            })
    };


    const fetchAllStoreList = () => {
        Post('/api/v1/InvTransaction/GetStorePermissionByUser', { data: userID })
            .then((res) => {
                // console.log("res", res)
                setAllStoreList(res.data.data)
            })
    };
    const fetchPartner = () => {
        Post('/api/v1/PartnerManagement/GetAllPartner', { data: 0 })
            .then((res) => {
                // console.log("res", res)
                setAllPartnerList(res.data.data)
            })
    };



    // new code for search item list for purchase requisition
    const [productData, setProdutDate] = useState([])
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [indext, setIndext] = useState(null)


    const fetchProduct = () => {
        Post('/api/v1/Product/GetAllItemSearch')
            .then((res) => {
                if (res.data.success === true) {
                    setProdutDate(res.data.data)
                }
            })
    };

    const handleShowSearchModal = (index) => {
        setIndext(index)
        setShowSearchModal(true)
    }

    const handleCloseSearchModal = () => {
        setShowSearchModal(false)
    }

    //Close New Code 

    useEffect(() => {
        dispatch(fetchAllItemList())
        fetchAllStoreList()
        fetchPartner()
        fetchTrnList()
        fetchProduct()
    }, [])

    const handleTranDate = (trDate) => {
        setTransactionDate(trDate)
    };

    const validation = (newComponent) => {
        // console.log(newComponent)
        const isValid = newComponent.every((item) => {
            if (item.itemDesc === "") {
                toast.error("Please select an Item", toastOptions);
                return false;
            }
            else if (item.unit === '') {
                toast.error("Please select an Unit", toastOptions);
                return false;
            } else if (item.storeCode === '') {
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
                rate: '',
                totalPrice: '',
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
            const updatedRows = [...materialComponent];
            updatedRows[index].itemID = selectedAccount.id;
            updatedRows[index].itemName = selectedAccount.itemDisplayName;
            updatedRows[index].unit = selectedAccount.uom;
            updatedRows[index].isSerial = selectedAccount.isSerial;
            setMaterialComponent(updatedRows);
        }

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



    const savePurchaseRequisition = () => {
        if (!validation(materialComponent)) { return }

        const addInfo = contentRef.current.match(/<table[^>]*>[\s\S]*?<\/table>/i)[0];

        const data = {
            data: {
                invTransactionHdr: {
                    id: 0,
                    trnCode: "PMR",
                    maxSl: 0,
                    trnRefNo: "",
                    trnStatus: 1,
                    trnDate: transactionDate,
                    createDate: transactionDate,
                    createBy: userID,
                    updateDate: transactionDate,
                    updateBy: userID,
                    trnPartyID: selectPartner?.value,
                    issueStoreId: 0,
                    receiveStoreId: 0,
                    requisitionFor: null,
                    requisitionTo: null,
                    requisitionBy: null,
                    requisitionDate: transactionDate,
                    issueBy: userID,
                    issueDate: transactionDate,
                    remarks: remarks,
                    additionalInfo: addInfo,
                    userCode: userID
                },
                invTransactionDet: materialComponent.map((item) => {
                    const totalPrice = item.quantity * item.rate;
                    return {
                        hdrID: 0,
                        lno: 0,
                        trnTypeId: 5,
                        trnType: "RC",
                        trnCode: "PMR",
                        itemID: item.itemID,
                        storeID: item.storeCode,
                        linQty: +item.quantity,
                        linRate: +item.rate || 1,
                        linAmount: 0,
                        invRate: 1,
                        invAmount: totalPrice,
                        itemSerial: item.itemSerial ? item.itemSerial : ""
                    }
                })
            }
        }

        Post('/api/v1/InvTransaction/InsertInvTransaction', data)
            .then(res => {
                if (res.data.success = true) {
                    if (res.data.success = true) {
                        // console.log(res.data)
                        setResponseId(res.data.data)
                        setError(res?.data?.errorMessage)
                        setResponseModal(!responseModal)
                    }
                    if (res.data.success = true && res.data.errorMessage === null) {
                        setMaterialComponent([initialRow])
                        setselectedTranValues([{}])
                        setselectedStoreValues([{ label: '', value: '' }])
                        setSelectedIndex(null)
                        setRemarks('')
                        setSelectPartner({})
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

    useEffect(() => {
        authorization(79)
    }, [])



    return (
        <div className="mt-3 custom-fontSize">

            <Container fluid>
                <Card>
                    <CardBody>
                        <Row className='mb-3 '>
                            <Col sm="12" md="6" lg="4">
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

                            <Col sm="12" md="6" lg="4" >
                                <Label for="additionalRequirements" size='lg'>Aditional Information</Label>
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
                            <Col sm="12" md="4" lg="4">
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
                                            <th className="col-1">Unit</th>
                                            <th className="col-2">Store Name</th>
                                            <th className="col-1">Current Stock</th>
                                            <th className="col-1">Quantity</th>
                                            <th className="col-1">Rate</th>
                                            <th className="col-1">Total Price</th>
                                            <th className="col-1">Serial</th>

                                            <th style={{ width: '30px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            materialComponent?.map((row, index) => {

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
                                                                        value={selectedTranValues[index]}
                                                                    />
                                                                    <p className='m-0'>{selectedTranValues?.[index]?.label}</p>
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
                                                                value={row.unit}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                styles={customStyles}
                                                                onChange={(event) => handleChange(event, index, 'storeCode')}
                                                                options={allStoreList?.map((item) => {
                                                                    return {
                                                                        label: item.storeCode,
                                                                        value: item.storeID
                                                                    };
                                                                })}
                                                                placeholder="Select Store Name"
                                                                name='storeCode'
                                                                value={selectedStoreValues[index]}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name='currentStock'
                                                                className="form-control"
                                                                placeholder="Current Stock text-end"
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
                                                        <td>
                                                            <input
                                                                type="number"
                                                                name='rate'
                                                                className="form-control text-end"
                                                                placeholder="Rate"
                                                                onChange={(event) => handleChange(event, index, 'rate')}
                                                                onWheel={(event) => event.target.blur()}
                                                                value={row.rate}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                name='totalPrice'
                                                                className="form-control text-end"
                                                                placeholder="Total Price"
                                                                value={(row.quantity * row.rate).toFixed(4)}
                                                                readOnly
                                                            />
                                                        </td>
                                                        {
                                                            row.isSerial === 1 ?
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name='itemSerial'
                                                                        className="form-control"
                                                                        placeholder="Serial"
                                                                        onChange={(event) => handleChange(event, index, 'itemSerial')}
                                                                        value={row?.itemSerial}
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
                                        <tr>
                                            <td colSpan="5"></td>
                                            <td colSpan="6" className="text-center fw-bold">
                                                Total Price: {calculateTotalPrice()}
                                            </td>
                                        </tr>
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
                                    onClick={savePurchaseRequisition}
                                >
                                    Save Receive Production
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
                modalTitle={"Save Receive Production"}
                responseId={responseId}
                error={error}
                nvurl={'/material-receive-from-production'}
            />
        </div>
    )
}

export default MaterialReceiveFromProduction