/* eslint-disable react/prop-types */
import React from 'react'
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
} from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tabChange } from '../../store/voucher-tab-change/actions';
import { REPORT_URL } from '../../utils/https';
const VoucherUploadSuccessModal = ({ successModal, setSuccessModal }) => {

    const { userID } = useSelector(state => state.Login.userInformation)
    const { error, success } = useSelector(state => state.voucherEntryReducer);

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    // console.log("success modal ----->>> ", success.data)
    const history = useNavigate()

    const dispatch = useDispatch()

    const popupWidth = 900;
    const popupHeight = 700;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    const printVoucher = () => {
        try {
            axios.get(`${REPORT_URL}/api/VoucherReport/GetVoucherReport?cCode=${cCode}&auth=${token}&downloadtype=pdf&UserID=${userID}&Posted=1&VoucherType=&FromDate=&ToDate=&RefNo=${success.data}`, {
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
        <div>
            <Modal
                isOpen={successModal}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => {
                    dispatch(tabChange('tab2'))
                    setSuccessModal(!successModal)
                    success ? history('/debit-payment-voucher') : null
                }}
                size="lg"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => {
                        dispatch(tabChange('tab2'))
                        setSuccessModal(!successModal)
                        success ? history('/debit-payment-voucher') : null
                    }}> </ModalHeader>
                    <ModalBody>
                        {
                            success ? (
                                <div className="text-center">
                                    <h4 className="text-success">{success.success === true ? 'Voucher has been uploaded successfully' : null}.</h4>
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
                        <Button type="button" color={success ? 'success' : 'danger'} onClick={() => {
                            dispatch(tabChange('tab2'))
                            setSuccessModal(!successModal)
                            success ? history('/debit-payment-voucher') : null
                        }}>
                            {
                                success ? 'Done' : 'Close'
                            }
                        </Button>
                        {
                            success && <Button type="button" color="primary" onClick={() => {
                                printVoucher()
                                dispatch(tabChange('tab2'))
                                setSuccessModal(!successModal)
                                history('/debit-payment-voucher')
                            }}>
                                Print Voucher
                            </Button>
                        }
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    )
}

export default VoucherUploadSuccessModal