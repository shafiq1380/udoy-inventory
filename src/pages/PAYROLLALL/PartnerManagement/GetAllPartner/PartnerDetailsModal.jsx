/* eslint-disable react/prop-types */
import React from 'react'
import { Button, Card, CardBody, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { fileUploadURL } from '../../../../utils/https';

const PartnerDetailsModal = ({ partnerDetailsModal, setPartnerDetailsModal, partnerDetails }) => {

    // console.log("partnerDetails", partnerDetails)


    const handleAttachment = (id) => {
        // console.log("attachment id", id)

        const popupWidth = 900; // Set your desired width
        const popupHeight = 500; // Set your desired height
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 4;
        const url = `${fileUploadURL}catId=5&id=${id}`;
        window.open(
            url,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`
        );
    };

    return (
        <div>
            <Modal
                isOpen={partnerDetailsModal}
                role="dialog"
                autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => { setPartnerDetailsModal(!partnerDetailsModal) }}
                size="lg"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => { setPartnerDetailsModal(!partnerDetailsModal) }}>Partner Details</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col sm="12" md="6" lg="6">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">Partner Type ID</Label>
                                        <h6 className="control-label">{partnerDetails.partnerTypeId}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Partner Type</Label>
                                        <h6 className="control-label">{partnerDetails.partnerTypeName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Partner Name</Label>
                                        <h6 className="control-label">{partnerDetails.partnerName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Address</Label>
                                        <h6 className="control-label">{partnerDetails.displayAddress}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Billing Address</Label>
                                        <h6 className="control-label">{partnerDetails.billtoAddress}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Shipping Address</Label>
                                        <h6 className="control-label">{partnerDetails.shiptoAddress}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Email Address</Label>
                                        <h6 className="control-label">{partnerDetails.emailAddress}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Contract Number</Label>
                                        <h6 className="control-label">{partnerDetails.contractNumber}</h6>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col sm="12" md="6" lg="6">
                                <Card>
                                    <CardBody>

                                        <Label className="control-label fw-bolder">Country Name</Label>
                                        <h6 className="control-label">{partnerDetails.countryName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Division IName</Label>
                                        <h6 className="control-label">{partnerDetails.divisionIName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">District Name</Label>
                                        <h6 className="control-label">{partnerDetails.districtName}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Thana Name</Label>
                                        <h6 className="control-label">{partnerDetails.thanaUpozilla}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Zone</Label>
                                        <h6 className="control-label">{partnerDetails.zone}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">BIN Number</Label>
                                        <h6 className="control-label">{partnerDetails.binNumber}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">COA Code</Label>
                                        <h6 className="control-label">{partnerDetails.coaCode}</h6>
                                        <br />

                                        <Label className="control-label fw-bolder">Active Status</Label>
                                        <h6 className="control-label">{partnerDetails.rStatus === 1 ? 'Active' : 'Inactive'}</h6>

                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="success" onClick={() => handleAttachment(partnerDetails.id)}>
                            Attachment
                        </Button>
                        <Button type="button" color="danger" onClick={() => { setPartnerDetailsModal(!partnerDetailsModal) }}>
                            Close
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    )
}

export default PartnerDetailsModal