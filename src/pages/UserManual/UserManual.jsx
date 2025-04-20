import React from 'react'
import { Container } from 'reactstrap';
import userManualPage from '../../User Manual/SmartAccountingSystemUserManual.pdf'


const UserManual = () => {
    return (
        <div className='page-content'>
            <Container fluid className='pb-5'>
                <h2 className='text-center'>User Manual</h2>
                <div>
                    <iframe
                        src={userManualPage}
                        frameborder="0"
                        width="100%"
                        height="1000px"
                    ></iframe>
                </div>
            </Container>
        </div>
    )
}

export default UserManual