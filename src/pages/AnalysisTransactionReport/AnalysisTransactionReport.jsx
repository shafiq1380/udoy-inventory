import React, { useEffect, useRef, useState } from 'react'

import Flatpickr from "react-flatpickr";
import {
    Button, ButtonDropdown, Card, CardBody, Col,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup, Input, InputGroup, Label, Row
} from 'reactstrap';

import Breadcrumb from '../../components/Common/Breadcrumb';
import CustomSpinner from '../../components/Common/CustomSpinner';
import Select from 'react-select';
import { analTranDownloadReport, analTranShowPdfGenerator } from './AnalysisTransactionReportFn';
import { authorization } from '../../components/Common/Authorization';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../utils/https';
import { fetchAnalTypeRequest } from '../../store/analysis-type-setup/actions';

const AnalysisTransactionReport = () => {

    //useRedux 
    const dispatch = useDispatch();

    const { anals } = useSelector(state => state.analtypeReducer)

    const [pdfLink, setpdfLink] = useState()
    const [btnDropdown, setBtnDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [analysisId, setAnalysisId] = useState()

    const [transactionFrom, settransactionFrom] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [transactionTo, settransactionTo] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));

    const [analysisList, setAnalysisList] = useState([])
    const [selectedAnalysisType, setSelectedAnalysisType] = useState();
    const [selectedAnalysis, setSelectedAnalysis] = useState({ value: 0, label: "ALL" });
    const [isGroupData, setIsGroupData] = useState(0)


    const showAnalTranReport = () => {
        setLoading(!loading)
        const pefLink = analTranShowPdfGenerator(transactionFrom, transactionTo, selectedAnalysisType?.value, selectedAnalysis?.value, isGroupData);
        pefLink.then(res => {
            setLoading(false)
            setpdfLink(res)
        })
    }

    const handleDownloadReport = (type) => {
        analTranDownloadReport(
            transactionFrom,
            transactionTo,
            selectedAnalysisType?.value,
            selectedAnalysis?.value,
            type,
            isGroupData
        )

    }

    const changeAnalysisType = (anlType) => {
        setSelectedAnalysis({ value: 0, label: "ALL" })
        setAnalysisList([])
        setSelectedAnalysisType(anlType)
        setAnalysisId(anlType?.value)
    }


    const analysisType = anals?.map(item => ({
        value: item.id,
        label: item.analysisTypeName
    }));


    const analysis = analysisList?.map(item => ({
        value: item.id,
        label: `${item.analysisCode} : ${item.analysisName}`
    }))



    const fetchAnalysis = async () => {
        const data = { data: analysisId }
        try {
            const response = await Post('/api/v1/CoaSetup/GetAllAnalysisCodeByType', data)
                .then(res => setAnalysisList([{ id: 0, analysisCode: 0, analysisName: "ALL" }, ...res.data.data,]))
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        dispatch(fetchAnalTypeRequest())
    }, [])


    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            fetchAnalysis()
        } else {
            isMounted.current = true;
        }
    }, [analysisId])

    //Authorization check
    useEffect(() => {
        authorization(113)
    }, [])


    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };



    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb title={' Analysis Transaction Report'} breadcrumbItem={' Analysis Transaction Report'} />
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
                                                    dateFormat: "d/m/Y",
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
                                                    dateFormat: "d/m/Y",
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
                                            >

                                            </Flatpickr>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="journalType" md={3} sm={2} size="lg">Analysis Type</Label>
                                    <Col sm={10} md={4}>
                                        <Select
                                            value={selectedAnalysisType}
                                            onChange={changeAnalysisType}
                                            options={analysisType}
                                            styles={customStyles}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="journalType" md={3} sm={2} size="lg">Analysis</Label>
                                    <Col sm={10} md={4}>
                                        <Select
                                            value={selectedAnalysis}
                                            onChange={setSelectedAnalysis}
                                            options={analysis}
                                            styles={customStyles}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="option" md={3} sm={2} size="lg"></Label>
                                    <Col sm={10} md={8}>
                                        <InputGroup size='lg'>
                                            <Label check className="fs-4 ">
                                                <Input type="radio"
                                                    value={isGroupData}
                                                    checked={isGroupData === 0}
                                                    onChange={() => setIsGroupData(0)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                Detail
                                            </Label>
                                            <Label check className="fs-4 ">
                                                <Input type="radio"
                                                    value={isGroupData}
                                                    checked={isGroupData === 1}
                                                    onChange={() => setIsGroupData(1)}
                                                    className="fs-4 mx-2 border border-primary border-3 " />
                                                Summary
                                            </Label>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>


                                {/* btn for show and export report */}
                                <Row className='mt-md-3 text-end'>
                                    <Col sm={12} md={7}>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="btn-rounded px-4"
                                            onClick={showAnalTranReport}
                                            disabled={!selectedAnalysisType}
                                        >
                                            Preview
                                        </Button>
                                        <ButtonDropdown
                                            toggle={() => { setBtnDropdown(!btnDropdown) }}
                                            isOpen={btnDropdown}
                                            disabled={!selectedAnalysisType}
                                        >
                                            <DropdownToggle color="white border border-white p-1" caret>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn-rounded px-4"
                                                    disabled={!selectedAnalysisType}
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
                                </Row>
                                {/* </FormGroup> */}
                            </CardBody>
                        </Card>
                    </Col>
                    <Row style={{ height: '100vh', marginBottom: '20px' }}>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                <iframe src={pdfLink} width="100%" height="100%"></iframe>
                        }
                    </Row>
                </Row>
            </Container>
        </div >
    )
}

export default AnalysisTransactionReport