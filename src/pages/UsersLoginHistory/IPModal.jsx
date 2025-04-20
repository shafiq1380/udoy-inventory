/* eslint-disable react/prop-types */
import React from 'react'
import { Button, Container, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'


const IPModal = ({ handleModal, show, ipData }) => {

    return (
        <div className="page-content">
            <Container fluid>
                <Modal
                    isOpen={show}
                    toggle={() => handleModal()}
                    top={true}
                    size="md"
                >
                    <ModalHeader toggle={() => handleModal()}> Login History IP Details</ModalHeader>
                    <ModalBody>
                        <div className="table-responsive">
                            <table className="table table-centered table-nowrap mb-0 border border-amber-500">
                                <tbody>
                                    <tr>
                                        <th scope="row">IP Address</th>
                                        <td>{ipData && ipData.ip}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Country</th>
                                        <td>Bangladesh</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">State</th>
                                        <td>Dhaka Division</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">City</th>
                                        <td>Dhaka</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">ZIP Code</th>
                                        <td>1212</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Location</th>
                                        <td>
                                            <a className='text-primary'>{ipData && ipData.latLang}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">ISP</th>
                                        <td>ADN Telecom Ltd.</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Organization</th>
                                        <td>ADN Telecom Ltd.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="danger" onClick={() => handleModal()}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>

    )
}

export default IPModal