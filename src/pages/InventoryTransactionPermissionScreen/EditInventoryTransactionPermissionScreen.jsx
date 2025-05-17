import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Input, Row, Label, Spinner } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Post } from '../../utils/https';

const EditInventoryTransactionPermissionScreen = () => {
    document.title = "Edit Inventory Transaction Permission Screen | SMART Accounting System";

    const { id } = useParams();
    const history = useNavigate();
    const [transactionTypeLists, setTransactionTypeLists] = useState([]);
    const [getTransactionPermissionLists, setGetTransactionPermissionLists] = useState([]);
    const [loading, setLoading] = useState(false);

    const getTransactionTypeLists = () => {
        setLoading(true);
        try {
            Post('/api/v1/InvTransaction/GetTransactionTypeList')
                .then(res => {
                    setLoading(false);
                    setTransactionTypeLists(res.data.data);
                });
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getTransactionPermissionsLists = () => {
        setLoading(true);
        try {
            Post('/api/InvTransaction/GetTransactionPermission', { data: id })
                .then(res => {
                    setLoading(false);
                    setGetTransactionPermissionLists(res.data.data);
                });
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getTransactionTypeLists();
        getTransactionPermissionsLists();
    }, []);


    const handleCheckboxChange = (index, name, checked) => {
        setLoading(true);
        setGetTransactionPermissionLists((prevState) => {
            const updatedPermissionLists = [...prevState];
            const permissionItemIndex = updatedPermissionLists.findIndex(item => item.perTypeID === transactionTypeLists[index].id);

            if (permissionItemIndex !== -1) {
                updatedPermissionLists[permissionItemIndex][name] = checked ? 1 : 0;
            } else {
                updatedPermissionLists.push({
                    empID: id,
                    perTypeID: transactionTypeLists[index].id,
                    isSave: 0,
                    isPost: 0,
                    isRevise: 0,
                    [name]: checked ? 1 : 0,
                });
            }

            setLoading(false);
            return updatedPermissionLists;
        });
    };

    const handleUpdatePermissions = () => {
        const data = {
            data: getTransactionPermissionLists
        };

        // console.log("data", data);

        setLoading(true);
        try {
            Post('/api/InvTransaction/UpdateTransactionPermission', data)
                .then(res => {
                    // console.log("res", res);
                    if (res.status === 200) {
                        setLoading(false);
                        history(-1);
                    }
                });
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Configuration" breadcrumbItem="Inventory Transaction Permission Screen " />
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

                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" md="6" lg="2">
                                <Label className="form-label">Employee ID</Label>
                            </Col>
                            <Col sm="12" md="6" lg="3">
                                <Input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Employee ID"
                                    disabled
                                    value={id}
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
                                                    <th className="col-1">ID</th>
                                                    <th className="col-1">Type</th>
                                                    <th className="col-1">Code</th>
                                                    <th className="col-3">Transaction</th>
                                                    <th className="col-1">Save</th>
                                                    <th className="col-1">Post</th>
                                                    <th className="col-1">Revise</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactionTypeLists && transactionTypeLists.map((item, index) => {
                                                    const permissionItem = getTransactionPermissionLists && getTransactionPermissionLists.find(cItem => cItem.perTypeID === item.id);
                                                    return (
                                                        <tr key={index} className='text-center'>
                                                            <td className="text-center">{item.id}</td>
                                                            <td>{item.trnType}</td>
                                                            <td>{item.trnCode}</td>
                                                            <td>{item.trnDesc}</td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={permissionItem && permissionItem.isSave === 1}
                                                                    onChange={(e) => handleCheckboxChange(index, 'isSave', e.target.checked)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={permissionItem && permissionItem.isPost === 1}
                                                                    onChange={(e) => handleCheckboxChange(index, 'isPost', e.target.checked)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={permissionItem && permissionItem.isRevise === 1}
                                                                    onChange={(e) => handleCheckboxChange(index, 'isRevise', e.target.checked)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Row>
                                <Row>
                                    <Col className="text-end mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg fw-bold"
                                            disabled={loading}
                                            onClick={handleUpdatePermissions}
                                        >
                                            {loading ? <Spinner size={'sm'} /> : 'Update'}
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
};

export default EditInventoryTransactionPermissionScreen;
