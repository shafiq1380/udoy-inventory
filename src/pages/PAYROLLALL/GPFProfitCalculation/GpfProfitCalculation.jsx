import React, { useEffect } from 'react'
import { authorization } from '../../../components/Common/Authorization'

const GpfProfitCalculation = () => {

    useEffect(() => {
        authorization(117)
    }, [])
    return (
        <div className='page-content'>GpfProfitCalculation</div>
    )
}

export default GpfProfitCalculation