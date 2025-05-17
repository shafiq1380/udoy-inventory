import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody, Container, CardHeader, Row, Col, Label, Form, FormGroup, UncontrolledTooltip } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { addReviseVoucherEntryFail, addReviseVoucherEntryForm } from '../../store/revise-voucher/actions';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Common/Spinner';
import { fetchAllCoaAccount, fetchVoucherTypeRequest, fetchEnterpriseSetupRequest, fetchDivisionRequest, fetchEntityRequest, fetchBusinessUnitRequest } from '../../store/coa-setup/actions';
import { getVoucherChangesByRef, getVoucherChangesByRefFail } from '../../store/voucher-changes-by-ref/actions';
import moment from 'moment/moment';
import { Post, fileUploadURL } from '../../utils/https';
import { authorization } from '../../components/Common/Authorization';


const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const initialRow = {
    coaId: '',
    voucherNarration: '',
    debit: '',
    credit: '',
    analysisRequired: 'N',
};

const ViewVoucher = () => {
    // document.title = "View Voucher | SMART Accounting System";

    const dispatch = useDispatch();

    const { loading, allCoaAccounts, allVoucherType, allEnterpriseSetup, allDivision, allEntity, allBusinessUnit } = useSelector(state => state.coaSetupReducer);
    const { success, error } = useSelector(state => state.reviseVoucherEntryReducer);


    // console.log("success", success)

    const { getChangesByRefLoading, getChangesByRefSuccess } = useSelector(state => state.getVoucherChangesByRefReducer);

    const [voucherRef, setVoucherRef] = useState('')
    const [voucherDetails, setVoucherDetails] = useState([initialRow]);
    const [selectedVoucherType, setSelectedVoucherType] = useState(null);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));


    useEffect(() => {
        dispatch(fetchAllCoaAccount());
        dispatch(fetchVoucherTypeRequest());
        dispatch(fetchEnterpriseSetupRequest());
        dispatch(fetchDivisionRequest());
        dispatch(fetchEntityRequest());
        dispatch(fetchBusinessUnitRequest());
    }, []);

    useEffect(() => {
        if (success) {
            setSelectedVoucherType(success.voucherType)
            setSelectedEnterprise(success.enterpriseId)
            setSelectedDivision(success.divisionId)
            setSelectedEntity(success.entityId)
            setSelectedBusinessUnit(success.businessUnitId)
            setTransactionDate(success.trnDate)
            const oldVoucherDetails = Array.isArray(success.voucherDetails)
                ? [...success.voucherDetails]
                : [];
            const newVoucherDetails = oldVoucherDetails.map((itemDetails) => {
                return {
                    coaId: itemDetails.coaId,
                    voucherNarration: itemDetails.voucherNarration,
                    debit: itemDetails.trnType === "D" ? itemDetails.trnAmount.toString() : "",
                    credit: itemDetails.trnType === "C" ? itemDetails.trnAmount.toString() : "",
                    analysisRequired: itemDetails.voucherAnalysis !== null ? "Y" : "N",
                    voucherDetails: itemDetails.voucherAnalysis ? itemDetails.voucherAnalysis.map(item => {
                        return {
                            analTypeId: item.analTypeId,
                            analId: item.analId
                        };
                    }) : [],
                }
            })
            setVoucherDetails(newVoucherDetails);
        }
    }, [success])

    const debitAmount = voucherDetails.reduce((accumulator, current) => Number(accumulator) + Number(current.debit || 0), 0);
    const creditAmount = voucherDetails.reduce((accumulator, current) => Number(accumulator) + Number(current.credit || 0), 0);


    // const checkAnalysisRequired = () => {
    //     const voucherDetailsWithAnalysis = voucherDetails.filter(voucherDetail => voucherDetail.analysisRequired === "Y");
    //     if (voucherDetailsWithAnalysis.length > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };

    const handleReviseVoucher = () => {
        const data = { data: voucherRef }
        if (voucherRef === '') {
            toast.error("Please enter voucher reference", toastOptions);
            return;
        } else {
            dispatch(addReviseVoucherEntryForm(data))
            dispatch(getVoucherChangesByRef(data))
        }
    };

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

    // tool tips 
    const [tooltipData, setTooltipData] = useState();

    // const fetchData = async () => {
    //     const data = {
    //         data: getChangesByRefSuccess[0].vouchetID
    //     }
    //     try {
    //         Post('/api/v1/VoucherEntry/GetVoucherToolTipByID', data)
    //             .then(res => setTooltipData(res.data.data))
    //     } catch (error) {

    //     }
    // };



    //Authorization check
    useEffect(() => {
        authorization(52)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                <div>
                    <Breadcrumbs title="Voucher Details" breadcrumbItem="Voucher / Voucher Details" />
                    <Card>
                        <CardBody>
                            <CardHeader>
                                <h3 className="text-center">VOUCHER DETAILS</h3>
                            </CardHeader>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <Row>
                                <Col sm={12} md={12} lg={6}>

                                    <Row>
                                        <Col sm={12} md={6} lg={3}>
                                            <Label for="voucherRef" size="lg">Voucher Ref</Label>
                                        </Col>
                                        <Col sm={12} md={6} lg={9}>
                                            <input
                                                type="text"
                                                id="voucherRef"
                                                name="voucherRef"
                                                placeholder='Enter Voucher Reference'
                                                className='form-control'
                                                value={voucherRef}
                                                onChange={(e) => {
                                                    if (voucherRef === '') {
                                                        dispatch(addReviseVoucherEntryFail(null))
                                                        dispatch(getVoucherChangesByRefFail(null))
                                                    }
                                                    setVoucherRef(e.target.value)
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    <div className='text-end my-2'>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="px-5"
                                            onClick={() => handleReviseVoucher()}
                                        >
                                            Show
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    {loading === true ? <Spinner /> :
                        success && success.voucherRef === voucherRef &&
                        <Card>
                            <CardBody>
                                <Row>

                                    {/* tooltips */}
                                    {/* <div onMouseOver={fetchData}>
                                        <Button
                                            type="button"
                                            color="success"
                                            className=""
                                            id="edittooltip"
                                        >
                                            Tool Tips
                                        </Button>
                                        <UncontrolledTooltip
                                            // autohide={false}
                                            style={{
                                                backgroundColor: 'white',
                                                maxWidth: '1100px',
                                                // zIndex: 9999,
                                                boxShadow: '2px 5px 10px rgba(0, 0, 0, 0.5)',
                                            }}
                                            placement="right" target="edittooltip">
                                            <span dangerouslySetInnerHTML={{
                                                __html: tooltipData
                                            }} />
                                        </UncontrolledTooltip>
                                    </div> */}
                                    <Col sm="12" md="12" >
                                        <div>

                                            <CardHeader className="">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div></div>
                                                    <h3>Voucher Reference : {success && success.voucherRef}</h3>
                                                    <Button
                                                        type="button"
                                                        color="success"
                                                        className=""
                                                        onClick={() => handleAttachment(success.id)}
                                                    >
                                                        Attachment
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <Row className="my-3">
                                                <Col sm="6">

                                                    {/* {
                                                        loading === true ?
                                                            <Spinner />
                                                            :
                                                            <div>

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Enterprise : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {
                                                                                allEnterpriseSetup.map((item, index) => {
                                                                                    const matched = success && success.enterpriseId === item.id;
                                                                                    return (
                                                                                        <span key={index}>
                                                                                            {matched && item.enterpriseName}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Division : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {
                                                                                allDivision.map((item, index) => {
                                                                                    const matched = success && success.divisionId === item.id;
                                                                                    return (
                                                                                        <span key={index}>
                                                                                            {matched && item.divisionName}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Entity : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {
                                                                                allEntity.map((item, index) => {
                                                                                    const matched = success && success.entityId === item.id;
                                                                                    return (
                                                                                        <span key={index}>
                                                                                            {matched && item.entityName}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Business Unit : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {
                                                                                allBusinessUnit.map((item, index) => {
                                                                                    const matched = success && success.businessUnitId === item.id;
                                                                                    return (
                                                                                        <span key={index}>
                                                                                            {matched && item.businessUnitName}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                    } */}
                                                    <Row className="mb-3">
                                                        <Col sm={12} md={12} lg={4}>
                                                            <h5 className="fw-bolder"> Voucher Type : </h5>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={8}>
                                                            <h5>
                                                                {
                                                                    allVoucherType.map((item, index) => {
                                                                        const matched = success && success.voucherType === item.jrnType;
                                                                        return (
                                                                            <span key={index}>
                                                                                {matched && item.jrnDescription}
                                                                            </span>
                                                                        )
                                                                    })
                                                                }
                                                            </h5>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                        <Col sm={12} md={12} lg={4}>
                                                            <h5 className="fw-bolder"> Transaction Date : </h5>
                                                        </Col>
                                                        <Col sm={12} md={12} lg={8}>
                                                            <h5>
                                                                {moment(transactionDate).format("DD - MMMM - YYYY")}
                                                            </h5>
                                                        </Col>
                                                    </Row>

                                                </Col>

                                                <Col sm="6">

                                                    {
                                                        loading === true ?
                                                            <Spinner />
                                                            :
                                                            <div>

                                                                {/* <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Voucher Type : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {
                                                                                allVoucherType.map((item, index) => {
                                                                                    const matched = success && success.voucherType === item.jrnType;
                                                                                    return (
                                                                                        <span key={index}>
                                                                                            {matched && item.jrnDescription}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Transaction Date : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {moment(transactionDate).format("DD - MMMM - YYYY")}
                                                                        </h5>
                                                                    </Col>
                                                                </Row> */}

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Amount - Dr : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {debitAmount}
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-3">
                                                                    <Col sm={12} md={12} lg={4}>
                                                                        <h5 className="fw-bolder"> Amount - Cr : </h5>
                                                                    </Col>
                                                                    <Col sm={12} md={12} lg={8}>
                                                                        <h5>
                                                                            {creditAmount}
                                                                        </h5>
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                    }

                                                </Col>
                                            </Row>


                                        </div>

                                        <div>

                                            <CardHeader className="mb-3">
                                                <h3 className="text-center">Voucher Details</h3>
                                            </CardHeader>

                                            <Row>
                                                <div className="table-responsive-sm">
                                                    <table className="table table-striped table-bordered table-sm" width="100%">
                                                        <thead>
                                                            <tr>
                                                                <th className='col-1'>S/N</th>
                                                                <th className='col-3'>Account Code</th>
                                                                <th className='col-1'>Analysis</th>
                                                                <th className='col-2'>Analysis Details</th>
                                                                {/* {
                                                                    checkAnalysisRequired() ? <th className='col-1'>Analysis</th> : <th></th>
                                                                }
                                                                {
                                                                    checkAnalysisRequired() ? <th className='col-2'>Analysis Details</th> : <th></th>
                                                                } */}
                                                                <th className='col-2'>Particulars</th>
                                                                <th className='col-1'>Debit (Dr)</th>
                                                                <th className='col-1'>Credit (Cr)</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                voucherDetails && voucherDetails.map((item, index) => {
                                                                    const selectedCoaAccount = allCoaAccounts.find((coaAcc) => coaAcc.coaId === item.coaId);

                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>
                                                                                {selectedCoaAccount && selectedCoaAccount.coaCode} : {selectedCoaAccount && selectedCoaAccount.coaName}
                                                                            </td>
                                                                            {
                                                                                item.analysisRequired === "Y" ?
                                                                                    <td>
                                                                                        {
                                                                                            allCoaAccounts.map((coaAcc) => {
                                                                                                if (coaAcc.coaId === item.coaId) {
                                                                                                    return (
                                                                                                        coaAcc && coaAcc?.analysisList?.map((analysis, i) => {
                                                                                                            return (
                                                                                                                <ul key={i}>
                                                                                                                    <li>{analysis.analysisTypeID} : {analysis.analysisTypeName}</li>
                                                                                                                </ul>
                                                                                                            )
                                                                                                        })
                                                                                                    )
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    </td>
                                                                                    : <td></td>
                                                                            }

                                                                            {
                                                                                item.analysisRequired === "Y" ?
                                                                                    <td>
                                                                                        {
                                                                                            allCoaAccounts.map((coaAcc) => {
                                                                                                if (coaAcc.coaId === item.coaId) {
                                                                                                    return (
                                                                                                        coaAcc && coaAcc?.analysisList?.map((analysis, i) => {
                                                                                                            const filteredData = analysis.itemList.filter(item2 => {
                                                                                                                return item.voucherDetails.find(item1 => item1.analId === item2.analysisID);
                                                                                                            });
                                                                                                            return (
                                                                                                                filteredData.map((item2, i) => {
                                                                                                                    return (
                                                                                                                        <ul key={i}>
                                                                                                                            <li>{item2.analysisCode} : {item2.analysisName}</li>
                                                                                                                        </ul>
                                                                                                                    )
                                                                                                                })
                                                                                                            )
                                                                                                        })
                                                                                                    )
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    </td>
                                                                                    : <td> </td>
                                                                            }
                                                                            <td> {item.voucherNarration} </td>
                                                                            <td className="text-end"> {item.trnType === "D" ? item.trnAmount : item.debit} </td>
                                                                            <td className="text-end"> {item.trnType === "C" ? item.trnAmount : item.credit} </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    }

                    {
                        loading === true ? <Spinner /> :
                            voucherRef && error &&
                            <Card>
                                <CardBody>
                                    <h1 className='text-center'>{error} <span className='fw-bold text-danger'>{voucherRef}</span></h1>
                                </CardBody>
                            </Card>
                    }

                    {getChangesByRefLoading === true ? <Spinner /> :
                        success && success.voucherRef === voucherRef && getChangesByRefSuccess &&
                        <Card>
                            <CardBody>
                                <CardHeader className="mb-3">
                                    <h3 className="text-center">Voucher Changes History</h3>
                                </CardHeader>
                                <Row>
                                    <Col sm={12} md={12} lg={12}>
                                        <div className="table-responsive-sm">
                                            <table className="table table-striped table-bordered table-sm" width="100%">
                                                <thead>
                                                    <tr>
                                                        <th>Voucher ID</th>
                                                        <th>Voucher Ref</th>
                                                        <th>User ID</th>
                                                        <th>User Name</th>
                                                        <th>Change Date</th>
                                                        <th>Change Type</th>
                                                        <th>Change Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        getChangesByRefSuccess && getChangesByRefSuccess.map((item, index) => {

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.vouchetID}</td>
                                                                    <td>{item.voucherRef}</td>
                                                                    <td>{item.userId}</td>
                                                                    <td>{item.userName}</td>
                                                                    <td>
                                                                        Date: {moment(item.changeDate).format("DD-MM-YYYY")} {" - "}
                                                                        Time: {moment(item.changeDate).format('LT')}
                                                                    </td>
                                                                    <td>{item.changeType}</td>
                                                                    <td>{item.changeRemarks}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    }

                </div>
            </Container >
            <ToastContainer />
        </div >
    )
}

export default ViewVoucher