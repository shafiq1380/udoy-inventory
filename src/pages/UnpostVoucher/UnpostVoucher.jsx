import React, { useState } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Container, Card, CardBody, CardHeader, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CustomSpinner from './../../components/Common/CustomSpinner';
import axios from 'axios';
import { useEffect } from 'react';
import { Post, REPORT_URL } from '../../utils/https';
import { authorization } from '../../components/Common/Authorization';
import UnpostForm from './UnpostForm';
import { addUnpostVoucherEntryFail, addUnpostVoucherEntryForm } from '../../store/reverse-voucher/actions';


const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const UnpostVoucher = () => {

    const [voucherRef, setVoucherRef] = useState('');
    const [voucherDate, setVoucherDate] = useState(new Date().toISOString().slice(0, 10));
    const [voucherAmount, setVoucherAmount] = useState('');
    const [reason, setReason] = useState('');
    const { userID } = useSelector(state => state.Login.userInformation)
    const { loading, unpostSuccess, error } = useSelector(state => state.reverseVoucherEntryReducer)

    const [showUnpostModal, setShowUnpostModal] = useState(false);

    const dispatch = useDispatch();

    const validationForm = () => {
        if (voucherRef === '') {
            toast.error("Voucher Reference is required", toastOptions);
            return false;
        }
        else if (voucherDate === '') {
            toast.error("Voucher Date is required", toastOptions);
            return false;
        }
        else if (voucherAmount === '') {
            toast.error("Voucher Amount is required", toastOptions);
            return false;
        }
        else if (voucherAmount < 0) {
            toast.error("Voucher Amount cannot be negative", toastOptions);
            return false;
        }
        else if (voucherAmount === 0) {
            toast.error("Voucher Amount cannot be zero", toastOptions);
            return false;
        }
        else if (voucherAmount <= 0) {
            toast.error("Voucher Amount must be greater than zero", toastOptions);
            return false;
        }
        else if (reason === '') {
            toast.error("Reason is required", toastOptions);
            return false;
        }
        else {
            return true;
        }
    };


    const unpostVoucher = (e) => {
        e.preventDefault();
        if (validationForm()) {
            const data = {
                data: {
                    voucherRef: voucherRef,
                    voucherDate: voucherDate,
                    voucherAmount: +voucherAmount,
                    userID: userID,
                    remarks: reason
                }
            }
            console.log(" data ----------->>> ", data);

            dispatch(addUnpostVoucherEntryForm(data));
            if (loading === false) {
                setShowUnpostModal(true);
            }
        }
    };


    //Authorization check
    useEffect(() => {
        authorization(111)
    }, [])


    useEffect(() => {
        if (unpostSuccess?.voucherRef) {
            setVoucherRef('');
            setVoucherDate('');
            setVoucherAmount('');
            setReason('');
        }
    }, [unpostSuccess])

    const popupWidth = 900;
    const popupHeight = 700;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const printVoucher = () => {
        try {
            axios.get(`${REPORT_URL}/api/VoucherReport/GetVoucherReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&Posted=1&VoucherType=&FromDate=&ToDate=&RefNo=${success.id}`, {
                responseType: 'blob',
            })
                .then((response) => {
                    // console.log("response ----->>> ", response)
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank', `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`)
                })
                .catch((error) => {
                    console.error('Error fetching PDF:', error);
                });


        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="page-content">
            {
                loading === true ? (<CustomSpinner />)
                    :
                    (
                        <>

                            <Container fluid>
                                <div>
                                    <Breadcrumbs title="Transaction" breadcrumbItem="Voucher / Unpost Voucher" />
                                </div>
                                <Card>
                                    <CardBody>
                                        <CardHeader>
                                            <h3 className="text-center">UNPOST VOUCHER SCREEN</h3>
                                        </CardHeader>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col sm={12} md={12} lg={6}>
                                                <UnpostForm
                                                    voucherRef={voucherRef}
                                                    setVoucherRef={setVoucherRef}
                                                    voucherDate={voucherDate}
                                                    setVoucherDate={setVoucherDate}
                                                    voucherAmount={voucherAmount}
                                                    setVoucherAmount={setVoucherAmount}
                                                    reason={reason}
                                                    setReason={setReason}
                                                    unpostVoucher={unpostVoucher}
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                            </Container>
                            <ToastContainer />
                        </>
                    )
            }

            <Modal
                isOpen={showUnpostModal}
                toggle={() => setShowUnpostModal(!showUnpostModal)}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                size="lg"
            >
                <ModalHeader toggle={() => setShowUnpostModal(!showUnpostModal)}>Unpost Voucher</ModalHeader>
                <ModalBody>
                    {
                        unpostSuccess && unpostSuccess?.voucherRef && (
                            <div className="text-center">
                                <h4 className="text-success">
                                    {unpostSuccess ? "Voucher has been Unpost successfully" : null}
                                </h4>
                                <h4 className="text-success">Ref No: {unpostSuccess.voucherRef}</h4>
                            </div>
                        )
                    }

                    {

                        error && <div className="text-center">
                            <h4 className="text-danger">{error}</h4>
                        </div>

                    }
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="danger" onClick={() => {
                        setShowUnpostModal(!showUnpostModal),
                            dispatch(addUnpostVoucherEntryFail());
                    }}>
                        Close
                    </Button>
                    {
                        unpostSuccess && unpostSuccess?.voucherRef && <Button
                            type="button"
                            color="primary"
                            onClick={() => {
                                printVoucher(),
                                    setShowUnpostModal(!showUnpostModal),
                                    dispatch(addUnpostVoucherEntryFail());
                            }}
                        >
                            Print Voucher
                        </Button>
                    }
                </ModalFooter>
            </Modal>

        </div>
    )
}

export default UnpostVoucher