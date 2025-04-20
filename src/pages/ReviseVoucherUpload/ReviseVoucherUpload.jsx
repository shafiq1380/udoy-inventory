import React, { useState, useEffect } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Button, Card, CardBody, Container, CardHeader, Row, Col, Label, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReviseVoucherEntryForm } from '../../store/revise-voucher/actions';
import Spinner from '../../components/Common/Spinner';
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { AiOutlineEye } from 'react-icons/ai';
import { fetchAllCoaAccount, fetchVoucherTypeRequest } from '../../store/coa-setup/actions';
import { IoMdArrowRoundBack } from "react-icons/io";
import { addReviseVoucherUpload } from '../../store/revise-voucher-upload/actions';
import { ToWords } from 'to-words';
import { authorization } from '../../components/Common/Authorization';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const ReviseVoucherUpload = () => {

    const { state } = useLocation();
    const data = { data: state }
    const dispatch = useDispatch();
    const history = useNavigate()
    const { loading, allCoaAccounts, allVoucherType } = useSelector(state => state.coaSetupReducer);
    const { success } = useSelector(state => state.reviseVoucherEntryReducer)
    const successMessage = useSelector(state => state.reviseVoucherUploadReducer)
    const { userID } = useSelector(state => state.Login.userInformation)

    // Local State

    const initialRow = {
        coaId: '',
        voucherNarration: '',
        debit: '',
        credit: '',
        analysisRequired: 'N',
    };

    const [voucherDetails, setVoucherDetails] = useState([initialRow]);
    const [selectedVoucherType, setSelectedVoucherType] = useState(null);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
    const [analysisData, setAnalysisData] = useState({});
    const [rowIndex, setRowIndex] = useState(null);
    const [isAnalysisModal, setIsAnalysisModal] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [successModal, setSuccessModal] = useState(false);
    const [receiverName, setReceiverName] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [bankAccNo, setBankAccNo] = useState('');

    useEffect(() => {
        dispatch(addReviseVoucherEntryForm(data))
    }, [dispatch, state])

    useEffect(() => {
        dispatch(fetchAllCoaAccount());
        dispatch(fetchVoucherTypeRequest());
    }, []);

    useEffect(() => {
        if (success) {
            setSelectedVoucherType(success.voucherType)
            setSelectedEnterprise(success.enterpriseId)
            setSelectedDivision(success.divisionId)
            setSelectedEntity(success.entityId)
            setSelectedBusinessUnit(success.businessUnitId)
            setTransactionDate(success.trnDate)
            setReceiverName(success.receiverName)
            setChequeNo(success.chqNumber)
            setBankAccNo(success.bankAccNumber)
            const oldVoucherDetails = Array.isArray(success.voucherDetails)
                ? [...success.voucherDetails]
                : [];
            const newVoucherDetails = oldVoucherDetails.map((itemDetails) => {
                return {
                    coaId: itemDetails.coaId,
                    voucherNarration: itemDetails.voucherNarration,
                    debit: itemDetails.trnType === "D" ? itemDetails.trnAmount.toString() : "",
                    credit: itemDetails.trnType === "C" ? itemDetails.trnAmount.toString() : "",
                    analysisRequired: itemDetails.voucherAnalysis !== null ? "Y" : "N",
                    voucherDetails: itemDetails.voucherAnalysis ? itemDetails.voucherAnalysis.map(item => {
                        return {
                            analTypeId: item.analTypeId,
                            analId: item.analId
                        };
                    }) : [],
                }
            })
            setVoucherDetails(newVoucherDetails);
            // console.log("newVoucherDetails -------->>>", newVoucherDetails)
        }
    }, [success])

    const debitAmount = voucherDetails.reduce((accumulator, current) => Number(accumulator) + Number(current.debit || 0), 0);
    const creditAmount = voucherDetails.reduce((accumulator, current) => Number(accumulator) + Number(current.credit || 0), 0);
    const totalAmount = debitAmount - creditAmount;

    const toWords = new ToWords({
        localeCode: 'en-BD',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: { // can be used to override defaults for the selected locale
                name: 'Taka',
                plural: 'Taka',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paisa',
                    symbol: '',
                },
            }
        }
    });

    const totalDebit = voucherDetails.reduce((total, item) => total + Number(item.debit || 0), 0)
    const totalInWord = toWords.convert(totalDebit)

    const addRow = () => {
        const newRows = [...voucherDetails];
        const isValid = newRows.every((item) => {
            if (item.coaId === "") {
                toast.error("Please select coa code", toastOptions);
                return false;
            }
            if (item.debit === '' && item.credit === '') {
                toast.error("Please enter debit or credit amount", toastOptions);
                return false;
            }
            if (item.debit <= 0 && item.credit <= 0) {
                toast.error("Debit or credit amount must be greater than 0", toastOptions);
                return false;
            }
            return true;
        });

        if (isValid) {
            newRows.push({
                coaId: "",
                voucherNarration: "",
                debit: "",
                credit: "",
                analysisRequired: "N",
            });
            setVoucherDetails(newRows);
        };
    };

    const removeRow = (index) => {
        const updatedRows = [...voucherDetails];
        updatedRows.splice(index, 1);
        setVoucherDetails(updatedRows);
    };

    const handleCoaAccountChange = (event, index) => {
        const selectedAccountCodeId = event.value;
        const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);
        if (selectedAccount) {
            const updatedRows = [...voucherDetails];
            updatedRows[index].coaId = selectedAccountCodeId;
            updatedRows[index].analysisRequired = selectedAccount.analysisRequired;
            setVoucherDetails(updatedRows);
        }

        // if analysisData is select in the same row and dis-select the same row then remove the analysisData where the value is voucherAnalysis
        if (voucherDetails[index]?.voucherDetails?.length) {
            const updatedRows = [...voucherDetails];
            updatedRows[index].voucherDetails = [];
            setVoucherDetails(updatedRows);
        }

    };

    const handleInputChange = (e, index, field) => {
        const input = e.target.value
        if ((input.match(/\./g) || []).length > 1) {
            return;
        }
        const numericValue = input.replace(/[^0-9.]/g, '');

        const updatedRows = [...voucherDetails];
        if (field === 'debit') {
            if (updatedRows[index].trnType === "D") {
                updatedRows[index].trnAmount = numericValue;
            } else {
                updatedRows[index].debit = numericValue;
            }
        } else if (field === 'credit') {
            if (updatedRows[index].trnType === "C") {
                updatedRows[index].trnAmount = numericValue;
            } else {
                updatedRows[index].credit = numericValue;
            }
        } else {
            updatedRows[index][field] = e.target.value;
        }
        setVoucherDetails(updatedRows);
    };

    const handleKeypress = (event) => {
        if (event.key === 'Enter') {
            addRow()
        }
    };

    const showAnalysisData = (analysisData, index, item) => {
        setIsAnalysisModal(!isAnalysisModal);
        const select = item?.voucherDetails?.map((item) => {
            return {
                analTypeId: item.analTypeId,
                analId: item.analId
            }
        });
        setAnalysisData({
            analysisData,
            defaultSelectedAnalysis: voucherDetails[index]?.voucherDetails && select || [],
        });
        setRowIndex(index);
    };

    const onCloseClick = () => {
        setIsAnalysisModal(false)
    };

    const handleAnalysisChange = (item, e, coaId, rowIndex, itemIndex) => {
        const currentRow = voucherDetails[rowIndex];
        // const selectedAnalysisID = Number(e.target.value);
        const selectedAnalysisID = Number(e.value);
        const data = {
            analTypeId: item.analysisTypeID,
            analId: selectedAnalysisID
        };
        if (voucherDetails[rowIndex]?.voucherDetails?.length) {
            voucherDetails[rowIndex].voucherDetails[itemIndex] = data;
        } else {
            voucherDetails[rowIndex].voucherDetails = [data];
        }
        setVoucherDetails(voucherDetails)
    };

    function validateForm() {
        for (let i = 0; i < voucherDetails.length; i++) {
            const row = voucherDetails[i];

            if (!selectedVoucherType) {
                toast.error("Please select voucher type", toastOptions);
                return false;
            };
            if (row.coaId === "") {
                toast.error(`Account Code field cannot be empty in row ${i + 1}`, toastOptions);
                return false;
            };
            if (row.debit === '' && row.credit === '') {
                toast.error(`Debit / Credit amount field cannot be empty in row ${i + 1}`, toastOptions);
                return false;
            };
            if (debitAmount.toFixed(2) !== creditAmount.toFixed(2)) {
                toast.error("Debit and Credit amount must be equal", toastOptions);
                return false;
            };
            if (row.debit !== '' && row.debit < 0) {
                toast.error("Debit amount cannot be negative", toastOptions);
                return false;
            };
            if (row.credit !== '' && row.credit < 0) {
                toast.error("Credit amount cannot be negative", toastOptions);
                return false;
            };
            if (remarks === '') {
                toast.error("Please enter remarks", toastOptions);
                return false;
            };
        }
        return true;
    };

    const reviseVouchers = () => {
        if (validateForm()) {
            const data = {
                data: {
                    id: success.id,
                    voucherType: selectedVoucherType,
                    voucherRef: success.voucherRef,
                    enterpriseId: 1,
                    divisionId: 1,
                    entityId: 1,
                    businessUnitId: 1,
                    trnDate: transactionDate,
                    userID: userID,
                    remarks: remarks,
                    receiverName: receiverName,
                    chqNumber: chequeNo || "",
                    bankAccNumber: bankAccNo || "",
                    voucherDetails: voucherDetails.map((item) => {
                        const coaId = item.coaId;
                        return {
                            coaId: coaId,
                            voucherNarration: item.voucherNarration,
                            trnType: item.debit ? "D" : item.credit ? "C" : "",
                            trnAmount: item.debit ? item.debit : item.credit ? item.credit : "",
                            chequeNo: "",
                            voucherAnalysis: item.voucherDetails ? item.voucherDetails : [],
                        };
                    }),
                }
            }
            if (data.data.voucherDetails.length === 0) {
                toast.error("Please enter voucher details", toastOptions);
                return;
            } else {
                // console.log("data ---------->>>>>> ", data);
                dispatch(addReviseVoucherUpload(data));
                if (loading === false) {
                    setSuccessModal(true);
                }
            }
        };
    };

    const resetForm = () => {
        setSelectedVoucherType(null);
        setSelectedEnterprise(null);
        setSelectedDivision(null);
        setSelectedEntity(null);
        setSelectedBusinessUnit(null);
        setTransactionDate(new Date().toISOString().slice(0, 10));
        setVoucherDetails([initialRow]);
    };

    useEffect(() => {
        if (successMessage.success) {
            resetForm();
        }
    }, [successMessage])

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };

    //get the default value of analysis Modal
    const getDefaultValues = () => {
        const defaults = analysisData.defaultSelectedAnalysis?.map(({ analTypeId, analId }) => {
            // console.log(analTypeId)
            const foundItem = analysisData.analysisData?.analysisList?.find(
                (item) => item.analysisTypeID === analTypeId);

            if (foundItem) {
                const label = foundItem.itemList?.find((subItem) => subItem.analysisID === analId)
                return {
                    value: foundItem.analysisTypeID, // You can customize this based on your data structure
                    label: `${label.analysisCode} : ${label.analysisName}`
                };
            }
            return foundItem;
        });
        return defaults;
    };

    const selectDefaults = getDefaultValues()

    const filterAnalysis = allCoaAccounts.filter(item => item?.analysisList?.length > 0)

    const renderItem = (analTypeId, analId) => {
        const foundItem = filterAnalysis.map(item =>
            item?.analysisList?.find((item) => item.analysisTypeID === analTypeId))

        const label = foundItem.map(item => {
            const foundItem = item?.itemList?.find((item) => item.analysisID === analId);
            return foundItem !== undefined ? [foundItem] : [];
        }).flat();

        return <li>{`${label[0]?.analysisCode} : ${label[0]?.analysisName} `}</li>
    };

    //handle arrow button 
    const handleArrowBtn = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    //Authorization check
    useEffect(() => {
        authorization(20)
    }, [])


    return (
        <div className="page-content">

            {
                loading ?
                    <Spinner />
                    :
                    <Container fluid>
                        <div>
                            <Breadcrumbs title="Transaction" breadcrumbItem="Voucher / Revise Voucher Upload" />
                        </div>
                        <Card>
                            <CardBody>
                                <Button
                                    type="button"
                                    color="success"
                                    className="btn-rounded px-3 mb-3"
                                    onClick={() => history(-1)}
                                >
                                    <IoMdArrowRoundBack size={20} color='white' />
                                </Button>
                                <CardHeader>
                                    <h3 className="text-center">VOUCHER REVISE SCREEN</h3>
                                    <h3 className="text-center ">REF NO: <span className='text-primary fw-bold'>{state}</span></h3>
                                </CardHeader>
                            </CardBody>
                        </Card>

                        {
                            success && success.voucherRef !== null ?

                                <Card>
                                    <CardBody>
                                        <Row>

                                            <Col sm="12" md="12" >

                                                <Col xs="12">
                                                    <Card>
                                                        <CardBody>
                                                            <Row>
                                                                <Col sm="4">
                                                                    {
                                                                        loading === true ?
                                                                            <Spinner />
                                                                            :
                                                                            <div>
                                                                                <Label className="control-label fw-bolder"> Select Voucher Type </Label>
                                                                                <select
                                                                                    className="form-control"
                                                                                    value={selectedVoucherType || success && success.voucherType}
                                                                                    onChange={(e) => setSelectedVoucherType(e.target.value)}
                                                                                    disabled
                                                                                >
                                                                                    <option value="">Select Voucher Type</option>
                                                                                    {allVoucherType.map((item, index) => (
                                                                                        <option key={index} value={item.jrnType}>
                                                                                            {item.jrnDescription}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>

                                                                                {success && success.voucherType === "CV" &&
                                                                                    <>
                                                                                        <Label className="control-label fw-bolder mt-2" for="receiverName">Receiver Name</Label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="receiverName"
                                                                                            name="receiverName"
                                                                                            placeholder="Enter Receiver Name"
                                                                                            onChange={(e) => setReceiverName(e.target.value)}
                                                                                            value={receiverName}
                                                                                        />
                                                                                    </>
                                                                                }

                                                                                {success && success.voucherType === "CQ" &&
                                                                                    <>
                                                                                        <Label className="control-label fw-bolder mt-2" for="receiverName">Receiver Name</Label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="receiverName"
                                                                                            name="receiverName"
                                                                                            placeholder="Enter Receiver Name"
                                                                                            onChange={(e) => setReceiverName(e.target.value)}
                                                                                            value={receiverName}
                                                                                        />

                                                                                        <Label className="control-label fw-bolder mt-2" for="chequeNo">Cheque No</Label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="chequeNo"
                                                                                            name="chequeNo"
                                                                                            placeholder="Enter Cheque No"
                                                                                            onChange={(e) => setChequeNo(e.target.value)}
                                                                                            value={chequeNo}
                                                                                        />

                                                                                        <Label className="control-label fw-bolder mt-2" for="bankAccNo">Bank Account Number</Label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="bankNo"
                                                                                            name="bankNo"
                                                                                            placeholder="Enter Account No"
                                                                                            onChange={(e) => setBankAccNo(e.target.value)}
                                                                                            value={bankAccNo}
                                                                                        />
                                                                                    </>
                                                                                }

                                                                            </div>
                                                                    }
                                                                </Col>
                                                                <Col sm="4">
                                                                    <Label className="control-label  fw-bolder">Transaction Date</Label>
                                                                    <InputGroup>
                                                                        <Flatpickr
                                                                            className="form-control"
                                                                            placeholder="dd M,yyyy"
                                                                            options={{
                                                                                dateFormat: "Y-m-d",
                                                                                altInput: true,
                                                                                altFormat: "d/m/Y",
                                                                                allowInput: true,
                                                                            }}
                                                                            id="date"
                                                                            name="date"
                                                                            onChange={(e, date) => setTransactionDate(date)}
                                                                            onClose={(e, date) => setTransactionDate(date)}
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
                                                                <Col sm="4">
                                                                    <Row>
                                                                        <Col sm="6">
                                                                            <h5 className="fw-bold">Amount - Dr</h5>
                                                                        </Col>
                                                                        <Col sm="6">
                                                                            <h5 className='text-black text-end'>{debitAmount.toFixed(2)}</h5>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col sm="6">
                                                                            <h5 className="fw-bold">Amount - Cr</h5>
                                                                        </Col>
                                                                        <Col sm="6">
                                                                            <h5 className='text-black text-end'>{creditAmount.toFixed(2)}</h5>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col sm="6">
                                                                            <h5 className="fw-bold">Balance</h5>
                                                                        </Col>
                                                                        <Col sm="6">
                                                                            <h5 className={`text-${creditAmount == debitAmount ? "black" : "danger"} text-end`}>{totalAmount.toFixed(2)}</h5>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>

                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                                <Col xs="12" className="over">
                                                    <Card>
                                                        <CardBody>
                                                            <Row>
                                                                <div className="table-responsive-sm">
                                                                    <table className="table table-striped table-bordered table-sm" width="100%">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ width: "10px" }}>S/N</th>
                                                                                <th className="col-4">Select Account Code</th>
                                                                                <th style={{ width: '50px' }}>Analysis</th>
                                                                                <th className="col-3">Particulars</th>
                                                                                <th style={{ width: '150px' }}>Debit (Dr)</th>
                                                                                <th style={{ width: '150px' }}>Credit (Cr)</th>
                                                                                <th style={{ width: '50px' }}>Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                voucherDetails && voucherDetails.map((item, index) => {

                                                                                    const selectedCoaAccount = allCoaAccounts.find((coaAcc) => coaAcc.coaId === item.coaId);

                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <td className="text-center">{index + 1}</td>
                                                                                            <td>
                                                                                                <Select
                                                                                                    styles={customStyles}
                                                                                                    options={allCoaAccounts.map((coaAcc) => ({
                                                                                                        value: coaAcc.coaId,
                                                                                                        label: `${coaAcc.coaCode} : ${coaAcc.coaName}`,
                                                                                                    }))}
                                                                                                    value={selectedCoaAccount ? {
                                                                                                        value: selectedCoaAccount.coaId,
                                                                                                        label: `${selectedCoaAccount.coaCode} : ${selectedCoaAccount.coaName}`
                                                                                                    } : null}
                                                                                                    onChange={(e) => handleCoaAccountChange(e, index)}
                                                                                                />
                                                                                                <p style={{ fontSize: '12px', color: 'gray' }}>
                                                                                                    {
                                                                                                        item.analysisRequired === "Y" ?
                                                                                                            item?.voucherDetails?.map(item =>
                                                                                                                renderItem(item.analTypeId, item.analId))
                                                                                                            : null
                                                                                                    }
                                                                                                </p>
                                                                                            </td>
                                                                                            {
                                                                                                item.analysisRequired === "Y" ?
                                                                                                    <td>
                                                                                                        {
                                                                                                            allCoaAccounts.map((coaAcc, i) => {
                                                                                                                if (coaAcc.coaId === item.coaId) {
                                                                                                                    return (
                                                                                                                        <div key={i}>
                                                                                                                            <AiOutlineEye
                                                                                                                                size={30}
                                                                                                                                color="green"
                                                                                                                                role="button"
                                                                                                                                onClick={() => { showAnalysisData(coaAcc, index, item); }}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    )
                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                    </td>
                                                                                                    :
                                                                                                    <td></td>
                                                                                            }
                                                                                            <td>
                                                                                                <textarea
                                                                                                    className="form-control"
                                                                                                    style={{ height: "30px" }}
                                                                                                    value={item.voucherNarration || item.voucherNarration}
                                                                                                    name="voucherNarration"
                                                                                                    onChange={(event) => handleInputChange(event, index, 'voucherNarration')}
                                                                                                ></textarea>
                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    className="form-control text-end"
                                                                                                    name="debit"
                                                                                                    type="number"
                                                                                                    value={item.trnType === "D" ? item.trnAmount : item.debit > -1 ? item.debit : 0}
                                                                                                    onChange={(event) => handleInputChange(event, index, 'debit')}
                                                                                                    disabled={item.trnType === "C" ? true : item.credit}
                                                                                                    onKeyPress={(event) => handleKeypress(event)}
                                                                                                    onKeyDown={handleArrowBtn}
                                                                                                    onKeyUp={handleArrowBtn}

                                                                                                />
                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    className="form-control text-end"
                                                                                                    name="credit"
                                                                                                    type="number"
                                                                                                    value={item.trnType === "C" ? item.trnAmount : item.credit > -1 ? item.credit : 0}
                                                                                                    onChange={(event) => handleInputChange(event, index, 'credit')}
                                                                                                    disabled={item.trnType === "D" ? true : item.debit}
                                                                                                    onKeyPress={(event) => handleKeypress(event)}
                                                                                                    onKeyDown={handleArrowBtn}
                                                                                                    onKeyUp={handleArrowBtn}
                                                                                                />

                                                                                            </td>

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
                                                                                <td colSpan="3" className="text-center fw-bold">
                                                                                    Total: {""}
                                                                                    {totalDebit > 0 && totalInWord}
                                                                                </td>

                                                                                <td colSpan="1"></td>

                                                                                <td colSpan="1" className="text-end fw-bold">
                                                                                    {debitAmount.toFixed(2)}
                                                                                </td>
                                                                                <td colSpan="1" className="text-end fw-bold">
                                                                                    {creditAmount.toFixed(2)}
                                                                                </td>

                                                                                <td colSpan="1"></td>


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

                                                            <Row>
                                                                <div className="d-flex justify-content-center align-items-center mb-3">
                                                                    <Col sm="12" md="12" lg="6">
                                                                        <div className="d-flex justify-content-center align-items-center">

                                                                            <label className="control-label fw-bolder px-3">Remarks</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Why do you want to revise this voucher?"
                                                                                onChange={(e) => setRemarks(e.target.value)}
                                                                                value={remarks}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </div>
                                                            </Row>
                                                            <Row style={{ zIndex: -10 }}>
                                                                <Col className="text-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary btn-lg fw-bold"
                                                                        onClick={reviseVouchers}
                                                                    >
                                                                        Update Voucher
                                                                    </button>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                                :

                                <Card>
                                    <CardBody>
                                        <CardHeader>
                                            <h3 className="text-center text-danger">No Voucher Found With This Voucher Reference</h3>
                                        </CardHeader>
                                    </CardBody>
                                </Card>
                        }
                    </Container>
            }



            {/* Modal for Analysis Details */}

            <Modal
                isOpen={isAnalysisModal}
                role="dialog"
                autoFocus={true}
                // centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => { setIsAnalysisModal(!isAnalysisModal) }}
                size="lg"
            >
                <div className="modal-content">
                    <button type="button" onClick={() => onCloseClick()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <ModalHeader>{analysisData.analysisData && analysisData.analysisData.coaCode} : {analysisData.analysisData && analysisData.analysisData.coaName}</ModalHeader>
                    <ModalBody>
                        <div>
                            {analysisData.analysisData?.analysisList &&
                                analysisData.analysisData?.analysisList?.map((item, indx) => (
                                    <Card key={indx} value={item.analysisTypeID}>
                                        <CardBody>
                                            <Row>
                                                <Col className='align-self-center'>
                                                    <h5 value={item.analysisTypeID}>
                                                        {indx}: Analysis: {item.analysisTypeName} -&gt;{' '}
                                                    </h5>
                                                </Col>
                                                <Col>
                                                    <Select
                                                        styles={customStyles}
                                                        defaultValue={selectDefaults[indx]}
                                                        onChange={(e) => handleAnalysisChange(item, e, analysisData.analysisData.coaId, rowIndex, indx)}
                                                        options={item.itemList.map((item) => {
                                                            return {
                                                                label: item.analysisCode + " : " + item.analysisName,
                                                                value: item.analysisID
                                                            };
                                                        })}
                                                    />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                ))}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="success" onClick={() => { setIsAnalysisModal(!isAnalysisModal) }}>
                            Done
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>

            {/* Modal for Success Message */}

            <Modal
                isOpen={successModal}
                role="dialog"
                autoFocus={true}
                // centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => { setSuccessModal(!successModal), successMessage.success ? history('/revise-voucher') : null }}
                size="lg"
            >
                <div className="modal-content">
                    <button type="button" onClick={() => { setSuccessModal(!successModal), successMessage.success ? history('/revise-voucher') : null }} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <ModalHeader>Revise Success Modal</ModalHeader>
                    <ModalBody>
                        <div>
                            {
                                successMessage.success &&
                                <div className="text-center">
                                    <h4 className="text-success">{successMessage.success ? 'Voucher has been revise successfully' : null}.</h4>
                                    <h4 className="text-success">Ref No: {successMessage.success}</h4>
                                </div>
                            }

                            {
                                successMessage.error &&
                                <div className="text-center">
                                    <h4 className="text-danger">{successMessage.error}</h4>
                                </div>
                            }

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color={successMessage.success ? 'success' : 'danger'} onClick={() => { setSuccessModal(!successModal), successMessage.success ? history('/revise-voucher') : null }}>
                            {
                                successMessage.success ? 'Done' : 'Close'
                            }
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>

            <ToastContainer />

        </div>
    )
}

export default ReviseVoucherUpload