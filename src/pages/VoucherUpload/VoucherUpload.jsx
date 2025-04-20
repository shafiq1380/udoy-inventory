import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Container, CardHeader, Row, Col, Label, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../../components/Common/Spinner';
import Flatpickr from "react-flatpickr";
import Select from 'react-select'
import { AiOutlineEye } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { fetchAllCoaAccount, fetchVoucherTypeRequest, fetchEnterpriseSetupRequest, fetchDivisionRequest, fetchEntityRequest, fetchBusinessUnitRequest } from '../../store/coa-setup/actions';
import { addVoucherEntryForm } from "../../store/debit-payment-voucher/actions";
import VoucherUploadSuccessModal from './VoucherUploadSuccessModal';

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


const VoucherUpload = () => {

    const initialRow = {
        coaId: '',
        voucherNarration: '',
        debit: '',
        credit: '',
        analysisRequired: 'N',
    };


    const { state } = useLocation();

    // console.log("location state ------->>", state)

    const dispatch = useDispatch();
    const history = useNavigate()

    const { userID } = useSelector(state => state.Login.userInformation)
    // const { loading, allCoaAccounts, allVoucherType, allEnterpriseSetup, allDivision, allEntity, allBusinessUnit } = useSelector(state => state.coaSetupReducer);
    const { loading, allCoaAccounts, allVoucherType } = useSelector(state => state.coaSetupReducer);
    const { success } = useSelector(state => state.voucherEntryReducer);



    const [uploadVoucherDetails, setUploadVoucherDetails] = useState([initialRow]);
    const [selectVoucher, setSelectVoucher] = useState(null);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
    const [analysisData, setAnalysisData] = useState({});
    const [rowIndex, setRowIndex] = useState(null);
    const [isAnalysisModal, setIsAnalysisModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [receiverName, setReceiverName] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [bankAccNo, setBankAccNo] = useState('');

    useEffect(() => {
        dispatch(fetchAllCoaAccount());
        dispatch(fetchVoucherTypeRequest());
        // dispatch(fetchEnterpriseSetupRequest());
        // dispatch(fetchDivisionRequest());
        // dispatch(fetchEntityRequest());
        // dispatch(fetchBusinessUnitRequest());
    }, []);

    // useEffect(() => {
    //     if (allEnterpriseSetup.length > 0) {
    //         setSelectedEnterprise(allEnterpriseSetup[0].id);
    //     };
    //     if (allDivision.length > 0) {
    //         setSelectedDivision(allDivision[0].id);
    //     };
    //     if (allEntity.length > 0) {
    //         setSelectedEntity(allEntity[0].id);
    //     };
    //     if (allBusinessUnit.length > 0) {
    //         setSelectedBusinessUnit(allBusinessUnit[0].id);
    //     };
    // }, [allEnterpriseSetup, allDivision, allEntity, allBusinessUnit]);

    useEffect(() => {
        if (state) {

            const oldVoucherDetails = Array.isArray(state.voucherDetails)
                ? [...state.voucherDetails]
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
            setUploadVoucherDetails(newVoucherDetails);
            // console.log("newVoucherDetails -------->>>", newVoucherDetails)
        }
    }, [state]);

    const handleVoucherType = (voucherType) => {
        setSelectVoucher(voucherType)
        localStorage.setItem("voucherType", voucherType)

        if (voucherType === "CV") {
            setReceiverName('');
            setChequeNo('');
            setBankAccNo('');
        } else if (voucherType === "CQ") {
            setReceiverName('');
            setChequeNo('');
            setBankAccNo('');
        } else if (voucherType === "MR") {
            setReceiverName('');
            setChequeNo('');
            setBankAccNo('');
        } else if (voucherType === "JV") {
            setReceiverName('');
            setChequeNo('');
            setBankAccNo('');
        }

    }

    const debitAmount = uploadVoucherDetails.reduce((accumulator, current) => Number(accumulator) + Number(current.debit || 0), 0);

    const creditAmount = uploadVoucherDetails.reduce((accumulator, current) => Number(accumulator) + Number(current.credit || 0), 0);

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

    const totalDebit = uploadVoucherDetails.reduce((total, item) => total + Number(item.debit || 0), 0)
    const totalInWord = toWords.convert(totalDebit)

    const addRow = () => {
        const newRows = [...uploadVoucherDetails];
        newRows.push({
            coaId: "",
            voucherNarration: "",
            debit: "",
            credit: "",
            analysisRequired: "N",
        });
        setUploadVoucherDetails(newRows);
    };

    const removeRow = (index) => {
        const updatedRows = [...uploadVoucherDetails];
        updatedRows.splice(index, 1);
        setUploadVoucherDetails(updatedRows);
    };

    // const handleCoaAccountChange = (e, index) => {
    //     const selectedAccountCodeId = e.value;
    //     const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);
    //     if (selectedAccount) {
    //         const updatedRows = [...uploadVoucherDetails];
    //         updatedRows[index].coaId = selectedAccountCodeId;
    //         updatedRows[index].analysisRequired = selectedAccount.analysisRequired;
    //         setUploadVoucherDetails(updatedRows);
    //     }
    // };

    const handleCoaAccountChange = (event, index) => {
        const selectedAccountCodeId = event.value;
        const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);
        if (selectedAccount) {
            const updatedRows = [...uploadVoucherDetails];
            updatedRows[index].coaId = selectedAccountCodeId;
            updatedRows[index].analysisRequired = selectedAccount.analysisRequired;
            setUploadVoucherDetails(updatedRows);
        }
        // if analysisData is select in the same row and dis-select the same row then remove the analysisData where the value is voucherAnalysis
        if (uploadVoucherDetails[index]?.voucherDetails?.length) {
            const updatedRows = [...uploadVoucherDetails];
            updatedRows[index].voucherDetails = [];
            setUploadVoucherDetails(updatedRows);
        }
    };


    const handleInputChange = (e, index, field) => {
        const input = e.target.value
        if ((input.match(/\./g) || []).length > 1) {
            return;
        }
        const numericValue = input.replace(/[^0-9.]/g, '');

        const updatedRows = [...uploadVoucherDetails];
        if (field === 'debit') {
            if (updatedRows[index].trnType === "D") {
                // updatedRows[index].trnAmount = e.target.value;
                updatedRows[index].trnAmount = numericValue;
            } else {
                // updatedRows[index].debit = e.target.value;
                updatedRows[index].debit = numericValue;
            }
        } else if (field === 'credit') {
            if (updatedRows[index].trnType === "C") {
                // updatedRows[index].trnAmount = e.target.value;
                updatedRows[index].trnAmount = numericValue;
            } else {
                // updatedRows[index].credit = e.target.value;
                updatedRows[index].credit = numericValue;
            }
        } else {
            // updatedRows[index][field] = e.target.value;
            updatedRows[index][field] = e.target.value;
        }
        setUploadVoucherDetails(updatedRows);
    };

    //Handle key press
    const handleKeypress = (event) => {
        if (event.key === 'Enter') {
            addRow()
        }
    }

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
            defaultSelectedAnalysis: uploadVoucherDetails[index]?.voucherDetails && select || [],
        });
        // console.log("Voucher Analysis Data ----------->>>>", analysisData);
        setRowIndex(index);
    };

    const handleAnalysisChange = (item, e, coaId, rowIndex, itemIndex) => {
        const currentRow = uploadVoucherDetails[rowIndex];
        // const selectedAnalysisID = Number(e.target.value);
        const selectedAnalysisID = Number(e.value);
        const data = {
            analTypeId: item.analysisTypeID,
            analId: selectedAnalysisID
        };
        if (uploadVoucherDetails[rowIndex]?.voucherDetails?.length) {
            uploadVoucherDetails[rowIndex].voucherDetails[itemIndex] = data;
        } else {
            uploadVoucherDetails[rowIndex].voucherDetails = [data];
        }
        setUploadVoucherDetails(uploadVoucherDetails);
    };

    const onCloseClick = () => {
        setIsAnalysisModal(!isAnalysisModal);
        success ? history('/debit-payment-voucher') : null
    };

    function validateForm() {
        for (let i = 0; i < uploadVoucherDetails.length; i++) {
            const row = uploadVoucherDetails[i];

            if (!selectVoucher) {
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
        }
        return true;
    };

    const resetForm = () => {
        setSelectVoucher("");
        setUploadVoucherDetails([]);
        setAnalysisData({});
    };

    const uploadVoucher = () => {

        if (validateForm()) {
            const data = {
                data: {
                    voucherType: selectVoucher,
                    receiverName: receiverName,
                    chqNumber: chequeNo,
                    bankAccNumber: bankAccNo,
                    voucherRef: '',
                    // enterpriseId: selectedEnterprise,
                    enterpriseId: 1,
                    // divisionId: selectedDivision,
                    divisionId: 1,
                    // entityId: selectedEntity,
                    entityId: 1,
                    // businessUnitId: selectedBusinessUnit,
                    businessUnitId: 1,
                    trnDate: transactionDate,
                    userID: userID,
                    voucherDetails: uploadVoucherDetails.map((item) => {
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
                dispatch(addVoucherEntryForm(data));
                if (loading === false) {
                    setSuccessModal(true)
                }
            }
        }
    };

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


    // show the analysis selection data
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
        authorization(18)
    }, [])



    return (
        <div className="page-content">
            <Container fluid>
                <div>
                    <Breadcrumbs title="Voucher Upload" breadcrumbItem="Voucher / Voucher Upload" />
                    <Card>
                        <CardBody>
                            <CardHeader>
                                <h3 className="text-center">VOUCHER UPLOAD SCREEN</h3>
                            </CardHeader>
                        </CardBody>
                    </Card>
                    <Row>

                        {/* <Col sm="12" md="2" >
                            <Card>
                                <CardBody>

                                    <Row className='mb-3 mt-3'>
                                        {
                                            loading === true ?
                                                <Spinner />
                                                :
                                                <div>
                                                    <Label for="selectEnterprise">Select Enterprise</Label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedEnterprise}
                                                        onChange={(e) => setSelectedEnterprise(e.target.value)}
                                                        disabled
                                                    >
                                                        {allEnterpriseSetup.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.enterpriseName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                        }
                                    </Row>

                                    <Row className='mb-3 mt-3'>
                                        {
                                            loading === true ?
                                                <Spinner />
                                                :
                                                <div>
                                                    <Label for="selectDivision">Select Division</Label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedDivision}
                                                        onChange={(e) => setSelectedDivision(e.target.value)}
                                                        disabled
                                                    >
                                                        {allDivision.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.divisionName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                        }
                                    </Row>

                                    <Row className='mb-3 mt-3'>
                                        {
                                            loading === true ?
                                                <Spinner />
                                                :
                                                <div>
                                                    <Label for="selectEntity">Select Entity</Label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedEntity}
                                                        onChange={(e) => setSelectedEntity(e.target.value)}
                                                        disabled
                                                    >
                                                        {allEntity.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.entityName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                        }
                                    </Row>

                                    <Row className='mb-3 mt-3'>
                                        {
                                            loading === true ?
                                                <Spinner />
                                                :
                                                <div>
                                                    <Label for="selectBusinessUnit">Select Business Unit</Label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedBusinessUnit}
                                                        onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                                                        disabled
                                                    >
                                                        {allBusinessUnit.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.businessUnitName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                        }
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col> */}

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
                                                                value={selectVoucher}
                                                                onChange={(e) => handleVoucherType(e.target.value)}
                                                            >
                                                                <option value="">Select Voucher Type</option>
                                                                {allVoucherType.map((item, index) => (
                                                                    <option key={index} value={item.jrnType}>
                                                                        {item.jrnDescription}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            {selectVoucher === "CV" &&
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

                                                            {selectVoucher === "CQ" &&
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
                                                                        id="bankAccNo"
                                                                        name="bankAccNo"
                                                                        placeholder="Enter Bank Account Number"
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
                                                            altInput: true,
                                                            dateFormat: "Y-m-d"
                                                        }}
                                                        id="date"
                                                        name="date"
                                                        onChange={(e, date) => setTransactionDate(date)}
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
                                                        <h5 className={`text-${creditAmount === debitAmount ? "black" : "danger"} text-end`}>{totalAmount.toFixed(2)}</h5>
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
                                                            uploadVoucherDetails && uploadVoucherDetails.map((item, index) => {

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
                                                                            {/* show analysis */}
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
                                                                                value={item.voucherNarration || uploadVoucherDetails.voucherNarration}
                                                                                name="voucherNarration"
                                                                                onChange={(event) => handleInputChange(event, index, 'voucherNarration')}
                                                                            ></textarea>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className="form-control text-end"
                                                                                name="debit"
                                                                                type="text"
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
                                                                                type="text"
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

                                        <Row style={{ zIndex: -10 }}>
                                            <Col className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-lg fw-bold"
                                                    onClick={uploadVoucher}

                                                >
                                                    Upload Voucher
                                                </button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Container>

            <Modal
                isOpen={isAnalysisModal}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => { setIsAnalysisModal(!isAnalysisModal) }}
                size="lg"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => { setIsAnalysisModal(!isAnalysisModal) }}>{analysisData.analysisData && analysisData.analysisData.coaCode} : {analysisData.analysisData && analysisData.analysisData.coaName}</ModalHeader>
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
                                                    {/* <select
                                                        className="form-control"
                                                        key={item.analysisTypeID}
                                                        onChange={(e) => handleAnalysisChange(item, e, analysisData.analysisData.coaId, rowIndex, indx)}
                                                        defaultValue={analysisData.defaultSelectedAnalysis?.find(data => data.analTypeId === item.analysisTypeID)?.analId || ''}
                                                    >
                                                        <option value="">Select Analysis</option>
                                                        {item.itemList.map((iList, index) => (
                                                            <option key={index} value={iList.analysisID}>
                                                                {iList.analysisCode} : {iList.analysisName}
                                                            </option>
                                                        ))}
                                                    </select> */}
                                                    <Select
                                                        styles={customStyles}
                                                        // value={getDefaultValues()}
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

            {/* Success Modal */}

            <VoucherUploadSuccessModal
                successModal={successModal}
                onCloseClick={onCloseClick}
                setSuccessModal={setSuccessModal}
            />

            <ToastContainer />

        </div>
    )
}

export default VoucherUpload