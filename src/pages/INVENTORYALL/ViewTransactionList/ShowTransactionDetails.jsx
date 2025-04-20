import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap'
import { Post } from '../../../utils/https'
import './CustomScrollbar.css';
import TransactionDeleteModal from './TransactionDeleteModal'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import moment from 'moment';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};


const ShowTransactionDetails = ({ show, handleCloseModal, tranID, tranRef }) => {

    const [tranDetails, setTranDetails] = useState([]);
    const [tranDetailsByRef, setTranDetailsByRef] = useState([]);
    const [changeLogs, setChangeLogs] = useState([]);
    const [remarks, setRemarks] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUnPostModalOpen, setIsUnPostModalOpen] = useState(false);


    const getTransactionDetails = () => {
        Post('/api/InvTransaction/GetTransactionByID', { data: tranID })
            .then(res => setTranDetails(res.data.data))
    };

    const getTransactionDetailsByRef = () => {
        Post('/api/InvTransaction/GetTransactionByRef', { data: tranRef })
            .then(res => setTranDetailsByRef(res.data.data))
    };

    const getChangeLogs = () => {
        Post('/api/InvTransaction/GetTransactionChangeLogs', { data: tranID })
            .then(res => setChangeLogs(res.data.data))
    };

    useEffect(() => {
        if (show) {
            getTransactionDetails()
            getChangeLogs()
            getTransactionDetailsByRef()
        }
    }, [tranID, tranRef]);

    const handleDeleteTransaction = () => {
        if (!remarks || remarks === null || remarks.trim() === '') {
            toast.error("Please enter remarks", toastOptions);
            return;
        }
        setIsDeleteModalOpen(true);
    };

    const handleUnPostTransaction = () => {
        if (!remarks || remarks === null || remarks.trim() === '') {
            toast.error("Please enter remarks", toastOptions);
            return;
        }
        setIsUnPostModalOpen(true);
    };

    const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false) };

    const handleCloseUnPostModal = () => { setIsUnPostModalOpen(false) };

    const { userID } = useSelector(state => state.Login.userInformation)

    const resetForm = () => {
        setRemarks('');
        setChangeLogs([]);
        setTranDetails([]);
        handleCloseModal();
        handleCloseDeleteModal();
        handleCloseUnPostModal();
        window.location.reload()
    }

    const handleDelete = () => {
        const data = {
            data: {
                id: tranID,
                remarks: remarks.trim(),
                userId: userID
            }
        }
        Post('/api/InvTransaction/DeleteInvTransaction', data)
            .then(res => {
                if (res.data.data !== null) {
                    toast.success("Transaction Deleted Successfully", toastOptions)
                    resetForm();
                } else {
                    toast.error(res.data.errorMessage, toastOptions)
                }
            })
    };

    const handleUnPost = () => {
        const data = {
            data: {
                id: tranID,
                remarks: remarks.trim(),
                userId: userID
            }
        }
        Post('/api/InvTransaction/UnpostInvTransaction', data)
            .then(res => {
                if (res.data.data !== null) {
                    toast.success("Transaction UnPosted Successfully", toastOptions)
                    resetForm();
                } else {
                    toast.error(res.data.errorMessage, toastOptions)
                }
            })
    };

    return (
        <>
            <Modal size={'xl'} isOpen={show} toggle={handleCloseModal} >
                <div className="modal-content">
                    <ModalBody>
                        <ModalHeader toggle={handleCloseModal}>Transaction Details</ModalHeader>

                        {
                            tranDetails.length > 0 ?
                                <div className="custom-scrollbar">
                                    <ModalBody>

                                        <div>
                                            <CardHeader className="py-1 text-center">
                                                <h4 style={{ backgroundColor: 'lightGray', padding: '3px', borderRadius: '5px' }}>Transaction Header</h4>
                                            </CardHeader>
                                            <table className="table table-striped table-bordered table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>#ID</th>
                                                        <th>Trn Code</th>
                                                        <th>Trn Ref</th>
                                                        <th>Trn Date</th>
                                                        <th>Trn Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{tranDetails[0]?.invTransactionHdr?.id}</td>
                                                        <td>{tranDetails[0]?.invTransactionHdr?.trnCode}</td>
                                                        <td>{tranDetails[0]?.invTransactionHdr?.trnRefNo}</td>
                                                        <td>{tranDetails[0]?.invTransactionHdr?.trnDate?.split('T')[0]}</td>
                                                        <td>{({ 0: 'Deleted', 1: 'Saved', 2: 'Posted' }[tranDetails[0]?.invTransactionHdr?.trnStatus] || '')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <hr className="hr-1" />

                                        <div>
                                            <CardHeader className="py-1 text-center">
                                                <h4 style={{ backgroundColor: 'lightGray', padding: '3px', borderRadius: '5px' }}>Transaction Details</h4>
                                            </CardHeader>
                                            <table className="table table-striped table-bordered table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>L/No</th>
                                                        <th>Item Code</th>
                                                        <th>Item Name</th>
                                                        <th>Store Name</th>
                                                        <th>UOM</th>
                                                        <th className='text-end'>Lin Qty</th>
                                                        <th className='text-end'>Lin Rate</th>
                                                        <th className='text-end'>Lin Amount</th>
                                                        <th className='text-end'>Inv Rate</th>
                                                        <th className='text-end'>Inv Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        tranDetailsByRef?.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.lno}</td>
                                                                    <td>{item.itemCode}</td>
                                                                    <td>{item.itemDesc}</td>
                                                                    <td>{item.storeCode}</td>
                                                                    <td>{item.uom}</td>
                                                                    <td className='text-end'>{item.linQty}</td>
                                                                    <td className='text-end'>{item.linRate}</td>
                                                                    <td className='text-end'>{item.linAmount}</td>
                                                                    <td className='text-end'>{item.invRate}</td>
                                                                    <td className='text-end'>{item.invAmount}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                        <hr className="hr-1" />

                                        <div>
                                            <CardHeader className="py-1 text-center">
                                                <h4 style={{ backgroundColor: 'lightGray', padding: '3px', borderRadius: '5px' }}>Transaction Change Logs</h4>
                                            </CardHeader>
                                            <table className="table table-striped table-bordered table-sm">
                                                <thead>
                                                    <tr>
                                                        <th className='col-1'>#ID</th>
                                                        <th className='col-1'>User Id</th>
                                                        <th className='col-1'>Change Type</th>
                                                        <th className='col-2'>Change Date</th>
                                                        <th className='col-3'>Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        changeLogs?.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.id}</td>
                                                                    <td>{item.userId}</td>
                                                                    <td>{item.changeType}</td>
                                                                    <td>
                                                                        <span className='fw-bolder'> Date: </span>{moment(item.changeDate).format("DD/MM/YYYY")}
                                                                        <span className='fw-bolder'>{" - "}</span>
                                                                        <span className='fw-bolder'> Time:</span> {moment(item.changeDate).format('LT')}
                                                                    </td>
                                                                    <td>{item.changeRemarks}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </ModalBody>
                                </div>
                                :
                                <Spinner color={'success'} className='m-5' />
                        }


                        <Row>
                            <Col sm="12" md="6" lg="2">
                                <Label for="remarks" size='lg'>Remarks :</Label>
                            </Col>
                            <Col sm="12" md="6" lg="10">
                                <input id='remarks' type="text" placeholder='Remarks' className='form-control' onChange={(e) => setRemarks(e.target.value)} />
                            </Col>
                        </Row>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div></div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button color='primary' className="mx-3" onClick={handleUnPostTransaction}>Un-Posted</Button>
                                <Button color='danger' onClick={handleDeleteTransaction}>Delete</Button>
                            </div>
                            <Button color='danger' onClick={handleCloseModal}>Close</Button>
                        </div>


                    </ModalBody>

                </div>
            </Modal>

            <TransactionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                tranID={tranID}
                remarks={remarks}
                title={"Are you sure you want to delete this transaction?"}
                header={"Delete Transaction"}
                handleClick={handleDelete}
            />

            <TransactionDeleteModal
                isOpen={isUnPostModalOpen}
                onClose={handleCloseUnPostModal}
                tranID={tranID}
                remarks={remarks}
                title={"Are you sure you want to un post this transaction?"}
                header={"Un Post Transaction"}
                handleClick={handleUnPost}
            />



            <ToastContainer />
        </>
    )
}

export default ShowTransactionDetails 