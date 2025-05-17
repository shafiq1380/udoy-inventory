import React, { useEffect, useMemo, useState } from 'react'
import { ActiveStatus, DateFormate, MobileNumber, UserEmail, UserName, UserStatus } from '../../UserList/UserCol';
import { Button, Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import TableContainer from '../../../components/Common/TableContainer';
import { FaEdit } from 'react-icons/fa';
import { Post } from '../../../utils/https';
import { authorization } from '../../../components/Common/Authorization';
import CGIManagementModal from './CGIManagementModal';



const CGIManagement = () => {

    const [allStoreList, setAllStoreList] = useState([])
    const [allPartner, setAllPartner] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [editByID, setEditByID] = useState(null)

    const [allRentData, setAllRentData] = useState([])

    const handleModal = () => {
        setShowModal(!showModal);
        setEditByID(null);
    }

    const handleEdit = (e) => {
        if (e) {
            setShowModal(!showModal)
            setEditByID(e.id)
        }
    }


    // for the table container 
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Partner Name",
                accessor: "partnerName",
                // disableFilters: true,
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Store Name",
                accessor: "storeCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Rent Start Date",
                accessor: "contactStartDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },
            {
                Header: "Rent End Date",
                accessor: "contactEndDate",
                filterable: true,
                Cell: (cellProps) => {
                    return <DateFormate {...cellProps} />;
                },
            },

            {
                Header: "Contact Detail",
                accessor: "contactDetail",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },

            {
                Header: "Active Status",
                accessor: "contactStatus",
                disableFilters: true,
                filter: 'select',
                Cell: (cellProps) => {
                    return <UserStatus {...cellProps} />;
                },
            },
            // {
            //     Header: "View Details",
            //     accessor: "viewDetails",
            //     disableFilters: true,
            //     Cell: (allEmployeeList) => {
            //         return (
            //             <Button
            //                 type="button"
            //                 color="primary"
            //                 className="btn-sm btn-rounded"
            //             // onClick={() => toggleViewModal(allEmployeeList.row.original)}
            //             >
            //                 View Details
            //             </Button>
            //         );
            //     },
            // },
            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (usr) => {
                    return (
                        <div className="d-flex gap-3">
                            <a
                                to="#"
                                className="text-success"
                                onClick={() => handleEdit(usr.row.original)}
                            >
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

    const fetchData = async () => {
        const data = { data: 0 };

        try {
            const [storeResponse, partnerResponse] = await Promise.all([
                Post('/api/v1/Product/GetAllStore'),
                Post('/api/v1/PartnerManagement/GetAllPartner', data)
            ]);

            setAllStoreList(storeResponse.data.data);
            setAllPartner(partnerResponse.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const getAllRentData = async () => {
        const data = { data: 0 };
        try {
            const response = await Post('/api/v1/ChemicalGdown/GetAllRentData', data);
            setAllRentData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchData()
        getAllRentData()
    }, [showModal])


    useEffect(() => {
        authorization(116)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'CGI Management'} title={'CGI'} />
                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={allRentData}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        onClickBtn={handleModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>

            <CGIManagementModal
                show={showModal}
                handleModal={handleModal}
                allStoreList={allStoreList}
                allPartner={allPartner}
                editByID={editByID}
            />
        </div>
    )
}

export default CGIManagement