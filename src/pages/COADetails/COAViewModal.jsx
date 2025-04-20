/* eslint-disable react/prop-types */
import React from 'react'
import { Button, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, } from 'reactstrap'


const COAViewModal = ({ handleModal, show, }) => {
    return (
        <div className="page-content">
            <Container fluid>
                <Modal
                    isOpen={show}
                    toggle={() => handleModal()}
                    top={true}
                    size="md"
                >
                    <ModalHeader toggle={() => handleModal()}> COA View</ModalHeader>
                    <ModalBody>

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

export default COAViewModal