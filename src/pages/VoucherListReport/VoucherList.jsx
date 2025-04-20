import React, { useEffect, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, Input, InputGroup, Label, Row, Table, UncontrolledTooltip
} from 'reactstrap';

import Breadcrumb from '../../components/Common/Breadcrumb';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { Post, REPORT_URL } from '../../utils/https';
import { AiFillInfoCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { authorization } from '../../components/Common/Authorization';


const VoucherList = () => {

    // const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0])
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0]);

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const { userID } = useSelector(state => state.Login.userInformation)


    //tool tip
    const [tooltipData, setTooltipData] = useState();
    const [voucherList, setVoucherList] = useState()
    const [voucherType, setVoucherType] = useState()
    const [voucherData, setVoucherData] = useState({
        amount: '',
        vouvherType: '',
    })


    const fetchVoucherList = () => {
        setLoading(!loading)
        const data = {
            data: {
                startDate: transactionFrom,
                endDate: transactionTo,
                amount: voucherData.amount || 0,
                voucherType: voucherData.vouvherType || 'All',
            }
        }
        try {
            Post('/api/VoucherEntry/GetVoucherList', data)
                .then(res => {
                    setLoading(false)
                    setVoucherList(res.data.data)
                })
        } catch (error) {

        }

    }

    //print the file
    const handleClickBtn = async (voucherId) => {

        const baseUrl = `${REPORT_URL}/api/VoucherReport/GetVoucherReport?cCode=${cCode}&auth=${token}&`

        const mainUrl = `${baseUrl}downloadtype=pdf&UserID=${userID}&Posted=1&VoucherType=&FromDate=&ToDate=&RefFrom=${voucherId}&RefNo=${voucherId}`

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


    // tool tip
    const fetchData = async (id) => {
        const data = {
            data: id
        }
        try {
            Post('/api/VoucherEntry/GetVoucherToolTipByID', data)
                .then(res => setTooltipData(res.data.data))
        } catch (error) {

        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target
        const updateVaue = { ...voucherData, [name]: value }
        setVoucherData(updateVaue)
    }


    const getVoucherType = () => {
        const data = {
            data: 1
        }
        try {
            Post('/api/VoucherType/GetAllVouchertype', data)
                .then(res => setVoucherType(res.data.data))
        } catch (error) {

        }
    }



    //Authorization check
    useEffect(() => {
        authorization(53)
    }, [])

    useEffect(() => {
        getVoucherType()
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Voucher List'} breadcrumbItem={'Voucher List'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                <FormGroup row>
                                    <Label for="transactionFrom" md={3} sm={2} size="lg">Transaction Date From</Label>
                                    <Col sm={10} md={4}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "Y-m-d",
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
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "Y-m-d",
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
                                    <Label for="journalType" md={3} sm={2} size="lg">Voucher Type</Label>
                                    <Col sm={10} md={4}>
                                        <select
                                            style={{ height: '45px' }}
                                            className="form-select"
                                            aria-label="Default select example"
                                            id='activeStatus'
                                            name="vouvherType"
                                            onChange={handleChange}
                                        // value={newData.status}
                                        >
                                            <option value={''}>All</option>
                                            {voucherType?.map((journal) => (
                                                <option key={journal.id} value={journal.jrnType}>{journal.jrnDescription}</option>
                                            ))}
                                        </select>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="referenceNumber" md={3} sm={2} size="lg">Amount</Label>
                                    <Col sm={10} md={4}>
                                        <Input
                                            type='number'
                                            id="referenceFrom"
                                            name="amount"
                                            placeholder='Any'
                                            className='custom-input'
                                            bsSize="lg"
                                            onChange={handleChange}
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
                                            onClick={fetchVoucherList}
                                        >
                                            Show
                                        </Button>

                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Row>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                voucherList &&
                                <Card className="table-responsive-sm p-4">
                                    {
                                        voucherList.length > 0 ? <Table className="table  table-bordered  " width="100%" style={{ border: '1px solid #000000' }}>
                                            <thead>
                                                <tr>
                                                    {/* <th className='col-1'>S/N</th> */}
                                                    <th className='col-1'>ID</th>
                                                    <th className='col-2'>userName</th>
                                                    <th className='col-2'>VoucherRef</th>
                                                    <th className='col-2'>Entry Date</th>
                                                    <th className='col-2'>TR Date</th>
                                                    <th className='col-1 text-end'>Amount</th>
                                                    <th className='col-2 text-center'>Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    voucherList?.map((data, index) => (
                                                        <tr key={index}>
                                                            {/* <td>{index + 1}</td> */}
                                                            <td>
                                                                {data.id}
                                                                < AiFillInfoCircle
                                                                    onMouseOver={() => fetchData(data.id)}
                                                                    id="edittooltip"
                                                                    size={20}
                                                                    color='#704cb6'
                                                                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                                                                />

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
                                                            <td>{data.userName}</td>
                                                            <td>{data.voucherRef}</td>
                                                            <td>
                                                                {data.entryDate.replace('T', ' ').slice(0, 10).split('-').reverse().join('-')}
                                                                {data.entryDate.replace('T', ' ').slice(10, 16)}
                                                            </td>
                                                            <td>{data.trnDate.replace('T', ' ').slice(0, 10).split('-').reverse().join('-')}</td>
                                                            <td className='text-end fw-bold'>{data.amount}</td>
                                                            <td className='text-center'>
                                                                <Button onClick={() => handleClickBtn(data.id)} color="success m-1">Print</Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table > :
                                            <p className='text-center display-5 p-3'>No Data</p>
                                    }
                                </Card>
                        }
                    </Row>
                </Row>
            </Container >
        </div >
    )
}

export default VoucherList