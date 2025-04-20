import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const ItemModal = ({ show, error, handlModal, title }) => {

    return (
        <Modal isOpen={show} toggle={handlModal}>
            <ModalHeader toggle={handlModal}>{title}</ModalHeader>
            <ModalBody>
                <p className='text-center text-danger fs-3'> {error}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handlModal}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ItemModal