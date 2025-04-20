import React, { useEffect } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Card, CardBody, Container } from 'reactstrap'
import BackButton from '../../../components/Common/BackButton'

const GDIDetails = () => {


    useEffect(() => {
        authorization(115)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Chemical Godown Details'} title={'CGI'} />
                <BackButton />
            </Container>
        </div>
    )
}

export default GDIDetails