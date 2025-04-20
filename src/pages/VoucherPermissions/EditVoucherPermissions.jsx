import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Row, Label, Spinner } from 'reactstrap'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainer';
import { UserName } from '../UserList/UserCol';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import axios from 'axios';
import CustomSpinner from '../../components/Common/CustomSpinner';
import { Post } from '../../utils/https';


const EditVoucherPermissions = () => {

    // document.title = "Edit Voucher Permission | SMART Accounting System";


    const { id } = useParams();
    const history = useNavigate();


    const [voucherPermissionData, setVoucherPermissionData] = useState([]);
    const [loading, setLoading] = useState(false)

    // const columns = useMemo(
    //     () => [
    //         {
    //             Header: "Voucher ID",
    //             accessor: "voucherId",
    //             filterable: true,
    //             Cell: (cellProps) => {
    //                 return <UserName {...cellProps} />;
    //             },
    //         },
    //         {
    //             Header: "Voucher Type",
    //             accessor: "voucherType",
    //             filterable: true,
    //             Cell: (cellProps) => {
    //                 return <UserName {...cellProps} />;
    //             },
    //         },
    //         {
    //             Header: "Voucher Name",
    //             accessor: "voucherName",
    //             filterable: true,
    //             Cell: (cellProps) => {
    //                 return <UserName {...cellProps} />;
    //             },
    //         },
    //         {
    //             Header: "Save Permission",
    //             filterable: true,
    //             Cell: (coa) => {
    //                 return (
    //                     <div className="d-flex gap-3">
    //                         <a
    //                             to="#"
    //                             className="text-success fw-bolder font-size-16"
    //                         >
    //                             <input type="checkbox" />
    //                         </a>
    //                     </div>
    //                 );
    //             },
    //         },
    //         {
    //             Header: "Post Permission",
    //             filterable: true,
    //             Cell: (coa) => {
    //                 return (
    //                     <div className="d-flex gap-3">
    //                         <a
    //                             to="#"
    //                             className="text-success fw-bolder font-size-16"
    //                         >
    //                             <input type="checkbox" />
    //                         </a>
    //                     </div>
    //                 );
    //             },
    //         },
    //         {
    //             Header: "Revise Permission",
    //             filterable: true,
    //             Cell: (coa) => {
    //                 return (
    //                     <div className="d-flex gap-3">
    //                         <a
    //                             to="#"
    //                             className="text-success fw-bolder font-size-16"
    //                         >
    //                             <input type="checkbox" />
    //                         </a>
    //                     </div>
    //                 );
    //             },
    //         },
    //         {
    //             Header: "Reverse Permission",
    //             filterable: true,
    //             Cell: (coa) => {
    //                 return (
    //                     <div className="d-flex gap-3">
    //                         <a
    //                             to="#"
    //                             className="text-success fw-bolder font-size-16"
    //                         >
    //                             <input type="checkbox" />
    //                         </a>
    //                     </div>
    //                 );
    //             },
    //         },
    //     ],
    //     []
    // );


    const getVoucherPermission = async () => {
        try {
            await Post('/api/VoucherEntry/GetUserPermissionByID', { data: id })
                .then(res => setVoucherPermissionData(res.data.data))
        } catch (error) { console.log(error) }
    }

    const getVoucherPermissionUpdate = async () => {
        setLoading(!loading)
        // console.log(voucherPermissionData)
        try {
            await Post('/api/VoucherEntry/AddUpdateUserPermission', { data: voucherPermissionData })
                .then(res => {
                    if (res.data.success === true) {
                        history('/voucher-permission')
                        setLoading(!loading)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        setLoading(!loading)
    }

    const handleCheckboxChange = (index, fieldName) => {
        const updatedList = [...voucherPermissionData.userPermissionList];
        const updatedItem = { ...updatedList[index] };
        updatedItem[fieldName] = updatedItem[fieldName] === 1 ? 0 : 1;
        updatedList[index] = updatedItem;
        setVoucherPermissionData({ userPermissionList: updatedList });
    };

    useEffect(() => {
        getVoucherPermission()
    }, [])

    // console.log(voucherPermissionData)


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="Edit Voucher Permission" />
            </Container>

            <Container fluid>

                <Button
                    type="button"
                    color="success"
                    className="btn-rounded px-3 mb-3"
                    onClick={() => history(-1)}
                >
                    <IoMdArrowRoundBack size={20} color='white' />
                </Button>
                {/* <CardHeader>
                            <h3 className="text-center text-uppercase">Edit Journal Permission For - <span className='text-success'>{state && state.userName}</span></h3>
                        </CardHeader> */}

                {
                    voucherPermissionData?.userPermissionList?.length > 0 ?
                        <>

                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm="12" md="6" lg="2">
                                            <Label className="form-label">User ID</Label>
                                        </Col>
                                        <Col sm="12" md="6" lg="3">
                                            <Input
                                                type="text"
                                                className="form-control mb-3"
                                                placeholder="Enter Partner Name"
                                                value={voucherPermissionData?.empCode}
                                                disabled
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm="12" md="6" lg="2">
                                            <Label className="form-label">User Name</Label>
                                        </Col>
                                        <Col sm="12" md="6" lg="3">
                                            <Input
                                                type="text"
                                                className="form-control mb-3"
                                                placeholder="Enter Partner Name"
                                                value={voucherPermissionData?.usrName}
                                                disabled
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm="12" md="6" lg="2">
                                            <Label className="form-label">User Department</Label>
                                        </Col>
                                        <Col sm="12" md="6" lg="3">
                                            <Input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Partner Name"
                                                value={voucherPermissionData?.usrDesignation}
                                                disabled
                                            />
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col xs="12">

                                            <Row>
                                                <div className="table-responsive-sm">
                                                    <table className="table table-striped table-bordered table-sm" width="100%">
                                                        <thead>
                                                            <tr className='text-center'>
                                                                <th className="col-1">Voucher ID</th>
                                                                <th className="col-1">V/Type</th>
                                                                <th className="col-3">Voucher Name</th>
                                                                <th className="col-2">Save Permission</th>
                                                                <th className="col-2">Post Permission</th>
                                                                <th className="col-2">Revise Permission</th>
                                                                <th className="col-2">Reverse Permission</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {
                                                                voucherPermissionData?.userPermissionList?.map((item, index) => (
                                                                    <tr key={index} className='text-center'>
                                                                        <td className="text-center">{item.voucherTypeID}</td>
                                                                        <td>{item.voucherTypeType}</td>
                                                                        <td>{item.voucherTypeName}</td>
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                defaultChecked={item.prmSave === 1 ? true : false}
                                                                                onChange={() => handleCheckboxChange(index, 'prmSave')}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                defaultChecked={item.prmPost === 1 ? true : false}
                                                                                onChange={() => handleCheckboxChange(index, 'prmPost')}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                defaultChecked={item.prmRevise === 1 ? true : false}
                                                                                onChange={() => handleCheckboxChange(index, 'prmRevise')}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                defaultChecked={item.prmReverse === 1 ? true : false}
                                                                                onChange={() => handleCheckboxChange(index, 'prmReverse')}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Row>

                                            <Row>
                                                <Col className="text-end mt-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-lg fw-bold"
                                                        onClick={getVoucherPermissionUpdate}
                                                        disabled={loading}
                                                    >
                                                        {loading && <Spinner size={'sm'}></Spinner>} Update
                                                    </button>
                                                </Col>
                                            </Row>


                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </>
                        :
                        <CustomSpinner />
                }

            </Container>

        </div>
    )
}

export default EditVoucherPermissions