import React, { useState, useMemo } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, CardHeader, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import TableContainer from '../../components/Common/TableContainer';
import { UserName } from '../UserList/UserCol';
// import { FaEdit } from 'react-icons/fa'
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';


const COAMaps = () => {

    // document.title = "COA Map | SMART Accounting System";


    const [coaMapData, setCoaMapData] = useState([
        {
            id: 1,
            coaName: "Income Statement",
        },
        {
            id: 2,
            coaName: "Cost of Sales",
        },
        {
            id: 3,
            coaName: "Balance Sheet",
        },
        {
            id: 4,
            coaName: "Changes in Equity",
        },
        {
            id: 5,
            coaName: "Income Statement (HO)",
        },
        {
            id: 6,
            coaName: "Balance Sheet (HO)",
        },
    ]);


    const navigate = useNavigate();



    const handleCOADetails = (id) => {
        navigate('/coa-details', { state: id });
    };

    const columns = useMemo(
        () => [
            {
                Header: "COA Name",
                accessor: "coaName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Details",
                disableFilters: true,
                Cell: (coa) => {
                    return (
                        <div className="d-flex gap-3">
                            <a
                                to="#"
                                className="text-success"
                                onClick={() => handleCOADetails(coa.row.original)}
                            >
                                {/* <FaEdit id="edittooltip" size={18} /> */}
                                <TbListDetails id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Details
                                </UncontrolledTooltip>
                            </a>
                        </div>
                    );
                },
            },
        ],
        []
    );


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="SETUP" breadcrumbItem="COA / Coa Mapping" />
            </Container>

            <Container fluid>
                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">Accounting Report Code Map</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={coaMapData.reverse()}
                                    customPageSize={10}
                                    className="custom-header-css"
                                    hidden
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
};

export default COAMaps;