import React from "react"
import PropTypes from "prop-types"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap"
// import img7 from "../../../assets/images/product/img-7.png"
// import img4 from "../../../assets/images/product/img-4.png"

const analDetailsModal = props => {
  const { isOpen, toggle, analType } = props
  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="exampleModal"
      tabIndex="-1"
      toggle={toggle}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Analysis Type  Details</ModalHeader>
        <ModalBody>
          <div className="d-flex p-4 justify-content-around">
           
            <div>
              <p className="mb-2">
                ID: <span className="text-primary">{analType?.id}</span>
              </p>
              <p className="mb-2">
                Analysis Name: <span className="text-primary">{analType?.analysisTypeName}</span>
              </p>
              
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}

analDetailsModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default analDetailsModal
