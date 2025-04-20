import React, { useEffect, useState } from 'react'
import Flatpickr from "react-flatpickr";
import { Button, ButtonDropdown, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, InputGroup, Label, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { blcSlsDownloadVoucherReport, blcSlsShowPdfGenerator } from './BalanceSheetPdfHO';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { authorization } from '../../components/Common/Authorization';



const BalanceSheetHO = () => {

    const [loading, setLoading] = useState(false)
    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)

    //period 1
    const [fstPrdStrDate, setFstPrdStrDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [fstPrdEndDate, setFstPrdEndDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    //period 2
    const [sndPrdStrDate, setSndPrdStrDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [sndPrdEndDate, setSndPrdEndDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));


    const incomeShowPdf = () => {
        setLoading(!loading)
        const pefLink = blcSlsShowPdfGenerator(fstPrdEndDate, sndPrdEndDate);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        blcSlsDownloadVoucherReport(
            fstPrdEndDate, sndPrdEndDate,
            type
        )

    }


    //Authorization check
    useEffect(() => {
        authorization(67)
    }, [])



    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={'Balance Sheet (HO)'} breadcrumbItem={' Balance Sheet (HO)'} />
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>

                                {/* period 1 */}

                                <Label className='text-primary' size="lg">Period 1</Label>
                                <Row>
                                    <Col md={4}>
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true,
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={(selectedDates, dateStr) => setFstPrdEndDate(dateStr)}
                                                onClose={(selectedDates, dateStr) => setFstPrdEndDate(dateStr)}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={fstPrdEndDate}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>


                                {/* period 2 */}
                                <Label for="transactionFrom" className='text-primary mt-md-3' size="lg">Period 2</Label>
                                <Row>

                                    <Col md={4} >
                                        <InputGroup size='lg'>
                                            <Flatpickr
                                                className="form-control"
                                                placeholder="dd/mm/YYYY"
                                                options={{
                                                    dateFormat: "d/m/Y",
                                                    altInput: true,
                                                    altFormat: "d/m/Y",
                                                    allowInput: true,
                                                }}
                                                id="date"
                                                name="date"
                                                onChange={(selectedDates, dateStr) => setSndPrdEndDate(dateStr)}
                                                onClose={(selectedDates, dateStr) => setSndPrdEndDate(dateStr)}
                                                onReady={(selectedDates, dateStr, instance) => {
                                                    const inputElement = instance.altInput;
                                                    if (inputElement) {
                                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                                    }
                                                }}
                                                value={sndPrdEndDate}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>


                                {/* btn for show and export report */}
                                <Row className='mt-md-3 text-end'>
                                    <Col md={4}>
                                        <Col md={12} className='text-left'>
                                            <Button
                                                type="button"
                                                color="success"
                                                className="btn-rounded px-4"
                                                onClick={incomeShowPdf}
                                            >
                                                Preview
                                            </Button>

                                            <ButtonDropdown
                                                toggle={() => { setBtnDropdown(!btnDropdown) }}
                                                isOpen={btnDropdown}
                                            >
                                                <DropdownToggle color="white border border-white p-1" caret>
                                                    <Button
                                                        type="button"
                                                        color="primary"
                                                        className="btn-rounded px-4"
                                                    >
                                                        Export Report
                                                    </Button>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => handleDownloadReport('pdf')}>Export TO PDF</DropdownItem>
                                                    <DropdownItem onClick={() => handleDownloadReport('doc')}>Export To Word</DropdownItem>
                                                    <DropdownItem onClick={() => handleDownloadReport('xls')}>Export To Excel</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                        </Col>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>
                    <Row style={{ height: '100vh', marginBottom: '20px' }}>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                <iframe src={pdfLink} width="100%" height="100%" frameBorder="0"></iframe>

                        }
                    </Row>
                </Row>
            </Container>
        </div>
    )
}

export default BalanceSheetHO