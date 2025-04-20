import React, { useEffect, useState } from 'react'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Container, Card, CardBody, CardHeader, Row, Col, Form, FormGroup, Label, Button } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { authorization } from '../../components/Common/Authorization';
import { useSelector } from 'react-redux';

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};


const ReviseVoucher = () => {

    //meta title
    // document.title = "Revise Voucher | SMART Accounting System";
    const navigate = useNavigate();

    const [voucherRef, setVoucherRef] = useState('')


    const handleReviseVoucher = () => {
        // console.log("voucherRef ----------->>>>", voucherRef);

        if (voucherRef === '') {
            toast.error("Please enter voucher reference", toastOptions);
            return;
        }
        navigate('/revise-voucher-upload', { state: voucherRef });
    };

    //Authorization check
    useEffect(() => {
        authorization(20)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                <div>
                    <Breadcrumbs title="Transaction" breadcrumbItem="Voucher / Revise Voucher" />
                </div>
                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center">VOUCHER SELECTION FOR REVISE</h3>
                        </CardHeader>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row>
                            <Col sm={12} md={12} lg={6}>
                                <Form>
                                    <FormGroup>
                                        <Row>
                                            <Col sm={12} md={6} lg={3}>
                                                <Label for="voucherRef" size="md">Voucher Ref</Label>
                                            </Col>
                                            <Col sm={12} md={6} lg={9}>
                                                <input
                                                    type="text"
                                                    id="voucherRef"
                                                    name="voucherRef"
                                                    placeholder='Enter Voucher Reference'
                                                    className='form-control'
                                                    value={voucherRef}
                                                    onChange={(e) => setVoucherRef(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup className='text-end'>
                                        <Button
                                            type="button"
                                            color="success"
                                            className="mt-3 px-5"
                                            onClick={() => handleReviseVoucher()}
                                        >
                                            Show
                                        </Button>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </Container>
            <ToastContainer />
        </div>
    )
}

export default ReviseVoucher