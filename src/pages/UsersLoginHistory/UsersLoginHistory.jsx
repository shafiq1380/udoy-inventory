import React, { useState, useMemo } from 'react'
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainer';
import IPModal from './IPModal';


const UsersLoginHistory = () => {

    // document.title = "User Login History | SMART Accounting System";

    const [loginData, setLoginData] = useState([
        {
            id: 1000,
            dateTime: '23/01/2024 01:05:22 PM',
            companyCode: 'HOF',
            userCode: 'bsecadmin',
            ip: '230.185.156.130',
            platform: 'Desktop',
            browser: 'Edge',
            latLang: '563.283, 233.203',
            captcha: 1,
            loggedIn: 1
        },
        {
            id: 1005,
            dateTime: '23/01/2024 10:21:22 AM',
            companyCode: 'DEV',
            userCode: '1090027',
            ip: '192.168.10.10',
            platform: 'Desktop',
            browser: 'Chrome',
            latLang: '23.23, 23.23',
            captcha: 1,
            loggedIn: 1
        },

    ]);

    const [ipModal, setIPModal] = useState(false);
    const [ipData, setIPData] = useState({});


    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                disableFilters: true,
            },
            {
                Header: "Date & Time",
                accessor: "dateTime",
                disableFilters: true,
            },
            {
                Header: "Company Code",
                accessor: "companyCode",
                disableFilters: true,
            },
            {
                Header: "User Code",
                accessor: "userCode",
                disableFilters: true,
            },
            {
                Header: "IP",
                accessor: "ip",
                disableFilters: true,
                Cell: (cellProps) => {
                    return (
                        <div>
                            <a onClick={() => { handleIP(cellProps.row.original) }} className='text-primary'>
                                {cellProps.row.original.ip}
                            </a>
                        </div>
                    )
                }
            },
            {
                Header: "Platform",
                accessor: "platform",
                disableFilters: true,
            },
            {
                Header: "Browser",
                accessor: "browser",
                disableFilters: true,
            },
            {
                Header: "Lat Lang",
                accessor: "latLang",
                disableFilters: true,
                Cell: (cellProps) => {
                    return (
                        <div>
                            <a onClick={() => { handleLatLang(cellProps.row.original.latLang) }} className='text-primary'>
                                {cellProps.row.original.latLang}
                            </a>
                        </div>
                    )
                }
            },
            {
                Header: "Captcha",
                accessor: "captcha",
                disableFilters: true,
            },
            {
                Header: "Logged In",
                accessor: "loggedIn",
                disableFilters: true,
            }
        ],
        []
    );

    const handleIP = (data) => {
        setIPModal(true);
        setIPData(data);
    };

    const handleLatLang = (data) => { };

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="User Management / User Login History" />
            </Container>

            <Container fluid>

                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <TableContainer
                                    columns={columns}
                                    data={loginData.reverse()}
                                    customPageSize={10}
                                    className="custom-header-css"
                                    hidden={true}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>

            <IPModal
                show={ipModal}
                handleModal={() => setIPModal(false)}
                ipData={ipData}
            />

        </div>
    )
}

export default UsersLoginHistory