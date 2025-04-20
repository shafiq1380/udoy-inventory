import React from 'react'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { updateUserStatus } from '../../../store/users-list/actions'

const StatusUpdate = ({ user }) => {

    const statusCode = user.userLoginStatus ? 0 : 1
    const dispatch = useDispatch()

    const updateStatus = () => {
        const statusData = {
            data: {
                userID: user.userID,
                status: statusCode
            }
        }
        dispatch(updateUserStatus(statusData))

    }

    return (
        <div style={{ height: '200px' }}>
            <p className='text-center mt-md-5 fs-4'>
                Current User Status is
                {
                    user.userLoginStatus === 1 ?
                        <span className='text-success mx-2 font-weight-bold'>ACTIVE</span> :
                        <span className='text-danger mx-2 font-weight-bold'>INACTIVE</span>
                }
            </p>
            <p className='text-center mt-md-2 fs-3'> Do you want to change the Status ?</p>
            <Row>
                <div className="text-center">
                    {
                        user.userLoginStatus ?
                            <button
                                type="submit"
                                className="btn btn-danger save-user"
                                onClick={updateStatus}
                            >
                                Make Inactive
                            </button> :
                            <button
                                type="submit"
                                className="btn btn-success save-user"
                                onClick={updateStatus}
                            >
                                Make Active
                            </button>
                    }
                </div>
            </Row>
        </div >
    )
}

export default StatusUpdate