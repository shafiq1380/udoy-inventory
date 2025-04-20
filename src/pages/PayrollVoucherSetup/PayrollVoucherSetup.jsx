import React, { useEffect, useState } from 'react'
import BackButton from '../../components/Common/BackButton'
import Breadcrumb from '../../components/Common/Breadcrumb'
import SalaryClearning from './SalaryClearning'
import TableOfContent from './TableOfContent'
import { authorization } from '../../components/Common/Authorization'

const PayrollVoucherSetup = () => {

    useEffect(() => {
        authorization(103)
    }, [])


    return (
        <div className='page-content'>

            <Breadcrumb title={' Configuration '} breadcrumbItem={'Payroll Voucher Setup'} />
            <BackButton />

            <TableOfContent />

        </div>
    )
}

export default PayrollVoucherSetup