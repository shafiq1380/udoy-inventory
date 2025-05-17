
import React, { useEffect, useState } from 'react'
import { Button, Table, UncontrolledTooltip, } from 'reactstrap';
import { Post, fileUploadURL } from '../../../utils/https';
import { authorization } from '../../../components/Common/Authorization';
import { Link } from 'react-router-dom';
import MtPurAlertModal from './MtPurAlertModal';
import CustomSpinner from '../../../components/Common/CustomSpinner';
import { AiFillInfoCircle } from 'react-icons/ai';


const SavedMaterialReceiveFromProduction = ({ activeTab }) => {

    const [transactionData, setTransactionData] = useState([])


    const [showModal, setShowModal] = useState(false)
    const [review, setReviewModal] = useState(false)
    const [modalText, setModalText] = useState('')
    const [modalTitle, setmodalTitle] = useState('')
    const [btnValue, setBtnValue] = useState('')

    const [transactionId, settransactionId] = useState()

    const [reloadPage, setRealodPage] = useState(false)

    //tool tip
    const [tooltipData, setTooltipData] = useState();

    const reloadPageHandler = () => {
        setRealodPage(!reloadPage)
    }

    // console.log(reloadPage)


    const modalClose = () => {
        setReviewModal(false)
        setShowModal(!showModal)
        setBtnValue('')
    }

    const handleAttachment = (id) => {
        // console.log('first')
        const popupWidth = 900; // Set your desired width
        const popupHeight = 500; // Set your desired height
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 4;
        const url = `${fileUploadURL}catId=1&id=${id}`;
        window.open(
            url,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`
        );
    };


    const handleClickBtn = (value, id) => {
        setShowModal(!showModal)
        setBtnValue(value)
        settransactionId(id)

        if (value === 'print') {
            setModalText('Do you Want to Print The Transaction')
            setmodalTitle('Print Transaction')
        } else if (value === 'post') {
            setModalText('Do you Want to Post The Transaction')
            setmodalTitle('Post Transaction')
        } else if (value === 'Review') {
            setModalText('Add Transaction Review')
            setmodalTitle('Review Transaction')
            setReviewModal(true)
        } else {
            setModalText('Do you Want to Delete The Transaction')
            setmodalTitle('Delete Transaction')
        }
    }



    const getAllTransaction = async () => {
        const data = {
            data: {
                trnCode1: "PMR",
                trnCode2: "PMR"
            }
        }
        await Post('/api/V1/InvTransaction/GetAllSavedTransaction', data)
            .then(res => setTransactionData(res.data.data))
    }


    useEffect(() => {
        getAllTransaction()
        // console.log("first")
    }, [reloadPage, activeTab])

    const fetchData = async (id) => {
        // console.log(id)
        const data = {
            data: id
        }
        try {
            Post('/api/v1/InvTransaction/GetTransactionToolTipByID', data)
                .then(res => setTooltipData(res.data.data))
        } catch (error) {

        }
    };



    useEffect(() => {
        authorization(79)
    }, [])



    return (
        <div className="table-responsive py-4">
            {
                transactionData?.length > 0 ?
                    <Table className="table  table-bordered table-sm align-middle " width="100%" style={{ border: '1px solid #000000' }}>
                        <thead >
                            <tr >
                                <th className='p-2' >
                                    #ID
                                </th>
                                <th className='p-2'>
                                    Trn Type
                                </th>
                                <th className='p-2'>
                                    Trn Code
                                </th>
                                <th className='p-2'>
                                    Trn Date
                                </th>
                                <th className='p-2'>
                                    Entry Date
                                </th>
                                <th className='p-2'>
                                    Entry By
                                </th>
                                <th className='p-2 text-center'>
                                    Action
                                </th>
                            </tr>
                        </thead>


                        <tbody >
                            {
                                transactionData?.map((item) => (
                                    <tr className="p-2" key={item?.invTransactionHdr?.id}>
                                        <td className="col-1 p-2 ">
                                            {item?.invTransactionHdr?.id}
                                            < AiFillInfoCircle
                                                onMouseOver={() => fetchData(item?.invTransactionHdr?.id)}
                                                id="edittooltip"
                                                size={20}
                                                color='#704cb6'
                                                style={{ cursor: 'pointer' }}
                                            />
                                            {/* {item.id} */}
                                            <UncontrolledTooltip
                                                // autohide={false}
                                                style={{
                                                    backgroundColor: 'white',
                                                    maxWidth: '1100px',
                                                    // zIndex: 9999,
                                                    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)',
                                                }}
                                                placement="right" target="edittooltip">
                                                <span dangerouslySetInnerHTML={{
                                                    __html: tooltipData
                                                }} />
                                            </UncontrolledTooltip>
                                        </td>
                                        <td className="col-1 p-2">
                                            {item?.invTransactionDet[0]?.trnType}
                                        </td>
                                        <td className="col-1 p-2">
                                            {item?.invTransactionHdr?.trnCode}
                                        </td>
                                        <td className="col-1 p-2">
                                            {item?.invTransactionHdr?.trnDate?.split('T')[0]?.split('-').reverse().join('/')}
                                        </td>
                                        <td className="col-1 p-2">
                                            {item?.invTransactionHdr?.createDate?.split('T')[0]?.split('-').reverse().join('/')}
                                        </td>
                                        <td className="col-1 p-2">
                                            {item?.invTransactionHdr?.createBy}
                                        </td>

                                        <td className="col-5 text-center px-0">
                                            <Button onClick={() => handleAttachment(item?.invTransactionHdr.id)} color="success m-1">Attachment</Button>
                                            {/* <Link to={`/transaction-edit/${item?.invTransactionHdr.id}`}>
                                                <Button color="primary m-1">Edit</Button>
                                            </Link> */}

                                            <Link
                                                to={`/rcvproduction-edit/${item?.invTransactionHdr.id}`}
                                                state={{ id: item?.invTransactionHdr.id }}
                                            >
                                                <Button color="primary m-1">Edit</Button>
                                            </Link>
                                            {/* <Button onClick={() => handleClickBtn('Review', item?.invTransactionHdr.id)} color="warning m-1">Remark</Button> */}
                                            <Button onClick={() => handleClickBtn('print', item?.invTransactionHdr.id)} color="success m-1">Print</Button>
                                            <Button onClick={() => handleClickBtn('post', item?.invTransactionHdr.id)} color="primary m-1">Post</Button>
                                            <Button onClick={() => handleClickBtn('delete', item?.invTransactionHdr.id)} color="danger m-1">Delete</Button>
                                        </td>
                                    </tr>

                                ))
                            }
                        </tbody>
                    </Table>

                    : transactionData?.length === 0 ?
                        <p className='text-center fs-3 p-3'>No Data Found</p>
                        :
                        <CustomSpinner />
            }

            <MtPurAlertModal
                show={showModal}
                onCloseClick={modalClose}
                modalText={modalText}
                modalTitle={modalTitle}
                btnValue={btnValue}
                transactionId={transactionId}
                review={review}
                reloadPageHandler={reloadPageHandler}
            />

        </div >
    )
};

export default SavedMaterialReceiveFromProduction