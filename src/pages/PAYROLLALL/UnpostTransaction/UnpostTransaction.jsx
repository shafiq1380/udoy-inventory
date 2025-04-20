import React, { useState, useEffect } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, Card, CardBody, Col, Container, Input, Label, Row } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post } from '../../../utils/https'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { use } from 'i18next';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

// const unpostTransactionType = [
//     { value: 1, label: "GPF Opening/Interest" },
//     { value: 2, label: "CPF Opening/Interest" },
//     { value: 3, label: "Employee Loan Opening/Interest" },
//     { value: 4, label: "Employee Payroll" },
//     { value: 5, label: "OT Allowance" },
//     { value: 6, label: "Festival Bonus" },
//     { value: 7, label: "Boishakhi Vata" },
//     { value: 8, label: "Recreation Leave Allowance" },
//     { value: 9, label: "WPPF Allowance" }
// ];

const UnpostTransaction = () => {
    const userID = JSON.parse(localStorage.getItem('userID'));
    const [unpostSelect, setUnpostSelect] = useState(null);
    const [unpostTransactionType, setUnpostTransactionType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unpostTransactionLists, setUnpostTransactionLists] = useState([]);
    const [selectedUnpostTransaction, setSelectedUnpostTransaction] = useState(null);
    const [remarks, setRemarks] = useState('');

    // console.log("selectedUnpostTransaction", selectedUnpostTransaction)

    const getUnpostTransactionList = async () => {
        setLoading(true);

        const data = {
            data: unpostSelect
        };

        if (unpostSelect) {
            try {
                const response = await Post('/api/Payroll/GetTransactionListforUnpost', data);

                if (response.data.success) {
                    const transformedArray = Object.keys(response.data.data).map(key => {
                        const [id, date, description] = response.data.data[key].split(':');
                        return { id, date, description };
                    });

                    setUnpostTransactionLists(transformedArray);
                } else {
                    console.log('Error:', response.data.errorMessage);
                }
            } catch (error) {
                console.log('API call failed:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const unpostTransactionTypes = async () => {
        setLoading(true);
        try {
            const response = await Post('/api/Payroll/GetTransactionTypesforUnpost');
            if (response.data.success) {
                const options = Object.entries(response?.data?.data).map(([key, value]) => ({
                    value: key,
                    label: value
                }));
                setUnpostTransactionType(options);
            }
        } catch (error) {
            console.log('API call failed:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setUnpostTransactionLists([]);
        setSelectedUnpostTransaction(null);

        if (unpostSelect) {
            getUnpostTransactionList();
        }
    }, [unpostSelect]);


    useEffect(() => {
        unpostTransactionTypes()
    }, []);


    const clearState = () => {
        setUnpostSelect(null);
        setRemarks('');
        setSelectedUnpostTransaction(null);
    };


    const handleUnpostTransaction = () => {
        if (!selectedUnpostTransaction) {
            toast.error("Please select a transaction to unpost", toastOptions);
            return;
        };

        if (!remarks) {
            toast.error("Please enter remarks", toastOptions);
            return;
        };

        const data = {
            data: {
                typeID: unpostSelect,
                tranID: +selectedUnpostTransaction?.value,
                userID: userID,
                remarks: remarks
            }
        };

        // console.log(" data ----------->>> ", data);

        try {
            Post('/api/Payroll/TransactionUnpost', data)
                .then((res) => {
                    // console.log("res", res)
                    if (res.data.success === true) {
                        toast.success("Transaction UnPosted Successfully", toastOptions);
                        clearState();
                    } else {
                        toast.error(res.data.errorMessage, toastOptions);
                        clearState();
                    }
                })
        } catch (error) {
            console.log('API call failed:', error);
        }
    };


    // Authorization check
    useEffect(() => {
        authorization(112)
    }, []);

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumbs title="Report" breadcrumbItem="Unpost Transaction" />

                <Card style={{ height: '50vh', marginBottom: '20px' }}>
                    <CardBody>
                        <Row>
                            <Col md={9} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg'>Select Transaction Type</Label>
                                    </Col>
                                    <Col md={6}>
                                        <Select
                                            options={unpostTransactionType?.map((item) => ({ value: item.value, label: item.label }))}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            placeholder="Select Unpost Transaction Type"
                                            onChange={(selectedOption) => setUnpostSelect(selectedOption.value)}
                                            value={unpostTransactionType?.find(option => option.value === unpostSelect) || null}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col md={9} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg'>Unpost Transaction List</Label>
                                    </Col>
                                    <Col md={6}>
                                        <Select
                                            options={unpostTransactionLists.map((item) =>
                                                ({ value: item.id, label: `${item.id} : ${item.date} : ${item.description}` })
                                            )}
                                            // options={unpostTransactionType}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            placeholder="Select Unpost Transaction"
                                            isClearable={true}
                                            isLoading={loading}
                                            value={selectedUnpostTransaction}
                                            onChange={(selectedOption) => setSelectedUnpostTransaction(selectedOption)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col md={9} sm={12}>
                                <Row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg'>Remarks</Label>
                                    </Col>
                                    <Col md={6}>
                                        <Input
                                            type="text"
                                            id="remarks"
                                            name="remarks"
                                            placeholder='Why are you unposting this transaction?'
                                            className='form-control'
                                            onChange={(e) => setRemarks(e.target.value)}
                                            value={remarks}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col md={7} sm={12}>
                                <div className='d-flex flex-wrap justify-content-end'>
                                    <div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="btn-rounded mt-2 mb-2 me-2 px-4"
                                            onClick={handleUnpostTransaction}
                                        // disabled={!allowanceId || !selectedBank}
                                        >
                                            UnPost Transaction
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </Container>
            <ToastContainer />
        </div>
    )
}

export default UnpostTransaction;
