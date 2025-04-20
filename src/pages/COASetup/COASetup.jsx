/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
    Container,
    Col,
    Row,
    Card,
    CardBody,
    DropdownMenu, DropdownItem,
    ButtonDropdown, DropdownToggle,
} from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoaAnalysis, fetchCoaSetupRequest } from '../../store/coa-setup/actions';
import COAItem from './COAItem';
import CustomButton from '../JournalVoucher/CustomButton';
import 'react-toastify/dist/ReactToastify.css';

import { FaSearch } from "react-icons/fa";
import { downloadExcel, downloadPdf, downloadWord } from './coaPdf';

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { authorization } from '../../components/Common/Authorization';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { coaPdf } from './coaPdf';


const COASetup = () => {

    // document.title = "COA Setup | SMART Accounting System";

    const [expandAll, setExpandAll] = useState(false);
    const [dropdownOpen, setOpen] = useState(false);
    const [analysisdropdownOpen, setAnalysisdropdownOpen] = useState(false)

    const [pdfLoading, setPdfLoading] = useState(false)
    const [pdflink, setPdfLink] = useState(null)

    const { loading, coaSetup, reloadPage } = useSelector(state => state.coaSetupReducer);


    const [searchData, setSearchData] = useState('');

    const dispatch = useDispatch();

    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))

    const coaPdfUrl = `/api/coareport/GetCoaReport?cCode=${cCode}&auth=${token}&downloadtype`
    const analysisPdfUrl = `/api/coareport/GetCoaReportWithAnalysis?cCode=${cCode}&auth=${token}&downloadtype`


    const cosShowPdf = () => {
        setExpandAll(false)
        setPdfLoading(true)
        const pefLink = coaPdf(coaPdfUrl);
        pefLink.then(res => {
            setPdfLoading(false)
            setPdfLink(res)
        })
    }

    const analysisShowPdf = () => {
        setExpandAll(false)
        setPdfLoading(true)
        const pefLink = coaPdf(analysisPdfUrl);
        pefLink.then(res => {
            setPdfLoading(false)
            setPdfLink(res)
        })
    }




    const handleSearchItem = (e) => {
        e.preventDefault();
        dispatch(fetchCoaSetupRequest(searchData))
    };

    //Authorization check
    useEffect(() => {
        authorization(9)
    }, [])

    useEffect(() => {
        dispatch(fetchCoaSetupRequest());
        dispatch(fetchCoaAnalysis())
    }, [reloadPage])


    return (
        <div className="page-content">

            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs title="Setup" breadcrumbItem="COA Setup" />
                <Row>
                    <Col lg={12} className="text-center">
                        <Card>
                            <CardBody>
                                <div className='d-flex mb-2 align-items-center flex-wrap'>
                                    <div className="mx-2">
                                        <input className="form-control rounded-pill ps-3" type="text"
                                            placeholder="Search COA" value={searchData}
                                            onChange={(e) => setSearchData(e.target.value)} />
                                    </div>
                                    <div className="mx-2 cursor-pointer">
                                        {/* <CustomButton text={"Search"} onClick={handleSearchItem} /> */}
                                        <a>
                                            <FaSearch size={24} onClick={handleSearchItem}></FaSearch>
                                        </a>
                                    </div>
                                    <div className="mx-2">
                                        {/* <CustomButton text={"Expand All"} onClick={handleExpandAll} /> */}
                                        {
                                            expandAll ?
                                                <a>
                                                    <TiArrowSortedUp
                                                        size={40}
                                                        onClick={() => setExpandAll(!expandAll)}
                                                        className='cursor-pointer'
                                                    />
                                                </a>
                                                :
                                                <a>
                                                    <TiArrowSortedDown
                                                        size={40}
                                                        onClick={() => setExpandAll(!expandAll)}
                                                    />
                                                </a>
                                        }
                                    </div>
                                    <div className="mx-2">
                                        {/* <CustomButton text={"Collapse All"} onClick={handleCollapseAll} />
                                        <TiArrowSortedDown
                                            onClick={handleCollapseAll}
                                        ></TiArrowSortedDown> */}
                                    </div>
                                    <div className="mx-2">
                                        {/* <CustomButton text={"Show COA"} onClick={() => mainPdfGenerator(coaPdfUrl)} /> */}
                                        <CustomButton text={"Show COA"} onClick={cosShowPdf} disabled={pdfLoading} />
                                    </div>

                                    <ButtonDropdown
                                        toggle={() => { setOpen(!dropdownOpen) }}
                                        isOpen={pdfLoading ? false : dropdownOpen}

                                    >
                                        <DropdownToggle color="white border border-white p-1" caret>
                                            <CustomButton text={"Export COA"} color disabled={pdfLoading} />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => downloadPdf(coaPdfUrl)}>Export TO PDF</DropdownItem>
                                            <DropdownItem onClick={() => downloadWord(coaPdfUrl)}>Export To Word</DropdownItem>
                                            <DropdownItem onClick={() => downloadExcel(coaPdfUrl)}>Export To Excel</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>


                                    <div className="mx-2">
                                        {/* <CustomButton text={"Show Subcode"} onClick={() => mainPdfGenerator(analysisPdfUrl)} /> */}
                                        <CustomButton text={"Show Subcode"} onClick={analysisShowPdf} disabled={pdfLoading} />
                                    </div>


                                    <ButtonDropdown
                                        toggle={() => { setAnalysisdropdownOpen(!analysisdropdownOpen) }}
                                        isOpen={pdfLoading ? false : analysisdropdownOpen}
                                    >
                                        <DropdownToggle color="white border border-white p-1" caret>
                                            <CustomButton text={"Export Subcode"} color disabled={pdfLoading} />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => downloadPdf(analysisPdfUrl)}>Export TO PDF</DropdownItem>
                                            <DropdownItem onClick={() => downloadWord(analysisPdfUrl)}>Export To Word</DropdownItem>
                                            <DropdownItem onClick={() => downloadExcel(analysisPdfUrl)}>Export To Excel</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>

                                {
                                    loading === true ?
                                        <div className="w-100 d-flex justify-content-center">
                                            <div className="spinner-grow text-success  text-center"
                                                style={{ width: '2.5rem', height: "2.5rem" }} role="status">
                                            </div>
                                        </div>
                                        :
                                        coaSetup?.map((item, index) => {
                                            return (
                                                <COAItem menu={item} key={index} isExpanded={expandAll} />
                                            )
                                        })
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </Container>
            {
                pdfLoading ?
                    <CustomSpinner /> :
                    <Row style={{ height: '100vh', marginBottom: '20px' }}>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                <iframe src={pdflink} width="100%" height="100%" frameBorder="0"></iframe>

                        }
                    </Row>
            }

        </div>
    )
}

export default COASetup;