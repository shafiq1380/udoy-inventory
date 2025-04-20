import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Row, Spinner, UncontrolledTooltip } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { IoMdArrowRoundBack } from "react-icons/io";

import { Link, useNavigate, useParams } from "react-router-dom";
import { Post } from '../../utils/https';
import { AnalysisName, ID } from '../AnalysisTypeSetup/AnalysisTypeCols';
import TableContainer from '../../components/Common/TableContainer';
import CustomSpinner from '../../components/Common/CustomSpinner';
import AnalysisModal from './component/AnalysisModal';
import { useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { authorization } from '../../components/Common/Authorization';
import BackButton from '../../components/Common/BackButton';

const AnalysisDetails = () => {
    // document.title = "Coa Analysis | SMART Accounting System";

    const [analysis, setAnalysis] = useState()
    const [showModal, setShowModal] = useState(false)

    const [reload, setReload] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const [analdata, setanaldata] = useState({})

    const { anals } = useSelector(state => state.analtypeReducer);

    const { id } = useParams()
    const history = useNavigate()

    const fileterAnalsItem = anals.filter(anal => anal.id === +id)

    const handleModal = (e) => {
        setShowModal(!showModal)
        setIsEdit(false)
    }

    const handleEdit = (anal) => {
        setanaldata(anal)
        setIsEdit(true)
        setShowModal(!showModal)
    }


    const onCloseClick = () => {
        setShowModal(!showModal)
        setIsEdit(false)
    }


    const fetchAnalysis = async () => {
        const data = { data: id }
        try {
            const response = await Post('/api/CoaSetup/GetAllAnalysisCodeByType', data)
                .then(res => setAnalysis(res.data.data))
        } catch (error) {
            console.log(error)
        }
    }


    // console.log('Analysis Data', analysis)

    const reloadPage = () => {
        setReload(!reload)
    }

    const columns = useMemo(
        () => [
            {
                Header: "Analysis ID",
                accessor: "id",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <ID {...cellProps} />
                },
            },
            {
                Header: "Analysis Code",
                accessor: "analysisCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <AnalysisName {...cellProps} />
                },
            },
            {
                Header: "Analysis Name",
                accessor: "analysisName",
                filterable: true,
                Cell: (cellProps) => {
                    return <AnalysisName {...cellProps} />
                },
            },

            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (anal) => {
                    return (
                        <div className="d-flex gap-3">
                            <a
                                className="text-success"
                                onClick={() => {
                                    handleEdit(anal.row.original)
                                }}
                            >
                                {/* <i className="mdi mdi-pencil font-size-18" id="edittooltip" /> */}
                                <FaEdit id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </a>
                        </div>
                    );
                },
            },


        ],
        []
    );



    useEffect(() => {
        fetchAnalysis()
    }, [reload])


    //Authorization check
    useEffect(() => {
        authorization(14)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}
                <Breadcrumbs title="Analysis" breadcrumbItem="Analysis / Analysis Details" />
            </Container>

            <BackButton />

            <Container>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <div>
                            <h3>Analysis Details ID: {id}</h3>
                            <h3>Analysis Details Name: {fileterAnalsItem[0]?.analysisTypeName}</h3>
                        </div>
                    </Col>
                </Row>
            </Container>

            {
                analysis ?
                    <Row className='mt-3'>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={analysis && analysis}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        onClickBtn={handleModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                        showbtn
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    :
                    <CustomSpinner />
            }

            {/* {
                analysis && analysis.map(item =>
                    <>
                        <li>{item.analysisCode}</li>
                    </>
                )
            } */}

            <AnalysisModal
                show={showModal}
                onCloseClick={onCloseClick}
                analysisData={analdata}
                id={id}
                reloadPage={reloadPage}
                isEdit={isEdit}
            />

        </div>
    )
}

export default AnalysisDetails