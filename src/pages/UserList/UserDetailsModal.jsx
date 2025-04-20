import React, { useEffect } from "react"
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

const UserDetailsModal = props => {
  const { isOpen, toggle, user } = props



  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      // centered={true}
      className="exampleModal"
      tabIndex="-1"
      toggle={toggle}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Employee  Details</ModalHeader>
        <ModalBody>
          <div className="d-flex p-4 justify-content-around">
            {
              user?.userPhoto ?
                <img src={`data:image/png;base64,${user?.userPhoto}`} alt="" className="avatar-xl" />
                : <p>No Image Found</p>
            }
            <div>
              <p className="mb-2">
                #id: <span className="text-primary">{user?.userID}</span>
              </p>
              <p className="mb-2">
                Name: <span className="text-primary">{user?.userName}</span>
              </p>
              {
                user?.userDesignation &&
                <p className="mb-2">
                  Designation: <span className="text-primary">{user?.userDesignation}</span>
                </p>
              }
              <p className="mb-2">
                Email: <span className="text-primary">{user?.userEmail}</span>
              </p>
              <p className="mb-2">
                Mobile : <span className="text-primary">{user?.userMobile}</span>
              </p>
              <p className="mb-2">
                NID : <span className="text-primary">{user?.userNID}</span>
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="danger" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}

UserDetailsModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
}

export default UserDetailsModal
