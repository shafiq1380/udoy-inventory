import React, { useState, useEffect, memo, useRef } from "react";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import {
    CardHeader,
    Col,
    Row,
    Label,
    Card,
    CardBody,
    InputGroup,

} from "reactstrap";
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCoaAccount, fetchVoucherTypeRequest } from '../../store/coa-setup/actions';
import Spinner from '../../components/Common/Spinner';
import { AiOutlineEye } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { addVoucherEntryForm } from "../../store/debit-payment-voucher/actions";
import SuccessModal from "./SuccessModal";
import AnalysisModal from "./AnalysisModal";

import { ToWords } from 'to-words';

const VoucherEntry = () => {

    // Toast Config

    const toastOptions = {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // Set initial state

    const initialRow = {
        coaId: '',
        voucherNarration: '',
        debit: '',
        credit: '',
        analysisRequired: 'N',
    };
    const dispatch = useDispatch();
    const { userID } = useSelector(state => state.Login.userInformation)
    const { loading, allCoaAccounts, allVoucherType } = useSelector(state => state.coaSetupReducer);
    const { success } = useSelector(state => state.voucherEntryReducer);


    const [rows, setRows] = useState([initialRow]);
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [selectVoucher, setSelectVoucher] = useState(null);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
    const [isAnalysisModal, setIsAnalysisModal] = useState(false);
    const [analysisData, setAnalysisData] = useState({});
    const [rowIndex, setRowIndex] = useState(null);
    const [successModal, setSuccessModal] = useState(false);
    const [buttonColors, setButtonColors] = useState({});
    const [selectedCoaValues, setSelectedCoaValues] = useState([]);
    const [selectedCoa, setSelectedCoa] = useState(null);
    const [receiverName, setReceiverName] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [bankAccNo, setBankAccNo] = useState('');

    const handleAnalysisChange = (item, e, coaId, rowIndex, itemIndex) => {
        const currentRow = rows[rowIndex];
        const selectedAnalysisID = Number(e.value);
        const data = {
            analTypeId: item.analysisTypeID,
            analId: selectedAnalysisID
        };
        if (rows[rowIndex]?.voucherDetails?.length) {
            rows[rowIndex].voucherDetails[itemIndex] = data;
        } else {
            rows[rowIndex].voucherDetails = [data];
        }
        setRows(rows)

        const allDropdownsSelected = analysisData.analysisData?.analysisList?.every(
            (listItem, index) =>
                rows[rowIndex]?.voucherDetails?.find((data) => data.analTypeId === listItem.analysisTypeID)?.analId
        );
        const updatedButtonColors = { ...buttonColors };
        if (allDropdownsSelected) {
            updatedButtonColors[rowIndex] = 'green';
        } else {
            updatedButtonColors[rowIndex] = 'red';
        }
        setButtonColors(updatedButtonColors);
    };

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

    const handleVoucherDate = (trDate) => {
        setTransactionDate(trDate)
        localStorage.setItem("transactionDate", trDate)
    }

    const selectedCoaRef = useRef()

    const addRow = () => {
        const newRows = [...rows];
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
                coaId: rows[rows.length - 1]?.coaId || '',
                voucherNarration: "",
                debit: "",
                credit: "",
                analysisRequired: rows[rows.length - 1]?.analysisRequired || "N",
            });
            setRows(newRows);
        };
    };

    const removeRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
        const updatedButtonColors = { ...buttonColors };
        delete updatedButtonColors[index];
        Object.keys(updatedButtonColors).forEach((key) => {
            if (key > index) {
                updatedButtonColors[key - 1] = updatedButtonColors[key];
                delete updatedButtonColors[key];
            }
        });
        setButtonColors(updatedButtonColors);

        const updatedSelectedCoaValues = [...selectedCoaValues];
        updatedSelectedCoaValues.splice(index, 1);
        setSelectedCoaValues(updatedSelectedCoaValues);

    };

    const handleAccountCodeChange = (event, index) => {
        setSelectedCoa(event)
        const selectedAccountCodeId = event.value;
        const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);

        const updatedSelectedCoaValues = [...selectedCoaValues];
        updatedSelectedCoaValues[index] = event;
        setSelectedCoaValues(updatedSelectedCoaValues);

        if (selectedAccount) {
            const updatedRows = [...rows];
            updatedRows[index].coaId = selectedAccountCodeId;
            updatedRows[index].analysisRequired = selectedAccount.analysisRequired;
            setRows(updatedRows);
        }

        if (rows[index]?.voucherDetails?.length) {
            const updatedRows = [...rows];
            updatedRows[index].voucherDetails = [];
            setRows(updatedRows);
        }
    };

    const handleChange = (event, index, field) => {
        if (field === "debit" || field === "credit") {
            const input = event.target.value
            if ((input.match(/\./g) || []).length > 1) {
                return;
            }
            const numericValue = input.replace(/[^0-9.]/g, '');
            const updatedRows = [...rows];
            if (!isNaN(numericValue)) {
                updatedRows[index][field] = numericValue
                setRows(updatedRows);
            }
        } else {
            const updatedRows = [...rows];
            updatedRows[index][field] = event.target.value
            setRows(updatedRows);
        }
    };

    const handleKeypress = (event) => {
        if (event.key === 'Enter') {
            addRow()
        }
    }

    const handleArrowBtn = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const debitAmount = rows.reduce((accumulator, current) => Number(accumulator) + Number(current.debit || 0), 0);

    const creditAmount = rows.reduce((accumulator, current) => Number(accumulator) + Number(current.credit || 0), 0);

    const totalAmount = debitAmount - creditAmount;

    const toWords = new ToWords({
        localeCode: 'en-BD',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: {
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

    const totalDebit = rows.reduce((total, item) => total + Number(item.debit || 0), 0)
    const totalInWord = toWords.convert(totalDebit)


    useEffect(() => {
        dispatch(fetchAllCoaAccount());
        dispatch(fetchVoucherTypeRequest());
        setSelectVoucher(localStorage.getItem('voucherType') || '')
        setTransactionDate(localStorage.getItem('transactionDate') || new Date().toISOString().slice(0, 10))
    }, []);

    const showAnalysisData = (analysisData, index) => {

        setIsAnalysisModal(!isAnalysisModal);
        setAnalysisData({ analysisData, defaultSelectedAnalysis: rows[index]?.voucherDetails || [] });
        setRowIndex(index)
    };

    const onCloseClick = () => {
        setIsAnalysisModal(!isAnalysisModal);
    };

    function getSerialLabel(index) {
        const labels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];
        const labelIndex = index < labels.length ? index : labels.length - 1;
        return labels[labelIndex];
    };

    function validateForm() {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

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
        setRows([]);
        setAnalysisData({});
    };

    const handleSubmit = () => {

        if (validateForm()) {
            const data = {
                data: {
                    enterpriseId: 1,
                    divisionId: 1,
                    entityId: 1,
                    businessUnitId: 1,
                    voucherType: selectVoucher,
                    receiverName: receiverName,
                    chqNumber: chequeNo,
                    bankAccNumber: bankAccNo,
                    voucherRef: '',
                    trnDate: transactionDate,
                    userID: userID,
                    voucherDetails: rows.map((item) => {
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
            // console.log(data)
            if (data.data.voucherDetails.length === 0) {
                toast.error("Please enter voucher details", toastOptions);
                return;
            } else {
                dispatch(addVoucherEntryForm(data));
                if (loading === false) {
                    setSuccessModal(true)
                }
            }
        }
    };


    useEffect(() => {
        if (success) {
            resetForm();
        }
    }, [success]);

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };

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

    const inputRef = useRef();
    useEffect(() => {
        if (rows[rows.length - 1]?.analysisRequired === "Y") {

            allCoaAccounts.map((coaAcc, i) => {
                if (coaAcc.coaId === +rows[rows.length - 1]?.coaId) {
                    showAnalysisData(coaAcc, rows.length - 1)
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }

            })
        }
    }, [rows[rows.length - 1]?.analysisRequired, rows[rows.length - 1]?.coaId]);

    return (
        <div>
            <Card>
                <CardBody>
                    <CardHeader>
                        <h3 className="text-center">VOUCHER CREATE SCREEN</h3>
                    </CardHeader>
                </CardBody>
            </Card>

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
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "Y-m-d",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true,
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={(e, date) => handleVoucherDate(date)}
                                                onClose={(e, date) => handleVoucherDate(date)}
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
                                                <h5 className={`text-${creditAmount === debitAmount ? "black" : "danger"} text-end`}>
                                                    {totalAmount.toFixed(2)}
                                                </h5>
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
                                                    <th className="col-3 text-center">Narration</th>
                                                    <th style={{ width: '150px' }} className="text-end">Debit (Dr)</th>
                                                    <th style={{ width: '150px' }} className="text-end">Credit (Cr)</th>
                                                    <th style={{ width: '50px' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{index + 1}</td>
                                                        <td>
                                                            <Select
                                                                styles={customStyles}
                                                                onChange={(event) => handleAccountCodeChange(event, index)}
                                                                options={allCoaAccounts.map((item) => ({
                                                                    label: item.coaCode + " : " + item.coaName,
                                                                    value: item.coaId
                                                                }))}
                                                                value={selectedCoaValues[index]}
                                                                autoFocus
                                                                defaultValue={selectedCoa}
                                                            />

                                                            <p style={{ fontSize: '12px', color: 'gray' }}>
                                                                {
                                                                    row.analysisRequired === "Y" ?
                                                                        row?.voucherDetails?.map(item =>
                                                                            renderItem(item.analTypeId, item.analId))
                                                                        : null
                                                                }
                                                            </p>

                                                        </td>
                                                        {
                                                            row.analysisRequired === "Y" ?
                                                                <td className="text-center">
                                                                    {
                                                                        allCoaAccounts.map((coaAcc, i) => {
                                                                            if (coaAcc.coaId === +row.coaId) {
                                                                                return (
                                                                                    <div key={i} >
                                                                                        <AiOutlineEye
                                                                                            size={30}
                                                                                            color={buttonColors[index] || 'red'}
                                                                                            role="button"
                                                                                            onClick={() => { showAnalysisData(coaAcc, index) }}

                                                                                        ></AiOutlineEye>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                </td>
                                                                :
                                                                <td ></td>
                                                        }
                                                        <td>
                                                            <textarea
                                                                ref={inputRef}
                                                                className="form-control"
                                                                style={{ height: "30px" }}
                                                                name="voucherNarration"
                                                                type="text"
                                                                onChange={(event) => handleChange(event, index, 'voucherNarration')}
                                                                value={row.voucherNarration}
                                                            ></textarea>
                                                        </td>

                                                        <td>
                                                            <input
                                                                className="form-control text-end"
                                                                name="debit"
                                                                type="text"
                                                                onChange={(event) => handleChange(event, index, 'debit')}
                                                                value={row.debit > -1 ? row.debit : ''}
                                                                disabled={row.credit}
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
                                                                onChange={(event) => handleChange(event, index, 'credit')}
                                                                value={row.credit > -1 ? row.credit : ''}
                                                                disabled={row.debit}
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
                                                ))}
                                            </tbody>

                                            <tfoot className='bg-light'>
                                                <tr>
                                                    <td colSpan="3" className="text-center fw-bold">
                                                        Total: {""}
                                                        {totalDebit > 0 && totalInWord}
                                                    </td>

                                                    <td colSpan="1">
                                                        {totalAmount ?
                                                            <h5 className="text-end ">
                                                                <span className="text-muted">Balance: </span>
                                                                <span className={`text-${creditAmount === debitAmount ? "black" : "danger"} text-end`}> {totalAmount.toFixed(2)}</span>
                                                            </h5>
                                                            : null
                                                        }
                                                    </td>

                                                    <td colSpan="1" className="text-end">
                                                        <span className="fw-bold">{debitAmount.toFixed(2)}</span>
                                                    </td>
                                                    <td colSpan="1" className="text-end">
                                                        <span className="fw-bold">  {creditAmount.toFixed(2)}</span>
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
                                    <Col className="text-center" >
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg fw-bold"
                                            onClick={handleSubmit}
                                        >
                                            Save Voucher
                                        </button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Col>
            </Row>


            {/* All Modals are here */}
            <AnalysisModal
                analysisData={analysisData}
                onCloseClick={onCloseClick}
                handleAnalysisChange={handleAnalysisChange}
                setIsAnalysisModal={setIsAnalysisModal}
                isAnalysisModal={isAnalysisModal}
                rowIndex={rowIndex}
                getSerialLabel={getSerialLabel}

            />

            {/* Success Modal */}
            <SuccessModal
                successModal={successModal}
                onCloseClick={onCloseClick}
                setSuccessModal={setSuccessModal}
                resetForm={resetForm}
            />

            <ToastContainer />

        </div>
    )
}

export default VoucherEntry