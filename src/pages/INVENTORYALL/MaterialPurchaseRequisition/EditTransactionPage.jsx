import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Col, Container, InputGroup, Label, Row } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Post } from '../../../utils/https'
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { getCurrentStockRequest } from '../../../store/current-stock/actions'
import { ToastContainer, toast } from 'react-toastify'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import JoditEditor from 'jodit-react';
import { authorization } from '../../../components/Common/Authorization'
import CmnSaveEditResponseModal from '../COMMOMCOMPONENT/CmnSaveEditResponseModal'
import { TbSearch } from 'react-icons/tb'
import SearchItemSelectModal from '../COMMOMCOMPONENT/SearchItemSelectModal'
import useFetchData from '../Hooks/FetchData'
import { TableSkeleton } from '../../../components/Common/Skeleton'

const EditTransactionPage = () => {

    // document.title = "Edit Purchase Requisition | SMART Accounting System";

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
        currentStock: '',
        isSerial: false,
        itemSerial: '',
        quantity: '',
        rate: '',
        storeID: '',
    };

    const dispatch = useDispatch()
    const { state } = useLocation()

    // Global State
    const { currentStock } = useSelector(state => state.currentStockReducer)
    const userID = JSON.parse(localStorage.getItem('userID'))

    // Local State
    const [materialComponent, setMaterialComponent] = useState([]);
    const [tranHeaderData, setTranHeaderData] = useState({})

    const [selectedTranValues, setselectedTranValues] = useState([]);
    const [selectedStoreValues, setselectedStoreValues] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(null);

    // the aditional data
    const [content, setContent] = useState(null);
    const contentRef = useRef(content);
    const [selectPartner, setSelectPartner] = useState(null)


    // Response Modal
    const [responseModal, setResponseModal] = useState(false);
    const [responseId, setResponseId] = useState(null);
    const [error, setError] = useState(null)

    //aditional data change
    const handleTableChange = (value) => {
        contentRef.current = value;
    };

    // new code for search item list for purchase requisition
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [indext, setIndext] = useState(null)

    const { data: allStoreList = [], fetchError } = useFetchData('/api/InvTransaction/GetStorePermissionByUser', { data: userID })
    const { data: productData = [] } = useFetchData('/api/Product/GetAllItemSearch')

    const { data: allPartnerList = [] } = useFetchData('/api/v1/PartnerManagement/GetAllPartner', { data: 0 })
    const { data: allItemList = [] } = useFetchData('/api/Product/GetAllItemList')

    // console.log(allStoreList)


    const handleShowSearchModal = (index) => {
        setIndext(index)
        setShowSearchModal(true)
    }

    const handleCloseSearchModal = () => {
        setShowSearchModal(false)
    }

    //Close New Code 

    const fetchTransactionLitem = () => {
        const data = { data: state.id }
        Post('/api/InvTransaction/GetTransactionByID', data)
            .then((res) => {
                // console.log("res", res.data.data[0]?.invTransactionDet.reverse())
                setMaterialComponent(res?.data?.data[0]?.invTransactionDet?.reverse())
                setTranHeaderData(res?.data?.data[0]?.invTransactionHdr)
                setContent(res?.data?.data[0]?.invTransactionHdr?.additionalInfo)
            })
    };

    // console.log(tranHeaderData)

    useEffect(() => {
        fetchTransactionLitem()
    }, [])

    const handleTranDate = (date) => {
        setTranHeaderData({ ...tranHeaderData, trnDate: date })
    };

    const validation = (newComponent) => {
        // console.log(newComponent)
        const isValid = newComponent.every((item) => {
            if (item.itemDesc === "") {
                toast.error("Please select an Item", toastOptions);
                return false;
            }
            else if (item.unit === '') {
                toast.error("Please select an Item", toastOptions);
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
            }
            else if (item.rate === '') {
                toast.error("Please enter Rate", toastOptions);
                return false;
            } else if (item.isSerial === 1 && !item.itemSerial) {
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
                linQty: '',
                storeID: '',
                invRate: '',
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
        const selectedAccount = allItemList?.find((item) => item.id === selectedTranId);

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



        // if (materialComponent[index]?.voucherDetails?.length) {
        //     const updatedRows = [...materialComponent];
        //     updatedRows[index].voucherDetails = [];
        //     setMaterialComponent(updatedRows);
        // }

    };

    const handleChange = (event, index, field) => {
        setSelectedIndex(index)
        if (field === "storeID") {
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
        // Whenever selectedStoreValues?.value changes, dispatch getCurrentStockRequest
        if (materialComponent[selectedIndex]?.itemID && materialComponent[selectedIndex]?.storeID) {
            dispatch(getCurrentStockRequest({
                itemID: materialComponent[selectedIndex]?.itemID,
                storeID: materialComponent[selectedIndex]?.storeID
            }));
        }
    }, [materialComponent[selectedIndex]?.itemID, materialComponent[selectedIndex]?.storeID], materialComponent);


    useEffect(() => {
        // Whenever currentStock changes, update materialComponent
        if (currentStock !== null && selectedIndex !== null) {
            const updatedRows = [...materialComponent];
            updatedRows[selectedIndex].currentStock = currentStock;
            setMaterialComponent(updatedRows);
        }
    }, [currentStock]);


    // console.log(materialComponent)

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        for (let i = 0; i < materialComponent.length; i++) {
            totalPrice += materialComponent[i].linQty * materialComponent[i].linRate;
        }
        return totalPrice.toFixed(4);
    };

    // console.log(currentStock)

    const updatePurchaseRequisition = () => {

        if (!validation(materialComponent)) { return }

        const addInfo = (contentRef.current && contentRef.current.match(/<table[^>]*>[\s\S]*?<\/table>/i)?.[0]) || '';

        const data = {
            data: {
                invTransactionHdr: { ...tranHeaderData, updateBy: userID, additionalInfo: addInfo, trnPartyID: selectPartner?.value || tranHeaderData.trnPartyID, userCode: userID },
                invTransactionDet: materialComponent.map((item) => {
                    const totalPrice = item.linQty * item.linRate;
                    return {
                        hdrID: 0,
                        lno: 0,
                        trnTypeId: 1,
                        trnType: "RC",
                        trnCode: "MRR",
                        itemID: item.itemID,
                        storeID: item.storeID,
                        linQty: +item.linQty,
                        linRate: +item.linRate,
                        linAmount: 0,
                        invRate: 1,
                        invAmount: totalPrice,
                        itemSerial: item.itemSerial ? item.itemSerial : ""
                    }
                })
            }
        }

        // console.log(data)

        // setMaterialComponent([initialRow])
        // setselectedTranValues([{}])
        // setselectedStoreValues([{ label: '', value: '' }])
        // setSelectedIndex(null)

        Post('/api/InvTransaction/UpdateInvTransaction', data)
            .then(res => {
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
                // if (res.data.success = true && res.data.errorMessage === null) {
                //     setMaterialComponent([initialRow])
                //     setselectedTranValues([{}])
                //     setselectedStoreValues([{ label: '', value: '' }])
                //     setSelectedIndex(null)
                //     // setRemarks('')
                //     setSelectPartner({})
                // }
            }
            )
            .catch(err => console.log(err))

    };


    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };


    // console.log(materialComponent)

    const responseModalClose = (e) => {
        setResponseModal(false)
        setError(null)
    }

    useEffect(() => {
        authorization(76)
    }, [])



    return (
        <div className='custom-fontSize page-content'>
            <Container fluid>
                <Breadcrumb title="Transaction" breadcrumbItem="Edit Material Receive From Purchase" />
                <CardBody>
                    <Button
                        type="button"
                        color="success"
                        className="btn-rounded px-3 mb-3"
                        onClick={() => window.history.back()}
                    >
                        <IoMdArrowRoundBack size={20} color='white' />
                    </Button>
                </CardBody>

                <Card>
                    <CardBody>
                        <Row className='mb-3 '>
                            <Col sm="12" md="6" lg="3">
                                <Label for="transactionDate" size='lg'>Transaction Date</Label>
                                <InputGroup>
                                    <Flatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        options={{
                                            // dateFormat: "d/m/Y",
                                            altInput: true,
                                            altFormat: "d/m/Y",
                                            allowInput: true,
                                        }}
                                        id="date"
                                        name="date"
                                        onChange={(selectedDates, dateStr) => handleTranDate(dateStr)}
                                        onClose={(selectedDates, dateStr) => handleTranDate(dateStr)}
                                        onReady={(selectedDates, dateStr, instance) => {
                                            const inputElement = instance.altInput;
                                            if (inputElement) {
                                                inputElement.addEventListener('focus', (e) => e.target.select());
                                            }
                                        }}
                                        value={tranHeaderData.trnDate}
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm="12" md="6" lg="3">
                                <Label for="transactionDate" size='lg'>Select Partner</Label>
                                <Select
                                    styles={customStyles}
                                    onChange={(event) => setSelectPartner(event)}
                                    options={allPartnerList?.map((item) => {
                                        return {
                                            label: item.id + " : " + item.partnerName,
                                            value: item.id
                                        };
                                    })}
                                    // autoFocus
                                    placeholder="Select Item Name"
                                    value={selectPartner ||
                                        allPartnerList?.map((item) => {
                                            // console.log(item.id, item.partnerName)
                                            if (item.id === tranHeaderData.trnPartyID) {
                                                return {
                                                    label: item.id + " : " + item.partnerName,
                                                    value: item.id
                                                };
                                            }

                                        })}
                                />
                            </Col>

                            <Col sm="12" md="6" lg="4" >
                                <Label for="additionalRequirements" size='lg'>Aditional Information</Label>
                                <div style={{ height: '180px', overflow: 'scroll' }}>
                                    <JoditEditor
                                        value={content}
                                        onChange={handleTableChange}
                                        // onChange={e => console.log(e)}
                                        config={{
                                            toolbar: false,
                                            statusbar: false,
                                        }}
                                    />
                                </div>
                            </Col>

                        </Row>
                        <Row style={{ marginTop: '-150px' }}>
                            <Col sm="12" md="6" lg="6">
                                <Label for="remarks" size='lg'>Remarks</Label>
                                <textarea
                                    className="form-control"
                                    id="remarks"
                                    rows="4"
                                    placeholder="Remarks"
                                    value={tranHeaderData.remarks}
                                    onChange={(e) => setTranHeaderData({ ...tranHeaderData, remarks: e.target.value })}
                                ></textarea>

                            </Col>
                        </Row>

                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        {
                            materialComponent.length > 0 ?
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
                                                        // console.log(row)
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
                                                                                        label: item.itemCode + " : " + item.itemDesc,
                                                                                        value: item.id
                                                                                    };
                                                                                })}
                                                                                // autoFocus
                                                                                placeholder="Select Item Name"
                                                                                value={productData?.map(item => {
                                                                                    if (item.id === row.itemID) {
                                                                                        return {
                                                                                            label: item.itemCode + " : " + item.itemDesc,
                                                                                            value: item.id
                                                                                        };
                                                                                    }
                                                                                })}
                                                                            />
                                                                            <p className='m-0'>{selectedTranValues?.[index]?.label || productData?.map(item => {
                                                                                if (item.id === row.itemID) {
                                                                                    return item.itemCode + " : " + item.itemDesc
                                                                                }
                                                                            })}</p>
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
                                                                        // value={row.unit}
                                                                        value={allItemList?.find(item => item.id === row.itemID)?.uom}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Select
                                                                        styles={customStyles}
                                                                        onChange={(event) => handleChange(event, index, 'storeID')}
                                                                        options={allStoreList?.map((item) => {
                                                                            return {
                                                                                label: item.storeCode,
                                                                                value: item.storeID
                                                                            };
                                                                        })}
                                                                        placeholder="Select Store Name"
                                                                        name='storeID'
                                                                        value={allStoreList?.map(item => {
                                                                            // console.log(row?.storeID)
                                                                            if (item.storeID === row.storeID) {
                                                                                return {
                                                                                    label: item.storeCode,
                                                                                    value: item.storeID
                                                                                };
                                                                            }
                                                                        })}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name='currentStock'
                                                                        className="form-control"
                                                                        placeholder="Current Stock"
                                                                        value={row?.currentStock}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        name='linQty'
                                                                        className="form-control text-end"
                                                                        placeholder="Quantity"
                                                                        onChange={(event) => handleChange(event, index, 'linQty')}
                                                                        onWheel={(event) => event.target.blur()}
                                                                        value={row?.linQty}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        name='linRate'
                                                                        className="form-control text-end"
                                                                        placeholder="Rate"
                                                                        onWheel={(event) => event.target.blur()}
                                                                        onChange={(event) => handleChange(event, index, 'linRate')}
                                                                        value={row?.linRate}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        name='totalPrice'
                                                                        className="form-control text-end"
                                                                        placeholder="Total Price"
                                                                        value={(row?.linQty * row?.linRate).toFixed(4)}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                {
                                                                    row.isSerial === 1 || row?.itemSerial ?
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
                                                    <td colSpan="2"></td>
                                                    <td colSpan="2"></td>
                                                    <td colSpan="2"></td>
                                                    <td colSpan="1"></td>
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
                                :
                                // <CustomSpinner />
                                <TableSkeleton />
                        }

                        {
                            materialComponent.length > 0 &&
                            <Row style={{ zIndex: -10 }}>
                                <Col className="text-center" >
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg fw-bold"
                                        onClick={updatePurchaseRequisition}
                                    >
                                        Update Purchase Requisition
                                    </button>
                                </Col>
                            </Row>
                        }



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
                modalTitle={"Update Purchase Requisition"}
                responseId={responseId}
                error={error}
                nvurl={'/material-receive-from-purchase'}
            />
        </div>
    )
}

export default EditTransactionPage