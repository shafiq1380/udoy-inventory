import PropTypes from 'prop-types'
import React, { useState } from "react"
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { addVoucherEntryFail, addVoucherEntrySuccess } from '../../../store/debit-payment-voucher/actions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Post, REPORT_URL } from '../../../utils/https';
import { useNavigate } from 'react-router-dom';
import { deleteTransaction, failedTransaction, postTransaction, successTransaction } from '../../../store/current-stock/actions';
import CustomSpinner from '../../../components/Common/CustomSpinner';


const MtPurAlertModals = (
    { show, modalTitle, onCloseClick, modalText,
        btnValue, transactionId, review, reloadPageHandler
    }
) => {

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const { userID } = useSelector(state => state.Login.userInformation)

    const baseUrl = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&`

    const [responseModal, setResponseModal] = useState(false)

    const { error, success } = useSelector(state => state.currentStockReducer);

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    // console.log(success)

    //print pdf fucntion
    const printPdf = async () => {

        const mainUrl = `${baseUrl}downloadtype=pdf&UserID=${userID}&StartDate=&EndDate=&TranAll=0&TranTypeID=0&TranID=${transactionId}`

        const popupWidth = 900;
        const popupHeight = 700;
        const left = (window.innerWidth - popupWidth) / 2;
        const top = (window.innerHeight - popupHeight) / 2;

        const response = await axios.get(mainUrl, {
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

    }

    const btnClickApiCall = async (url, data) => {
        setLoading(true)
        const res = await Post(`/api/InvTransaction/${url}`, { data: data })
            .then(res => {
                // console.log(res)
                if (res.data.success === true) {
                    setLoading(false)
                    dispatch(successTransaction(res.data.data))
                    setResponseModal(true)
                    onCloseClick()
                } else {
                    setLoading(false)
                    dispatch(failedTransaction(res.data.errorMessage))
                    setResponseModal(true)
                    onCloseClick()
                }
            })
    }


    const handleBtnClick = () => {
        const data = {
            id: transactionId,
            userId: userID,
            remarks: ""
        }

        if (btnValue === 'print') {
            printPdf()
            onCloseClick()

        } else if (btnValue === 'post') {
            btnClickApiCall('PostInvTransaction', data)
        } else if (btnValue === 'delete') {
            btnClickApiCall('DeleteInvTransaction', data)
        }
    }

    const responseModalClose = (e) => {
        // e.stopPropagation()
        setResponseModal(false)
        reloadPageHandler()
        dispatch(successTransaction({}))
        dispatch(failedTransaction(null))
        //navigate('/debit-payment-voucher')
    }


    return (
        <>

            <Modal size="md" isOpen={show} toggle={() => {
                if (loading === false) {
                    onCloseClick()
                }
                //navigate('/debit-payment-voucher')
            }} >
                <div className="modal-content">
                    <ModalBody className="text-center">
                        <ModalHeader toggle={() => {
                            if (loading === false) {
                                onCloseClick()
                            }
                            //navigate('/debit-payment-voucher')
                        }}>{modalTitle}</ModalHeader>

                        <ModalBody>
                            {
                                loading ?
                                    <CustomSpinner /> :
                                    <p className='fs-2'>{modalText}</p>

                            }

                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color='danger'
                                onClick={onCloseClick}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                disabled={loading}
                                color='success'
                                onClick={handleBtnClick}>
                                Confirm
                            </Button>

                        </ModalFooter>
                    </ModalBody>
                </div>
            </Modal >

            <ResponseModal
                show={responseModal}
                success={success}
                error={error}
                responseModalClose={responseModalClose}
                modalTitle={modalTitle}
                userID={userID}
                transactionId={transactionId}
                printPdf={printPdf}
            />
        </>
    )
}



export default MtPurAlertModals



const ResponseModal = ({ show, responseModalClose, success, error, modalTitle, printPdf }) => {

    const printPostedVoucher = async () => {
        printPdf()
        responseModalClose()
    }

    // console.log('From Modal', success)

    return (
        <Modal size="md" isOpen={show} toggle={responseModalClose} >
            <div className="modal-content">
                <ModalBody className="text-center">
                    <ModalHeader toggle={responseModalClose}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {/* <p className='fs-2'>{modalText}</p> */}
                        {/* {error ? <p className='text-danger fs-3'>{error}</p> :
                            <p className='text-success fs-3'>Transaction successfully</p>} */}
                        {error && <p className='text-danger fs-3'>{error}</p>}

                        {success >= 0 && error === null && <p className='text-danger fs-3'>{"Deleted successfully"}</p>}

                        {success?.id && <span className='text-success fs-3'>Transaction posted successfully</span>}
                        {success?.id && <p className='text-success fs-3'> Posted  Reference Number</p>}
                        {success?.id && <p className='text-info fs-3' style={{ fontWeight: '500' }}>
                            <span className='text-muted'>Ref: </span>{success?.trnRefNo}</p>}

                    </ModalBody>

                    <ModalFooter>
                        <Button color='danger' onClick={responseModalClose}>Close</Button>
                        <Button color='primary px-4 py-2' onClick={printPostedVoucher}>Print</Button>
                    </ModalFooter>
                </ModalBody>
            </div>
        </Modal >
    )
}