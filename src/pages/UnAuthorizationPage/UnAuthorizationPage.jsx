import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

const UnAuthorizationPage = () => {
    return (
        <div className="page-content">
            <div className='d-flex justify-content-center align-items-center flex-column '>
                <p className='mt-5 display-4 text-danger'>You are UnAuthorized</p>
                {/* <Link to={'/'}>
                    <Button className='btn btn-primary bg-primary p-3'>Back To Home Page</Button>
                </Link> */}
            </div>
        </div>
    )
}

export default UnAuthorizationPage