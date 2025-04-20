/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
} from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { REPORT_URL } from '../../utils/https';


const VoucherEditSuccessModal = ({ successModal, setSuccessModal, handleClickBtn }) => {

    const { userID } = useSelector(state => state.Login.userInformation)
    const { success, error } = useSelector(state => state.voucherUpdateReducer);

    const popupWidth = 900;
    const popupHeight = 700;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    const history = useNavigate()

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))

    const printVoucher = () => {
        try {
            axios.get(`${REPORT_URL}/api/VoucherReport/GetVoucherReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&Posted=1&VoucherType=&FromDate=&ToDate=&RefNo=${success.data}`, {
                responseType: 'blob',
            })
                .then((response) => {
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
        <div>
            <Modal
                isOpen={successModal}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => {
                    setSuccessModal(!successModal), success ? history('/debit-payment-voucher') : null
                }}
                size="lg"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => { setSuccessModal(!successModal), success ? history('/debit-payment-voucher') : null }}> </ModalHeader>
                    <ModalBody>
                        {
                            success ? (
                                <div className="text-center">
                                    <h4 className="text-success">{success.success === true ? 'Voucher has been update successfully' : null}.</h4>
                                    <h4 className="text-success">Ref No: {success.data}</h4>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h4 className="text-danger">{error}</h4>
                                </div>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="danger" onClick={() => { setSuccessModal(!successModal), success ? history('/debit-payment-voucher') : null }}>
                            Close
                        </Button>
                        {
                            success && <Button type="button" color="success" onClick={() => {
                                handleClickBtn('post')
                                setSuccessModal(!successModal)
                            }}>
                                Post
                            </Button>
                        }
                        {
                            success && <Button type="button" color="primary" onClick={() => { printVoucher(), setSuccessModal(!successModal), success ? history('/debit-payment-voucher') : null }}>
                                Print
                            </Button>
                        }
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    )
}

export default VoucherEditSuccessModal