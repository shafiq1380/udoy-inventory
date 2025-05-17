import React, { useEffect, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, Card, CardBody, Col,
    Container,
    FormGroup, Input, InputGroup, Label, Row,
    Table,
    UncontrolledTooltip
} from 'reactstrap';

import { useSelector } from 'react-redux';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import { authorization } from '../../../components/Common/Authorization';
import { Link } from 'react-router-dom';
import { BASE_URL, Post, REPORT_URL, fileUploadURL } from '../../../utils/https';
import axios from 'axios';
import ShowTransactionDetails from './ShowTransactionDetails';
import CustomSpinner from '../../../components/Common/CustomSpinner';
import MtPurAlertModal from './MtPurAlertModal';
import { AiFillInfoCircle } from 'react-icons/ai';



const ViewTransactionList = () => {

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0])
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0]);
    const [tranSactionList, setTransactionList] = useState([])
    const [tranSactionTypeList, setTransactionTypeList] = useState([])
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [tranID, setTranID] = useState(null)
    const [tranRef, setTranRef] = useState(null);

    const [showModal, setShowModal] = useState(false)
    const [transactionId, settransactionId] = useState(null)

    const [trnTypeId, setTrnTypeId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    //tool tip
    const [tooltipData, setTooltipData] = useState();


    //from local database
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const { userID } = useSelector(state => state.Login.userInformation)

    const baseUrl = `${REPORT_URL}/api/InvReport/GetItemTransactionDetailReport?cCode=${cCode}&auth=${token}&`

    const showTransactionData = async () => {
        setIsLoading(true)
        const data = {
            fromtDate: transactionFrom,
            toDate: transactionTo,
            trnType: trnTypeId,
            tranRef: tranRef
        }

        // console.log("data", data);

        Post('/api/v1/InvTransaction/GetTransactionList', { data: data })
            .then(res => {
                setIsLoading(false)
                setTransactionList(res.data.data)
            })
    }


    const getTransactionList = async () => {
        Post('/api/v1/InvTransaction/GetTransactionTypeList', { data: 0 })
            .then(res => setTransactionTypeList(res.data.data))
    }

    //fetch hover Data
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

    const handleTypeChange = (e) => {
        setTrnTypeId(e.target.value)
    }


    //print function
    const printPostedTransaction = async (id) => {
        const mainUrl = `${baseUrl}downloadtype=pdf&UserID=${userID}&StartDate=&EndDate=&TranAll=0&TranTypeID=0&TranID=${id}`

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

    //attachment function
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

    //view Derails Modal
    const viewTranDetails = (id, ref) => {
        setTranID(id)
        setTranRef(ref)
        setShowDetailsModal(!showDetailsModal)
    }

    const handleCloseModal = () => {
        setTranID(null)
        setShowDetailsModal(!showDetailsModal)
    }



    const modalClose = () => {
        setShowModal(!showModal)
    }


    useEffect(() => {
        getTransactionList()
    }, [])

    //Authorization check
    useEffect(() => {
        authorization(83)
    }, [])

    // console.log(tranSactionList)

    // console.log('From', transactionFrom)
    // console.log('To', transactionTo)


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Transaction List'} breadcrumbItem={'Transaction List'} />
                <Col xs="12">
                    <Card>
                        <CardBody>

                            <FormGroup row>
                                <Label for="transactionFrom" md={3} sm={2} size="lg">Transaction Date From</Label>
                                <Col sm={10} md={4}>
                                    <InputGroup size='lg'>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder="dd/mm/yyyy"
                                            options={{
                                                altInput: true,
                                                altFormat: "d/m/Y",
                                                allowInput: true,
                                            }}
                                            id="date"
                                            name="date"
                                            onChange={(selectedDates, dateStr) => settransactionFrom(dateStr)}
                                            onClose={(selectedDates, dateStr) => settransactionFrom(dateStr)}
                                            onReady={(selectedDates, dateStr, instance) => {
                                                const inputElement = instance.altInput;
                                                if (inputElement) {
                                                    inputElement.addEventListener('focus', (e) => e.target.select());
                                                }
                                            }}
                                            value={transactionFrom}
                                        />
                                    </InputGroup>

                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="dateTo" md={3} sm={2} size="lg">Transaction Date To</Label>
                                <Col sm={10} md={4}>
                                    <InputGroup size='lg'>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder="dd/mm/yyyy"
                                            options={{
                                                altInput: true,
                                                altFormat: "d/m/Y",
                                                allowInput: true,
                                            }}
                                            id="date"
                                            name="date"
                                            onChange={(selectedDates, dateStr) => settransactionTo(dateStr)}
                                            onClose={(selectedDates, dateStr) => settransactionTo(dateStr)}
                                            onReady={(selectedDates, dateStr, instance) => {
                                                const inputElement = instance.altInput;
                                                if (inputElement) {
                                                    inputElement.addEventListener('focus', (e) => e.target.select());
                                                }
                                            }}
                                            value={transactionTo}
                                        />
                                    </InputGroup>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="journalType" md={3} sm={2} size="lg">Transaction Type</Label>
                                <Col sm={10} md={4}>
                                    <select
                                        style={{ height: '45px' }}
                                        className="form-select"
                                        id='activeStatus'
                                        name="trnType"
                                        onChange={handleTypeChange}
                                    >
                                        <option value={0}>All</option>
                                        {tranSactionTypeList?.map((trnType) => (
                                            <option key={trnType.id} value={trnType.id}>{trnType.trnDesc}</option>
                                        ))}
                                    </select>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="journalType" md={3} sm={2} size="lg">Transaction Ref</Label>
                                <Col sm={10} md={4}>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="All"
                                        id="trnRef"
                                        name="trnRef"
                                        onChange={(e) => setTranRef(e.target.value)}
                                    />
                                </Col>
                            </FormGroup>

                            {/* btn for show and export report */}
                            <Row >
                                <Col className='text-end' md={7} sm={12}>

                                    <Button
                                        type="button"
                                        color="success"
                                        className="px-5"
                                        onClick={showTransactionData}
                                    >
                                        Show
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>
                </Col>

                <Card>
                    <CardBody>
                        <Row>
                            {
                                isLoading ?
                                    <CustomSpinner />
                                    :
                                    tranSactionList &&
                                    <div className="table-responsive-sm p-4">
                                        {
                                            tranSactionList.length > 0 ?
                                                <Table className="table  table-bordered  " width="100%" style={{ border: '1px solid #000000' }}>
                                                    <thead>
                                                        <tr >
                                                            <th className='p-2' >
                                                                #ID
                                                            </th>
                                                            <th className='p-2'>
                                                                TrnRefNo
                                                            </th>
                                                            <th className='p-2'>
                                                                Created Date
                                                            </th>
                                                            <th className='p-2'>
                                                                TrnDesc
                                                            </th>
                                                            <th className='p-2'>
                                                                PartnerName
                                                            </th>

                                                            <th className='text-center p-2'>
                                                                LinAmount
                                                            </th>
                                                            <th className='text-center p-2'>
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {
                                                            tranSactionList.map((item, index) => (
                                                                <tr className="p-2" key={index}>
                                                                    <td className="col-1 p-2 ">
                                                                        {item?.id}
                                                                        < AiFillInfoCircle
                                                                            onMouseOver={() => fetchData(item?.id)}
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
                                                                    <td className="col-2 p-2">
                                                                        {item?.trnRefNo}
                                                                    </td>
                                                                    <td className="col-1 p-2">
                                                                        {item?.trnDate?.split('T')[0]}
                                                                    </td>
                                                                    <td className="col-1 p-2">
                                                                        {item?.trnDesc}
                                                                    </td>
                                                                    <td className="col-1 p-2">
                                                                        {item?.partnerName}
                                                                    </td>
                                                                    <td className="col-1 p-2 text-end">
                                                                        {item?.linAmount}
                                                                    </td>

                                                                    <td className="col-5 text-center px-0">
                                                                        <Button onClick={() => handleAttachment(item?.id)} color="success m-1">Attachment</Button>

                                                                        {/* <Button
                                                                            color="danger m-1"
                                                                            onClick={() => {
                                                                                settransactionId(item?.id)
                                                                                setShowModal(!showModal)
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </Button> */}

                                                                        {/* <Link to={`/transaction-edit/${item.id}`}
                                                                            state={{ id: item?.id }}>
                                                                            <Button color="primary m-1">Edit</Button>
                                                                        </Link> */}

                                                                        {/* <Button onClick={() => handleClickBtn('Review', item?.invTransactionHdr.id)} color="warning m-1">Remark</Button> */}
                                                                        <Button onClick={() => printPostedTransaction(item?.id)} color="success m-1">Print</Button>
                                                                        <Button onClick={() => viewTranDetails(item?.id, item?.trnRefNo)} color="primary m-1">View Details</Button>
                                                                        {/* <Button onClick={() => handleClickBtn('delete', item?.invTransactionHdr.id)} color="danger m-1">Delete</Button> */}
                                                                    </td>
                                                                </tr>

                                                            ))
                                                        }
                                                    </tbody>
                                                </Table> :
                                                <p className='text-center display-5 p-3'>No Data</p>
                                        }
                                    </div>
                            }
                        </Row>
                    </CardBody>
                </Card>

            </Container>

            <ShowTransactionDetails
                show={showDetailsModal}
                handleCloseModal={handleCloseModal}
                tranID={tranID}
                showModal={showModal}
                tranRef={tranRef}

            />


            <MtPurAlertModal
                show={showModal}
                onCloseClick={modalClose}
                modalTitle={'Delete'}
                btnValue={'delete'}
                modalText={'Do you want to delete this transaction?'}
                transactionId={transactionId}
            // reloadPageHandler={reloadPageHandler}
            />

        </div>
    )
}

export default ViewTransactionList