/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const TransactionDeleteModal = ({ isOpen, onClose, title, header, handleClick }) => {

    return (
        <Modal isOpen={isOpen} toggle={onClose}>
            <ModalHeader toggle={onClose}>{header}</ModalHeader>
            <ModalBody>
                {title}
            </ModalBody>
            <ModalFooter>
                <button onClick={handleClick} className="btn btn-danger">
                    Yes
                </button>
                <button onClick={onClose} className="btn btn-secondary">
                    No
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default TransactionDeleteModal