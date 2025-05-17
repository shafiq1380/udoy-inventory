import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { Post, REPORT_URL } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const SaveEditResponseModal = ({ show, responseModalClose, success, error, modalTitle, responseId }) => {


    const [loading, setLoading] = useState(false)
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))
    const baseUrl = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&`

    const history = useNavigate()
    const location = useLocation();


    const printPostedVoucher = async () => {
        const mainUrl = `${baseUrl}downloadtype=pdf&UserID=${userID}&StartDate=&EndDate=&TranAll=0&TranTypeID=0&TranID=${responseId}`

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
                history('/material-requisition-and-issue')
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`)
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
                setLoading(false)
                responseModalClose()
                history('/material-requisition-and-issue')
                // if (res.data.success === false) {

                // } else {
                // }
            })
    }

    const closeModal = () => {
        if (loading === false) {
            responseModalClose()
            if (location.pathname === '/material-requisition-and-issue') {
                history('/material-requisition-and-issue')
            } else {
                history(-1)
            }
            // history('/material-receive-from-purchase')
        }
    }

    return (
        <Modal size="md" isOpen={show} toggle={closeModal} >
            <div className="modal-content">
                <ModalBody className="text-center">
                    <ModalHeader toggle={closeModal}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {
                            loading ? <CustomSpinner color="primary" /> :
                                <>
                                    <h4 className='text-danger'>{error?.deleteMsg || error?.successMsg}</h4>
                                    <h4 className='text-success'>SuccessFully {modalTitle}</h4>
                                </>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button disabled={loading} color='danger' onClick={closeModal}>Close</Button>
                        <Button disabled={loading} color='success px-4 py-2' onClick={printPostedVoucher}>Print</Button>
                        <Button disabled={loading} color='primary px-4 py-2' onClick={postTransaction}>Post</Button>
                    </ModalFooter>
                </ModalBody>
            </div>
        </Modal >
    )
}

export default SaveEditResponseModal