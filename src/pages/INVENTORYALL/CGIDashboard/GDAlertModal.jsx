import React from 'react'
import { Button, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'

const GDAlertModal = ({ show, handleModal, id }) => {
    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true}>
            <div className="modal-content">
                <ModalHeader toggle={() => handleModal()}>Update Godown Rent Informatin</ModalHeader>
                <ModalBody className="px-4">

                    <CardTitle className="mb-4" tag="h1" >Update Godown {id} </CardTitle>
                    <Row>
                        <Col className="col-12">

                        </Col>

                    </Row>
                    <div className="text-right">
                        <Button
                            type="button"
                            color="success"
                        >
                            Update
                        </Button>
                    </div>
                </ModalBody>
            </div >
        </Modal >
    )
}

export default GDAlertModal