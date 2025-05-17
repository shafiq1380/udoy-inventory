import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Label, Row } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post } from '../../../utils/https';
import CustomSpinner from '../../../components/Common/CustomSpinner';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const TransactionValueUpdate = () => {

    const navigate = useNavigate();

    const { userID } = useSelector(state => state.Login.userInformation);

    const { state } = useLocation();
    const [voucherRef, setVoucherRef] = useState(state?.refNo || '');
    const [tranDetailsByRef, setTranDetailsByRef] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editableData, setEditableData] = useState({});
    const [remarks, setRemarks] = useState('');
    const [hasFetched, setHasFetched] = useState(false);


    useEffect(() => {
        if (state?.refNo) {
            getTransactionDetailsByRef(state.refNo);
        }
    }, [state]);

    const handleInputChange = (index, field, value) => {
        // if (value.trim() === "" || parseFloat(value) < 0) {
        //     toast.error("Please enter a valid positive number.", toastOptions);
        //     return;
        // }

        let parsedValue = parseFloat(value.trim()) || 0;

        if (parsedValue < 0) {
            toast.error("Please enter a valid positive number.", toastOptions);
            return;
        }

        // setEditableData(prevState => {
        //     const updatedData = { ...prevState };
        //     if (updatedData[index]) {
        //         updatedData[index][field] = (parsedValue);
        //     } else {
        //         updatedData[index] = { [field]: (parsedValue) };
        //     }
        //     return updatedData;
        // });

        setTranDetailsByRef(prevState => {
            const updatedData = [...prevState];
            if (updatedData[index]) {
                updatedData[index][field] = (parsedValue);
            } else {
                updatedData[index] = { [field]: (parsedValue) };
            }
            return updatedData;
        });

    };




    const getTransactionDetailsByRef = async () => {
        if (!voucherRef || voucherRef.trim('') === '' || voucherRef.trim('') === undefined || voucherRef.trim('') === null) {
            toast.error("Please Enter a Valid Ref No.", toastOptions);
            return;
        }

        setLoading(true);
        setHasFetched(false);

        try {
            const response = await Post('/api/v1/InvTransaction/GetTransactionByRef', { data: voucherRef.trim() });
            const data = response?.data?.data ?? [];
            setTranDetailsByRef(data);
            setHasFetched(true);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            toast.error("Failed to fetch transaction details. Please try again later.", toastOptions);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setVoucherRef('');
        setRemarks('');
        setTranDetailsByRef([]);
        setEditableData({});
        setHasFetched(false);
    };

    const handleUpdate = async () => {
        if (!remarks) {
            toast.error("Remarks is a mandatory field.", toastOptions);
            return;
        };
        const isValid = tranDetailsByRef.every((item, index) => {
            const linRate = editableData[index]?.linRate ?? item.linRate;
            const invRate = editableData[index]?.invRate ?? item.invRate;

            if (linRate <= 0) {
                toast.error("Line Rate must be greater than 0.", toastOptions);
                return false;
            } else if (invRate <= 0) {
                toast.error("Inventory Rate must be greater than 0.", toastOptions);
                return false;
            }
            return true;
        });

        if (!isValid) {
            return;
        }

        setLoading(true);

        const data = {
            data: {
                userID,
                voucherRef: voucherRef.trim(),
                remarks: remarks.trim(),
                items: tranDetailsByRef.map((item, index) => ({
                    detID: item.detID,
                    linRate: editableData[index]?.linRate ?? item.linRate,
                    invRate: editableData[index]?.invRate ?? item.invRate
                }))
            }
        };

        try {
            const response = await Post('/api/v1/InvTransaction/UpdateTransactionValue', data);
            if (response?.data?.data !== null) {
                toast.success("Transaction Value Updated Successfully", toastOptions);
                resetForm();
            } else {
                toast.error("Failed to update transaction value. Please try again later.", toastOptions);
            }
        } catch (error) {
            console.error("Error updating transaction value:", error);
            toast.error("Failed to update transaction value. Please try again later.", toastOptions);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Transaction Value Update" />

                {
                    state && state?.refNo && (
                        <Button
                            type="button"
                            color="success"
                            className="btn-rounded px-3"
                            onClick={() => navigate(-1)}
                        >
                            <IoMdArrowRoundBack size={20} color='white' />
                        </Button>
                    )
                }

                <Card className={state && state?.refNo && 'mt-2'}>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">Transaction Value Update Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Col sm={12} md={12} lg={6}>
                            <Row>
                                <Col sm={12} md={6} lg={3}>
                                    <Label for="voucherRef" size="lg">Transaction Ref</Label>
                                </Col>
                                <Col sm={12} md={6} lg={9}>
                                    <input
                                        type="text"
                                        id="voucherRef"
                                        name="voucherRef"
                                        placeholder='Enter Voucher Reference'
                                        className='form-control'
                                        value={voucherRef}
                                        onChange={(e) => { setVoucherRef(e.target.value) }}
                                    />
                                </Col>
                            </Row>

                            <div className='text-end my-2'>
                                <Button
                                    type="button"
                                    color="primary"
                                    className="px-5"
                                    onClick={getTransactionDetailsByRef}
                                    disabled={voucherRef === '' ? true : false}>
                                    Show
                                </Button>
                            </div>
                        </Col>
                    </CardBody>
                </Card>

                {loading ? (
                    <CustomSpinner />
                ) : (
                    <Row>
                        <Col>
                            {hasFetched && tranDetailsByRef.length === 0 && (
                                <Card>
                                    <CardBody>
                                        <h1 className='text-center fw-bold text-danger'>No Data Found With this Ref: {voucherRef && voucherRef}</h1>
                                    </CardBody>
                                </Card>
                            )}

                            {tranDetailsByRef && tranDetailsByRef.length > 0 && (
                                <Card>
                                    <CardBody>
                                        <div>
                                            <CardHeader className="py-1 text-center">
                                                <h4 style={{ backgroundColor: 'lightGray', padding: '5px', borderRadius: '5px' }}>Transaction Header</h4>
                                            </CardHeader>
                                            <table className="table table-striped table-bordered table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>#ID</th>
                                                        <th>Trn Ref</th>
                                                        <th>Trn Date</th>
                                                        <th>Trn Decs</th>
                                                        <th>Trn Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{tranDetailsByRef[0].id}</td>
                                                        <td>{tranDetailsByRef[0].trnRefNo}</td>
                                                        <td>{tranDetailsByRef[0].trnDate.split('T')[0]}</td>
                                                        <td>{tranDetailsByRef[0].trnDesc}</td>
                                                        <td>{({ 0: 'Deleted', 1: 'Saved', 2: 'Posted' }[tranDetailsByRef[0].trnStatus] || '')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <hr className="hr-1" />
                                        <CardHeader className="py-1 text-center">
                                            <h4 style={{ backgroundColor: 'lightGray', padding: '5px', borderRadius: '5px' }}>Transaction Details</h4>
                                        </CardHeader>
                                        <table className="table table-striped table-bordered table-sm">
                                            <thead>
                                                <tr className='fw-bold'>
                                                    <th className=''>L/No</th>
                                                    <th className=''>Item Code</th>
                                                    <th className=''>Item Name</th>
                                                    <th className=''>Store Name</th>
                                                    <th className=''>UOM</th>
                                                    <th className='col-1 text-end'>Lin Qty</th>
                                                    <th className='col-1 text-end'>Lin Rate</th>
                                                    <th className='col-1 text-end'>Lin Amount</th>
                                                    <th className='col-1 text-end'>Inv Rate</th>
                                                    <th className='col-1 text-end'>Inv Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tranDetailsByRef.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.lno}</td>
                                                        <td>{item.itemCode}</td>
                                                        <td>{item.itemDesc}</td>
                                                        <td>{item.storeCode}</td>
                                                        <td>{item.uom}</td>
                                                        <td className='text-end'>{item.linQty}</td>
                                                        <td>
                                                            <input
                                                                className='form-control text-end'
                                                                type="number"
                                                                value={editableData[index]?.linRate || item.linRate}
                                                                onChange={(e) => handleInputChange(index, 'linRate', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td className='text-end'>{(item.linQty * (editableData[index]?.linRate || item.linRate)).toFixed(4)}</td>
                                                        <td>
                                                            <input
                                                                className='form-control text-end'
                                                                type="number"
                                                                value={editableData[index]?.invRate || item.invRate}
                                                                onChange={(e) => handleInputChange(index, 'invRate', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </td>
                                                        <td className='text-end'>{(item.linQty * (editableData[index]?.invRate || item.invRate)).toFixed(4)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="text-center mt-3">
                                            <Label for="remarks" className="form-label" size="lg">Remarks</Label>
                                            <div className="d-flex justify-content-center">
                                                <input
                                                    type="text"
                                                    id="remarks"
                                                    name="remarks"
                                                    className="form-control w-50 mx-auto"
                                                    value={remarks}
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                    required
                                                    placeholder='Please enter remarks'
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center mt-3">
                                            <Button className="px-5" color="success" onClick={handleUpdate}>Update</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </Col>
                    </Row>
                )}

                <ToastContainer />
            </Container>
        </div>
    );
};

export default TransactionValueUpdate;
