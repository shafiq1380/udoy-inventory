import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { Post, REPORT_URL } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { set } from 'lodash'

const CmnSaveEditResponseModal = ({ show, responseModalClose, success, nvurl, error, modalTitle, responseId, }) => {


    const [loading, setLoading] = useState(false)
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))
    const baseUrl = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&`

    // after post show the response modal
    const [postResponseModal, setPostResponseModal] = useState(false)
    const [postSuccess, setPostSuccess] = useState(null)
    const [postError, setPostError] = useState(null)

    const history = useNavigate()
    const location = useLocation();

    const printPostedVoucher = async () => {
        const mainUrl = `${baseUrl}downloadtype=pdf&UserID=${userID}&StartDate=&EndDate=&TranAll=0&TranTypeID=0&TranID=${responseId}`
        // console.log('called ID', url)
        const popupWidth = 900;
        const popupHeight = 700;
        const left = (window.innerWidth - popupWidth) / 2;
        const top = (window.innerHeight - popupHeight) / 2;

        const response = await axios.get(mainUrl, {
            responseType: 'blob',
        })
            .then((response) => {
                setLoading(false)
                responseModalClose()
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`)
                // history(nvurl)
            })
            .catch((error) => {
                console.error('Error fetching PDF:', error);
            });
    }


    const postTransaction = () => {
        setLoading(true)
        const data = {
            id: responseId || 0,
            userId: userID,
            remarks: ""
        }
        Post('/api/v1/InvTransaction/PostInvTransaction', { data: data })
            .then(res => {
                console.log(res)
                if (res.data.success === false) {
                    responseModalClose()
                    setLoading(false)
                    setPostResponseModal(true)
                    setPostError(res?.data?.errorMessage)
                } else {
                    setPostSuccess(res?.data?.data)
                    responseModalClose()
                    setLoading(false)
                    setPostResponseModal(true)
                    // history(nvurl)
                }
            })
    }

    // console.log(postError)

    const closeModal = () => {
        if (loading === false) {
            responseModalClose()
            // if (location.pathname === nvurl) {
            //     history(nvurl)
            // } else if (!error) {
            //     history(-1)
            // }
            // history('/material-receive-from-purchase')
        }
    }

    const postResponseModalClose = (e) => {
        setPostResponseModal(false)
        closeModal()
    }

    // console.log(postResponseModal)

    return (
        <>
            <Modal size="md" isOpen={show} toggle={closeModal} >
                <div className="modal-content">
                    <ModalBody className="text-center">
                        <ModalHeader toggle={closeModal}>{modalTitle}</ModalHeader>
                        {
                            error ? <h4 className='text-danger py-4'> {error}</h4> :

                                <ModalBody>
                                    {
                                        loading ? <CustomSpinner color="primary" /> :
                                            <>
                                                {/* <h4 className='text-danger'>{error?.deleteMsg || error?.successMsg}</h4> */}
                                                <h4 className='text-success'>SuccessFully {modalTitle}</h4>
                                            </>
                                    }
                                </ModalBody>
                        }
                        <ModalFooter>
                            <Button disabled={loading} color='danger' onClick={closeModal}>Close</Button>
                            {error ? null :
                                <>
                                    <Button disabled={loading} color='success px-4 py-2' onClick={printPostedVoucher}>Print</Button>
                                    <Button disabled={loading} color='primary px-4 py-2' onClick={postTransaction}>Post</Button>
                                </>
                            }
                        </ModalFooter>
                    </ModalBody>
                </div>
            </Modal >

            <ResponseModal
                show={postResponseModal}
                success={postSuccess}
                error={postError}
                responseModalClose={postResponseModalClose}
                modalTitle={modalTitle}
                // userID={userID}
                // transactionId={transactionId}
                printPdf={printPostedVoucher}
            />
        </>
    )
}

export default CmnSaveEditResponseModal







const ResponseModal = ({ show, responseModalClose, success, error, modalTitle, printPdf }) => {

    const printPostedVoucher = async () => {
        printPdf()
        responseModalClose()
    }

    // console.log(success)

    return (
        <Modal size="md" isOpen={show} toggle={responseModalClose} >
            <div className="modal-content">
                <ModalBody className="text-center">
                    <ModalHeader toggle={responseModalClose}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {error && <p className='text-danger fs-3'>{error}</p>}
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