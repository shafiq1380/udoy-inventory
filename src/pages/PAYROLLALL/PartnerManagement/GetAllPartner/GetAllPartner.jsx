import React, { useState, useEffect, useMemo } from 'react'
import { Post } from '../../../../utils/https';
import { Button, Card, CardBody, CardHeader, Col, Container, Label, Row, UncontrolledTooltip } from 'reactstrap';
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import Select from 'react-select'
import TableContainer from '../../../../components/Common/TableContainer';
import CreateNewPartner from '../CreateNewPartner/CreateNewPartner';
import { UserName, UserStatus } from '../../../UserList/UserCol';
import { FaEdit } from 'react-icons/fa';
import PartnerDetailsModal from './PartnerDetailsModal';
import { useNavigate } from 'react-router-dom';



const GetAllPartner = () => {

    // document.title = "Partner Management | SMART Accounting System";

    const navigate = useNavigate();


    const [partnerTypes, setPartnerTypes] = useState([]);
    const [allPartner, setAllPartner] = useState([]);
    const [newPartnerModal, setNewPartnerModal] = useState(false);
    const [partnerDetailsModal, setPartnerDetailsModal] = useState(false);
    const [partnerDetails, setPartnerDetails] = useState({});

    const [inputData, setInputData] = useState({
        partnerType: "",
        id: "",
    })

    const getAllPartnerType = () => {
        try {
            Post('/api/PartnerManagement/GetAllPartnerType')
                .then(res => {
                    res.data.data
                    setPartnerTypes(res.data.data);
                })
        } catch (error) {
            console.log(error)
        }
    };

    // console.log("partnerTypes", partnerTypes)

    useEffect(() => {
        getAllPartnerType();
        searchPartner();
    }, [inputData.id]);

    const handlePartnerType = (selectedOption) => {
        setInputData({
            ...inputData,
            id: selectedOption.value,
            partnerType: selectedOption.label,
        });
        searchPartner(selectedOption.value);
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };

    const searchPartner = () => {
        const data = { data: inputData.id || 0 };
        // console.log("data", data);
        try {
            Post('/api/PartnerManagement/GetAllPartner', data)
                .then(res => {
                    // console.log("res", res);
                    setAllPartner(res.data.data);
                })
        } catch (error) {
            console.log(error);
        }
    };

    const toggleViewModal = (partner) => {
        // console.log("partner", partner)
        setPartnerDetailsModal(!partnerDetailsModal);
        setPartnerDetails(partner);
    };


    const editPartnerInformation = (partnerInfo) => {
        // console.log("partnerInfo", partnerInfo)
        navigate(`/partner-information-edit/${partnerInfo.id}`, { state: partnerInfo })
    };

    const columns = useMemo(
        () => [
            {
                Header: "Partner Name",
                accessor: "partnerName",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Partner Type Name",
                accessor: "partnerTypeName",
                width: 150,
                filterable: true,
                filter: 'select',
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Contract Number",
                accessor: "contractNumber",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Email",
                accessor: "emailAddress",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Address",
                accessor: "displayAddress",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Zone",
                accessor: "zone",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Status",
                accessor: "rStatus",
                width: 150,
                filterable: true,
                filter: 'select',
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />
                },
            },
            {
                Header: "View Details",
                accessor: "id",
                disableFilters: true,
                Cell: (allPartner) => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={() => toggleViewModal(allPartner.row.original)}
                        >
                            View Details
                        </Button>
                    );
                },
            },
            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (allPartner) => {
                    return (
                        <div className="d-flex gap-3">
                            <FaEdit
                                id="edittooltip"
                                size={18}
                                className="text-success cursor-pointer"
                                onClick={() => editPartnerInformation(allPartner.row.original)}
                            />
                            <UncontrolledTooltip placement="top" target="edittooltip">
                                Edit
                            </UncontrolledTooltip>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const createNewPartner = () => {
        setNewPartnerModal(!newPartnerModal);
    };


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Partner Management" breadcrumbItem="Setup / Partner Management" />

                {/* <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center">PARTNER MANAGEMENT SETUP SCREEN</h3>
                        </CardHeader>
                    </CardBody>
                </Card> */}

                <Card>
                    <CardBody className='pt-0'>
                        <Row >
                            <Col sm="12" md="6" lg="6">
                                <Label className="control-label fw-bolder mb-3 mt-3">Select Partner Type</Label>
                                <Select
                                    styles={customStyles}
                                    placeholder="Select Partner Type"
                                    options={partnerTypes.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.contractType
                                        }
                                    }).concat([{ value: 0, label: "All" }]).reverse()}
                                    onChange={handlePartnerType}
                                    value={inputData.partnerType ? { value: inputData.id, label: inputData.partnerType } : null}
                                    name='partnerType'
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <TableContainer
                            columns={columns}
                            data={allPartner.reverse()}
                            isGlobalFilter={true}
                            isAddUserList={true}
                            customPageSize={100}
                            className="custom-header-css"
                            onClickBtn={createNewPartner}
                        />
                    </CardBody>
                </Card>

                <>
                    <CreateNewPartner
                        newPartnerModal={newPartnerModal}
                        setNewPartnerModal={setNewPartnerModal}
                        partnerTypes={partnerTypes}
                    />
                </>

                <>
                    <PartnerDetailsModal
                        partnerDetailsModal={partnerDetailsModal}
                        setPartnerDetailsModal={setPartnerDetailsModal}
                        partnerDetails={partnerDetails}
                    />
                </>


            </Container>
        </div>
    )
}

export default GetAllPartner