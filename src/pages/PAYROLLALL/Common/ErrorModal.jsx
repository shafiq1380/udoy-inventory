import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const ErrorModal = ({ test, handleModal, show, color }) => {
    return (
        <div>
            <Modal isOpen={show} toggle={handleModal} >
                <ModalHeader toggle={handleModal}></ModalHeader>
                <ModalBody>
                    <p className={`text-${color} fs-3 text-center`}> {test}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color={color} onClick={handleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ErrorModal