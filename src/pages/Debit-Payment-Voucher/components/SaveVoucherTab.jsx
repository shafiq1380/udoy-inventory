
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Row, Table, Card, CardBody, UncontrolledTooltip, Label } from 'reactstrap';
import Spinner from '../../../components/Common/Spinner';
import { Post, fileUploadURL } from '../../../utils/https';
import { Link } from 'react-router-dom';
import AlertModal from './AlertModal';
import { AiFillInfoCircle } from "react-icons/ai";

const SaveVoucherTab = () => {

    const { reload } = useSelector(state => state.voucherEntryReducer);
    // const dispatch = useDispatch()

    const [saveVoucherEntry, setVoucherEntry] = useState()

    const [showModal, setShowModal] = useState(false)
    const [review, setReviewModal] = useState(false)
    const [modalText, setModalText] = useState('')
    const [modalTitle, setmodalTitle] = useState('')
    const [btnValue, setBtnValue] = useState('')
    const [voucherId, setVoucherId] = useState()
    //tool tip
    const [tooltipData, setTooltipData] = useState();

    //selected voucher 
    const [selectedVoucher, setSelectedVoucher] = useState('ALL')

    const modalClose = () => {
        setReviewModal(false)
        setShowModal(!showModal)
        setBtnValue('')
        setVoucherId()
    }

    const handleClickBtn = (value, id) => {
        setShowModal(!showModal)
        setBtnValue(value)
        setVoucherId(id)

        if (value === 'print') {
            setModalText('Are you sure to Print The Voucher')
            setmodalTitle('Print Voucher')
        } else if (value === 'post') {
            setModalText('Are you sure to Post The Voucher')
            setmodalTitle('Post Voucher')
        } else if (value === 'Review') {
            setModalText('Add Voucher Review')
            setmodalTitle('Review Voucher')
            setReviewModal(true)
        } else {
            setModalText('Are you sure to Delete The Voucher')
            setmodalTitle('Delete Voucher')
        }
    }


    const getVoucherList = () => {
        try {
            Post('/api/v1/VoucherEntry/GetSavedVoucherList')
                .then(res => {
                    // console.log(res.data.data)
                    const data = res.data.data
                    setVoucherEntry(data.reverse())
                })
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getVoucherList()
        setSelectedVoucher('ALL')
    }, [reload])

    // console.log(saveVoucherEntry.reverse())

    const handleAttachment = (id) => {
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

    //tool tip
    const fetchData = async (id) => {
        const data = {
            data: id
        }
        try {
            Post('/api/v1/VoucherEntry/GetVoucherToolTipByID', data)
                .then(res => setTooltipData(res.data.data))
        } catch (error) {

        }
    };


    const savedVoucherList = saveVoucherEntry?.filter(item => {
        if (selectedVoucher === 'ALL') {
            return item
        } else if (selectedVoucher === item.voucherType) {
            return item
        }
    }
    )



    return (
        <div className="table-responsive py-4">

            <Col className="col-12 col-md-2 mb-3">
                {/* <Label className="activeStatus text-primary">
                    Select Type
                </Label> */}
                <select
                    className="form-select  fw-bold "
                    aria-label="Default select example"
                    id='activeStatus'
                    name="rStatus"
                    value={selectedVoucher}
                    onChange={(e) => setSelectedVoucher(e.target.value)}
                >
                    <option value={'ALL'}>ALL</option>
                    <option value={'JV'}>JV</option>
                    <option value={'CV'}>CV</option>
                    <option value={'CQ'}>CHQ</option>
                    <option value={'MR'}>MRS</option>
                </select>
            </Col>


            {
                saveVoucherEntry ?

                    <Table className="table  table-bordered table-sm align-middle " width="100%" style={{ border: '1px solid #000000' }}>
                        {/* <Table hover> */}
                        <thead >
                            <tr >
                                <th className='p-2' >
                                    #ID
                                </th>
                                <th className='p-2'>
                                    User
                                </th>
                                <th className='p-2'>
                                    VR Type
                                </th>
                                <th className='p-2'>
                                    TR Date
                                </th>
                                <th className='p-2'>
                                    CR  Date
                                </th>
                                <th className='p-2'>
                                    Review Comment
                                </th>
                                <th className='text-end p-2' >
                                    Amount
                                </th>
                                <th className='text-center p-2'>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                savedVoucherList?.map(item =>
                                    // added tool tips
                                    <tr key={item.id} className={`${item.reviewReason ? 'bg-danger bg-opacity-25' : ''}`}>
                                        <td className="col-1 p-2 "
                                            style={{ width: '1%' }}
                                        >
                                            < AiFillInfoCircle
                                                onMouseOver={() => fetchData(item.id)}
                                                id="edittooltip"
                                                size={20}
                                                color='#704cb6'
                                                style={{ cursor: 'pointer' }}
                                            />
                                            {item.id}
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

                                        <td className="col-1 p-2" >
                                            {item.userName}
                                        </td>
                                        <td className="col-1 p-2">
                                            {item.voucherType}
                                        </td>
                                        <td className="col-1 p-2">
                                            {item.trnDate.slice(0, 10).split('-').reverse().join('/')}
                                        </td>
                                        <td className="col-1 p-2" style={{ width: '7%' }}>
                                            {item.entryDate.replace('T', ' ').slice(0, 10).split('-').reverse().join('/')}
                                            {item.entryDate.replace('T', ' ').slice(10, 16)}
                                        </td>
                                        <td className="col-2 p-2" >
                                            {item.reviewReason}
                                        </td>
                                        <td className='text-end col-1 p-2' style={{ fontWeight: 600, }} >
                                            {item.amount}

                                            {/* {`৳ ${item.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} */}
                                        </td>
                                        <td className="col-5 text-center px-0">
                                            <Button onClick={() => handleAttachment(item.id)} color="success m-1">Attachment</Button>
                                            <Link to={`/voucher-edit/${item.id}`}>
                                                <Button color="primary m-1">Edit</Button>
                                            </Link>
                                            <Button onClick={() => handleClickBtn('Review', item.id)} color="warning m-1">Review</Button>
                                            <Button onClick={() => handleClickBtn('print', item.id)} color="success m-1">Print</Button>
                                            <Button onClick={() => handleClickBtn('post', item.id)} color="primary m-1">Post</Button>
                                            <Button onClick={() => handleClickBtn('delete', item.id)} color="danger m-1">Delete</Button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                    :
                    <Spinner />
            }

            <AlertModal
                show={showModal}
                onCloseClick={modalClose}
                modalText={modalText}
                modalTitle={modalTitle}
                btnValue={btnValue}
                voucherId={voucherId}
                review={review}
            />

        </div >

    )
}

export default SaveVoucherTab