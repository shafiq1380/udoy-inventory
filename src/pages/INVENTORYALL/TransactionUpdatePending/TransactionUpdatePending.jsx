import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Post } from '../../../utils/https';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import CustomSpinner from '../../../components/Common/CustomSpinner';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const TransactionUpdatePending = () => {
    const navigate = useNavigate();
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getTransactionValueUpdateLists = async () => {
        setLoading(true);
        try {
            const res = await Post('/api/v1/InvTransaction/GetInventoryValueUpdatePendingList');
            setPendingList(res.data.data);
        } catch (error) {
            console.log("Transaction Value Update List Error", error);
            toast.error("Failed to fetch data", toastOptions);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTransactionValueUpdateLists();
    }, []);

    const handleUpdateTransactionValue = (refNo) => {
        navigate(`/transaction-value-update`, { state: { refNo } });
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Transaction Update Pending" />
                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase">Transaction Value Update Screen</h3>
                        </CardHeader>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        {
                            loading ? <div className="text-center"><CustomSpinner /></div>
                                :
                                pendingList && pendingList.length === 0 ? <h1 className="text-center text-danger">No data available</h1>
                                    :
                                    <table className="table table-striped table-bordered table-sm">
                                        <thead>
                                            <tr className='fw-bold'>
                                                <th>ID</th>
                                                <th>Ref</th>
                                                <th>Date</th>
                                                <th>Trn Type</th>
                                                <th>Create User</th>
                                                <th>Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pendingList && pendingList.map((item, index) => {

                                                    const formatDate = new Date(item.trnDate);
                                                    const date = formatDate.getDate();
                                                    const month = formatDate.getMonth() + 1;
                                                    const year = formatDate.getFullYear();
                                                    const formattedDate = `${('0' + date).slice(-2)}/${('0' + month).slice(-2)}/${year}`;

                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.id}</td>
                                                            <td>{item.trnRefNo}</td>
                                                            <td>{formattedDate}</td>
                                                            <td>{item.trnDesc}</td>
                                                            <td>{item.createBy}</td>
                                                            <td>
                                                                <Button
                                                                    color="primary"
                                                                    className="btn-sm btn-rounded"
                                                                    onClick={() => handleUpdateTransactionValue(item.trnRefNo)}
                                                                >
                                                                    Update
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                        }
                    </CardBody>
                </Card>
                <ToastContainer />
            </Container>
        </div>
    );
};

export default TransactionUpdatePending;
