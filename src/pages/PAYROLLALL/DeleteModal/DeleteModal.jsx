import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const DeleteModal = ({ isDeleteModalOpen, handleRemoveAllowance, handleCloseModal }) => {
    return (
        <Modal size="md" isOpen={isDeleteModalOpen} toggle={handleCloseModal}>
            <ModalHeader toggle={handleCloseModal}>Delete</ModalHeader>
            <ModalBody className="text-center">
                <p className="text-center fs-2"> Are you sure to delete?</p>
            </ModalBody>
            <ModalFooter>
                <button onClick={handleCloseModal} className="btn btn-danger">
                    Cancel
                </button>
                <button onClick={handleRemoveAllowance} className="btn btn-success">
                    Confirm
                </button>
            </ModalFooter>
        </Modal>
    )
}

export default DeleteModal