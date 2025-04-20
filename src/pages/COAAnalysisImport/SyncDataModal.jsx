/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
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

const SyncDataModal = ({ show, handleClose, state, updateParentData, setUpdateParentData }) => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)


    console.log(updateParentData)
    const handleSubmit = async () => {
        setLoading(true)
        const data = {
            data: state.data
        };

        const syncData = await Post('/api/CoaSetup/CoaSyncForEmployee', data)
            .then(res => {
                if (res.data.success === true) {
                    handleClose()
                    setLoading(false)
                    setUpdateParentData(!updateParentData)
                } else {
                    setError(res.data.errorMessage)
                    setLoading(false)
                }
            })
    }


    return (
        <>
            <Modal
                isOpen={show}
                top={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => {
                    loading === false &&
                        handleClose()
                }}
                size="md"
            >
                <div className="modal-content">
                    <ModalHeader
                        toggle={() => {
                            loading === false &&
                                handleClose()
                        }
                        }
                    >
                        Sync Data
                    </ModalHeader>

                    <ModalBody>
                        {
                            loading ?
                                <div className='text-center'>
                                    <Spinner color="success" />
                                </div>
                                :
                                <p className='text-center fs-3'>

                                    {error ?
                                        <p className='text-center text-danger'>{error}</p>
                                        :
                                        <p> Do you Want Sync All Data</p>
                                    }
                                </p>
                        }
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            color='danger'
                            onClick={() => handleClose()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            color='success'
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Confirm
                        </Button>

                    </ModalFooter>
                </div>
            </Modal>

        </>
    )
}

export default SyncDataModal