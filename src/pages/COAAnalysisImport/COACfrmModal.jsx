/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { Post } from '../../utils/https'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { coaImportByIdData } from '../../store/coa-analysis-import/actions';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const COACfrmModal = ({ show, handleClose, status, coa, analId }) => {

    const { state } = useLocation();

    const [error, setError] = useState('');
    const userCode = JSON.parse(localStorage.getItem('userID'));

    const dispatch = useDispatch();


    const handleSubmit = () => {
        setError(null)
        const data = {
            data: {
                analId: analId,
                subCodeID: coa.id,
                userCode: userCode
            }
        };

        // console.log("data", data);

        if (status === 0) {
            Post('/api/CoaSetup/CoaImportAdd', data)
                .then(res => {
                    // console.log("res CoaImportAdd ------->>> ", res)
                    if (res.data.success === true) {
                        handleClose();
                        toast.success(res.data.data, toastOptions);
                        setTimeout(() => {
                            dispatch(coaImportByIdData(state))
                        }, 1500)

                    } else {
                        setError(res.data.errorMessage)
                    }
                })
        } else if (status === 1) {
            Post('/api/CoaSetup/CoaImportDelete', data)
                .then(res => {
                    // console.log("res CoaImportDelete ------->>> ", res)
                    if (res.data.success === true) {
                        handleClose();
                        toast.success(res.data.data, toastOptions);
                        setTimeout(() => {
                            dispatch(coaImportByIdData(state));
                        }, 1500)
                    } else {
                        setError(res.data.errorMessage)
                    }
                })
        }
    };



    return (
        <>
            <Modal
                isOpen={show}
                top={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => handleClose()}
                size="md"
            >
                <div className="modal-content">
                    <ModalHeader
                        toggle={() => handleClose()}
                    >
                        {status === 0 ? ' Make Active' : ' Make Inactive'}
                    </ModalHeader>
                    <ModalBody>
                        <p className='text-center fs-3'>Do you Want
                            <span className='text-primary'>
                                {status === 0 ? ' Make Active' : ' Make Inactive'}
                            </span>
                        </p>
                        {error && <p className='text-center text-danger'>{error}</p>}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color='danger'
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            color='success'
                            onClick={handleSubmit}
                        >
                            Confirm
                        </Button>

                    </ModalFooter>
                </div>
            </Modal>

            <ToastContainer />

        </>
    )
}

export default COACfrmModal