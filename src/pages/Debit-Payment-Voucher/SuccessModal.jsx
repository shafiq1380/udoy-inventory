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
import { tabChange } from '../../store/voucher-tab-change/actions';
import { REPORT_URL } from '../../utils/https';
const SuccessModal = ({ successModal, setSuccessModal, resetForm, }) => {

    // console.log("resetForm ----->>> ", resetForm)

    const { userID } = useSelector(state => state.Login.userInformation)
    const { error, success } = useSelector(state => state.voucherEntryReducer);

    const dispatch = useDispatch();

    // console.log("success modal ----->>> ", success.data)
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))

    const popupWidth = 900;
    const popupHeight = 700;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    // const refFrom = successMsg && successMsg?.split(",")[1].trim();
    // const refTo = successMsg && successMsg?.split(",")[1].trim();

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
                centered={false}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => {
                    dispatch(tabChange('tab2'))
                    setSuccessModal(!successModal)
                }}
                size="lg"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => {
                        dispatch(tabChange('tab2'))
                        setSuccessModal(!successModal)
                    }}> </ModalHeader>
                    <ModalBody>
                        {
                            success ? (
                                <div className="text-center">
                                    <h4 className="text-success">{success.success === true ? 'Voucher has been saved successfully' : null}.</h4>
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
                        <Button type="button" color="danger" onClick={() => {
                            dispatch(tabChange('tab2'))
                            setSuccessModal(!successModal)
                        }}>
                            Close
                        </Button>
                        {
                            success && <Button type="button" color="primary" onClick={() => {
                                printVoucher()
                                setSuccessModal(!successModal)
                                dispatch(tabChange('tab2'))
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

export default SuccessModal