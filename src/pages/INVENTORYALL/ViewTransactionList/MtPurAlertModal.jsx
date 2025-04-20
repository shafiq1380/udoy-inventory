import PropTypes from 'prop-types'
import React, { useState } from "react"
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { addVoucherEntryFail, addVoucherEntrySuccess } from '../../../store/debit-payment-voucher/actions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { REPORT_URL } from '../../../utils/https';
import { useNavigate } from 'react-router-dom';
import { deleteTransaction, postTransaction } from '../../../store/current-stock/actions';


const MtPurAlertModal = (
    { show, modalTitle, onCloseClick, modalText,
        btnValue, transactionId, review, reloadPageHandler
    }
) => {

    // console.log(transactionId)

    const [inputValue, setInputValue] = useState()

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const { userID } = useSelector(state => state.Login.userInformation)

    const baseUrl = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&`

    const [responseModal, setResponseModal] = useState(false)

    const { error, success, loading } = useSelector(state => state.currentStockReducer);

    const dispatch = useDispatch()


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


    const handleBtnClick = () => {
        if (btnValue === 'print') {
            printPdf()
            onCloseClick()

        } else if (btnValue === 'post') {

            const data = {
                id: transactionId,
                userId: userID,
                remarks: ""
            }
            dispatch(postTransaction(data))
            if (loading === false) {
                setResponseModal(true)
                onCloseClick()
                // reloadPageHandler()
            }
        } else if (btnValue === 'delete') {
            const data = {
                id: transactionId,
                userId: userID,
                remarks: ""
            }
            dispatch(deleteTransaction(data))
            if (loading === false) {
                setResponseModal(true)
                onCloseClick()
                // reloadPageHandler()
            }
        }
        else if (btnValue === 'Review') {
            const data = {
                data: {
                    id: transactionId,
                    userID: userID,
                    reviewReason: inputValue
                }
            }
            // dispatch(reviewVoucher(data))
            if (loading === false) {
                setResponseModal(true)
                onCloseClick()
                setInputValue()
            }
        }
    }

    const responseModalClose = (e) => {
        // e.stopPropagation()
        setResponseModal(false)
        dispatch(addVoucherEntrySuccess(null))
        dispatch(addVoucherEntryFail(null))
        // reloadPageHandler()
        //navigate('/debit-payment-voucher')
    }


    return (
        <>

            <Modal size="md" isOpen={show} toggle={() => {
                onCloseClick()
                setInputValue()
                //navigate('/debit-payment-voucher')
            }} >
                <div className="modal-content">
                    <ModalBody className="text-center">
                        <ModalHeader toggle={() => {
                            onCloseClick()
                            setInputValue()
                            //navigate('/debit-payment-voucher')
                        }}>{modalTitle}</ModalHeader>
                        <ModalBody>
                            <p className={`${review ? 'text-start' : ''} fs-2`}>{modalText}</p>
                            {/* {error && <p className='text-danger'>{error}</p>} */}
                            {review &&
                                <Input
                                    bsSize="sm"
                                    type="textarea"
                                    rows="4"
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color='danger' onClick={() => {
                                onCloseClick()
                                setInputValue()
                                // navigate('/debit-payment-voucher')
                            }}>Cancel</Button>
                            {
                                review ?
                                    <Button
                                        color='success'
                                        onClick={handleBtnClick}
                                        disabled={!inputValue}
                                    >
                                        {loading ? 'Loading' : 'Confirm'}
                                    </Button>

                                    :
                                    <Button
                                        color='success'
                                        onClick={handleBtnClick}>
                                        {loading ? 'Loading' : 'Confirm'}

                                    </Button>
                            }
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



export default MtPurAlertModal



const ResponseModal = ({ show, responseModalClose, success, error, modalTitle, printPdf }) => {

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))


    const printPostedVoucher = async () => {
        printPdf()
        responseModalClose()
    }

    // console.log(success?.id)

    return (
        <Modal size="md" isOpen={show} toggle={responseModalClose} >
            <div className="modal-content">
                <ModalBody className="text-center">
                    <ModalHeader toggle={responseModalClose}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {/* <p className='fs-2'>{modalText}</p> */}
                        {error ? <p className='text-danger fs-3'>{error}</p> :
                            <p className='text-success fs-3'>Transaction successfully</p>}

                        {success?.successMsg && <span className='text-success fs-3'>{success?.successMsg}</span>}
                        {success?.deleteMsg && <span className='text-danger fs-3'>{success?.deleteMsg}</span>}
                        {success?.id && <span className='text-success fs-3'>Transaction posted successfully</span>}
                        {success?.id && <p className='text-success fs-3'> Posted  Reference Number</p>}
                        {success?.id && <p className='text-info fs-3' style={{ fontWeight: '500' }}>
                            <span className='text-muted'>Ref: </span>{success?.voucherRef}</p>}

                    </ModalBody>

                    <ModalFooter>
                        {
                            success?.deleteMsg || success?.successMsg ?
                                <Button color='danger' onClick={responseModalClose}>Close</Button>
                                :
                                <>
                                    <Button color='danger' onClick={responseModalClose}>Close</Button>
                                    <Button color='primary px-4 py-2' onClick={printPostedVoucher}>Print</Button>
                                </>
                        }
                    </ModalFooter>
                </ModalBody>
            </div>
        </Modal >
    )
}