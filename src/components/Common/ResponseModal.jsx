import PropTypes from 'prop-types'
import React from "react"
import { Modal, ModalBody } from "reactstrap"
import { CiBank } from 'react-icons/ci';

const ResponseModal = ({ show, onDeleteClick, onCloseClick, errorMsg, msg, showbtn }) => {
  return (
    <Modal size="sm" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
              {/* <i className="bi bi-trash"></i> */}
              <CiBank size={30} />
            </div>
          </div>
          {
            showbtn ?
              <p className='text-danger font-size-20 mb-4'>
                DO YOU WANT TO DELETE
              </p> :
              <p className={`font-size-20 mb-4 ${errorMsg ? 'text-danger' : 'text-success'}`}>
                {errorMsg ? errorMsg : msg}
              </p>
          }

          <div className="hstack gap-2 justify-content-center mb-0">
            {showbtn && <button type="button" className="btn btn-danger" onClick={onDeleteClick}>Delete Now</button>}
            <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
          </div>
        </ModalBody>
      </div>
    </Modal >
  )
}

ResponseModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
}

export default ResponseModal
