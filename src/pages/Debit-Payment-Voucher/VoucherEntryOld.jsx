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
// import { fetchAllCoaAccount, fetchVoucherTypeRequest, fetchEnterpriseSetupRequest, fetchDivisionRequest, fetchEntityRequest, fetchBusinessUnitRequest } from '../../store/coa-setup/actions';
import { fetchAllCoaAccount, fetchVoucherTypeRequest } from '../../store/coa-setup/actions';
import Spinner from '../../components/Common/Spinner';

import { AiOutlineEye } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { addVoucherEntryForm } from "../../store/debit-payment-voucher/actions";
import SuccessModal from "./SuccessModal";
// import VoucherSidebar from "./VoucherSidebar";
import AnalysisModal from "./AnalysisModal";

import { ToWords } from 'to-words';

const VoucherEntryOld = () => {

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


    // Dispatch action

    const dispatch = useDispatch();

    // Get user information from redux store

    const { userID } = useSelector(state => state.Login.userInformation)

    // Get all coa accounts and all voucher type from redux store

    // const { loading, allCoaAccounts, allVoucherType, allEnterpriseSetup, allDivision, allEntity, allBusinessUnit } = useSelector(state => state.coaSetupReducer);
    const { loading, allCoaAccounts, allVoucherType } = useSelector(state => state.coaSetupReducer);
    const { success } = useSelector(state => state.voucherEntryReducer);

    // console.log(allCoaAccounts)

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
    const [buttonColors, setButtonColors] = useState({}); // Maintain button colors for each row

    const [selectedCoaValues, setSelectedCoaValues] = useState([]);


    //coa selection default value 
    const [selectedCoa, setSelectedCoa] = useState(null);

    const handleAnalysisChange = (item, e, coaId, rowIndex, itemIndex) => {
        const currentRow = rows[rowIndex];
        // const selectedAnalysisID = Number(e.target.value);
        const selectedAnalysisID = Number(e.value);
        // console.log("selectedAnalysisID", selectedAnalysisID);
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

    //handle Voucher Type and Voucher Date
    const handleVoucherType = (voucherType) => {
        setSelectVoucher(voucherType)
        localStorage.setItem("voucherType", voucherType)
    }

    const handleVoucherDate = (trDate) => {
        setTransactionDate(trDate)
        localStorage.setItem("transactionDate", trDate)
    }


    // Handle add row with validation

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
                // coaId: "",
                voucherNarration: "",
                debit: "",
                credit: "",
                analysisRequired: rows[rows.length - 1]?.analysisRequired || "N",
            });
            setRows(newRows);
        };
    };

    // console.log(rows[rows.length - 1] || '')

    // Handle remove row
    const removeRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
        const updatedButtonColors = { ...buttonColors };
        delete updatedButtonColors[index]; // Remove the button color for the deleted row
        Object.keys(updatedButtonColors).forEach((key) => {
            if (key > index) {
                // Update the button color for rows below the deleted row
                updatedButtonColors[key - 1] = updatedButtonColors[key];
                delete updatedButtonColors[key];
            }
        });
        setButtonColors(updatedButtonColors);

        // Remove the selected value for the removed row
        const updatedSelectedCoaValues = [...selectedCoaValues];
        updatedSelectedCoaValues.splice(index, 1);
        setSelectedCoaValues(updatedSelectedCoaValues);

    };

    // const removeRow = (index) => {
    //     const updatedRows = [...rows];
    //     updatedRows.splice(index, 1);
    //     setRows(updatedRows);

    //     // Remove the selected value for the removed row
    //     const updatedSelectedCoaValues = [...selectedCoaValues];
    //     updatedSelectedCoaValues.splice(index, 1);
    //     setSelectedCoaValues(updatedSelectedCoaValues);

    //     // ... (rest of your removeRow logic)
    // };

    // Handle COA account code change
    // const handleAccountCodeChange = (event, index) => {
    //     const selectedAccountCodeId = event.value;
    //     const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);
    //     if (selectedAccount) {
    //         const updatedRows = [...rows];
    //         updatedRows[index].coaId = selectedAccountCodeId;
    //         updatedRows[index].analysisRequired = selectedAccount.analysisRequired;
    //         setRows(updatedRows);
    //     }
    // };


    // const handleAccountCodeChange = (event, index) => {

    //     setSelectedCoa(event)
    //     const selectedAccountCodeId = event.value;
    //     const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);
    //     if (selectedAccount) {
    //         const updatedRows = [...rows];
    //         updatedRows[index].coaId = selectedAccountCodeId;
    //         updatedRows[index].analysisRequired = selectedAccount.analysisRequired;
    //         setRows(updatedRows);
    //     }
    //     // if analysisData is select in the same row and dis-select the same row then remove the analysisData where the value is voucherAnalysis
    //     if (rows[index]?.voucherDetails?.length) {
    //         const updatedRows = [...rows];
    //         updatedRows[index].voucherDetails = [];
    //         setRows(updatedRows);
    //     }

    // };


    const handleAccountCodeChange = (event, index) => {
        setSelectedCoa(event)
        const selectedAccountCodeId = event.value;
        const selectedAccount = allCoaAccounts.find((item) => item.coaId === +selectedAccountCodeId);

        // Update the selected value for the current row
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


    // Handle Other Input Change
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
        // const updatedRows = [...rows];
        // if (!isNaN(numericValue)) {
        //     updatedRows[index][field] = numericValue
        //     setRows(updatedRows);
        // }
    };

    //Handle key press
    const handleKeypress = (event) => {
        if (event.key === 'Enter') {
            addRow()
        }
    }

    //handle arrow button 
    const handleArrowBtn = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const debitAmount = rows.reduce((accumulator, current) => Number(accumulator) + Number(current.debit || 0), 0);

    const creditAmount = rows.reduce((accumulator, current) => Number(accumulator) + Number(current.credit || 0), 0);

    const totalAmount = debitAmount - creditAmount;


    // Convert Amount Number To Word
    // const convertNumberToWord = (number) => {
    //     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    //     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    //     if (number === 0) {
    //         return '';
    //     }

    //     if (number < 0) {
    //         return 'Minus ' + convertNumberToWord(Math.abs(number));
    //     }

    //     let words = '';

    //     if (Math.floor(number / 10000000) > 0) {
    //         words += convertNumberToWord(Math.floor(number / 10000000)) + ' Crore ';
    //         number %= 10000000;
    //     }

    //     if (Math.floor(number / 100000) > 0) {
    //         words += convertNumberToWord(Math.floor(number / 100000)) + ' Lac ';
    //         number %= 100000;
    //     }

    //     if (Math.floor(number / 1000) > 0) {
    //         words += convertNumberToWord(Math.floor(number / 1000)) + ' Thousand ';
    //         number %= 1000;
    //     }

    //     if (Math.floor(number / 100) > 0) {
    //         words += ones[Math.floor(number / 100)] + ' Hundred ';
    //         number %= 100;
    //     }

    //     if (number > 0) {
    //         if (words !== '') {
    //             words += 'and ';
    //         }

    //         if (number < 20) {
    //             words += ones[number];
    //         } else {
    //             words += tens[Math.floor(number / 10)];
    //             if ((number % 10) > 0) {
    //                 words += '-' + ones[number % 10];
    //             }
    //         }
    //     }
    //     return words;
    // };

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

    const totalDebit = rows.reduce((total, item) => total + Number(item.debit || 0), 0)
    const totalInWord = toWords.convert(totalDebit)


    useEffect(() => {
        dispatch(fetchAllCoaAccount());
        dispatch(fetchVoucherTypeRequest());
        // dispatch(fetchEnterpriseSetupRequest());
        // dispatch(fetchDivisionRequest());
        // dispatch(fetchEntityRequest());
        // dispatch(fetchBusinessUnitRequest());

        setSelectVoucher(localStorage.getItem('voucherType') || '')
        setTransactionDate(localStorage.getItem('transactionDate') || new Date().toISOString().slice(0, 10))
    }, []);

    // useEffect(() => {
    //     //option call here..
    //     // optionss()

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

    // Here is the function to validate the form

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
        // setSelectVoucher("");
        setRows([]);
        setAnalysisData({});
    };

    // Here is the function to handle submit
    const handleSubmit = () => {

        if (validateForm()) {
            const data = {
                data: {
                    // enterpriseId: selectedEnterprise,
                    enterpriseId: 1,
                    // divisionId: selectedDivision,
                    divisionId: 1,
                    // entityId: selectedEntity,
                    entityId: 1,
                    // businessUnitId: selectedBusinessUnit,
                    businessUnitId: 1,
                    voucherType: selectVoucher,
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
                // console.log("data ---------->>>>>> ", data);
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



    // show the analysis modal auto based on selection data
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



    // console.log(transactionDate)

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

                {/* <Col sm="12" md="2" >
                    <VoucherSidebar
                        allEnterpriseSetup={allEnterpriseSetup}
                        allDivision={allDivision}
                        allEntity={allEntity}
                        allBusinessUnit={allBusinessUnit}
                        loading={loading}
                        selectedEnterprise={selectedEnterprise}
                        selectedDivision={selectedDivision}
                        selectedEntity={selectedEntity}
                        selectedBusinessUnit={selectedBusinessUnit}
                        setSelectedEnterprise={setSelectedEnterprise}
                        setSelectedDivision={setSelectedDivision}
                        setSelectedEntity={setSelectedEntity}
                        setSelectedBusinessUnit={setSelectedBusinessUnit}
                    />
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
                                                        // onChange={(e) => setSelectVoucher(e.target.value)}
                                                        onChange={(e) => handleVoucherType(e.target.value)}
                                                    >
                                                        <option value="">Select Voucher Type</option>
                                                        {allVoucherType.map((item, index) => (
                                                            <option key={index} value={item.jrnType}>
                                                                {item.jrnDescription}
                                                            </option>
                                                        ))}
                                                    </select>
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
                                                // onChange={(e, date) => setTransactionDate(date)}
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
                                                            {/* <Select
                                                                styles={customStyles}
                                                                onChange={(event) => handleAccountCodeChange(event, index)}
                                                                options={allCoaAccounts.map((item) => {
                                                                    return {
                                                                        label: item.coaCode + " : " + item.coaName,
                                                                        value: item.coaId
                                                                    };
                                                                })}
                                                                defaultValue={selectedCoa}
                                                                autoFocus
                                                            /> */}

                                                            <Select
                                                                styles={customStyles}
                                                                onChange={(event) => handleAccountCodeChange(event, index)}
                                                                options={allCoaAccounts.map((item) => ({
                                                                    label: item.coaCode + " : " + item.coaName,
                                                                    value: item.coaId
                                                                }))}
                                                                value={selectedCoaValues[index]} // Use the selected value from state
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
                                                                < td className="text-center">
                                                                    {
                                                                        allCoaAccounts.map((coaAcc, i) => {
                                                                            if (coaAcc.coaId === +row.coaId) {
                                                                                // setAnup(true)
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
                                                        < td >
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
                                                                // value={row.debit}
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
                                                        {/* <span>(Dr) </span> */}
                                                        <span className="fw-bold">{debitAmount.toFixed(2)}</span>
                                                    </td>
                                                    <td colSpan="1" className="text-end">
                                                        {/* <span>(Cr) </span> */}
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
            </Row >


            {/* All Modals are here */}
            < AnalysisModal
                analysisData={analysisData}
                onCloseClick={onCloseClick}
                handleAnalysisChange={handleAnalysisChange}
                setIsAnalysisModal={setIsAnalysisModal}
                isAnalysisModal={isAnalysisModal}
                rowIndex={rowIndex}
                getSerialLabel={getSerialLabel}

            />

            {/* Success Modal */}
            < SuccessModal
                successModal={successModal}
                onCloseClick={onCloseClick}
                setSuccessModal={setSuccessModal}
                resetForm={resetForm}
            />

            <ToastContainer />

        </div >
    )
}

export default VoucherEntryOld