import React from 'react'
import bsec from '../../../assets/images/logo.png'
import gov from '../../../assets/images/cmLogo/gov.png'
import bsec_product from '../../../assets/images/cmLogo/bsec_product.png'
import cm1 from '../../../assets/images/cmLogo/cm1.jpg'
import cm2 from '../../../assets/images/cmLogo/cm2.png'
import cm3 from '../../../assets/images/cmLogo/cm3.jpg'
import cm4 from '../../../assets/images/cmLogo/cm4.jpg'
import cm5 from '../../../assets/images/cmLogo/cm5.jpg'
import cm6 from '../../../assets/images/cmLogo/cm6.png'
import cm7 from '../../../assets/images/cmLogo/cm7.jpg'
import cm8 from '../../../assets/images/cmLogo/cm8.jpg'
import { Card } from 'reactstrap'

const LoginLeftbar = () => {
    return (
        <Card
            className='d-flex h-100 bg-white rounded flex-column justify-content-between align-items-center '
            style={{ padding: '40px' }}
        >
            <div className='d-flex justify-content-between align-items-center '>
                <img
                    src={gov}
                    className="rounded-circle"
                    height="80"
                />

                <div>
                    <h3 className='text-center mx-3 ' style={{ color: '#7360f2' }}>
                        সংস্কার, স্বচ্ছতা ও গতিশীলতা আনয়নে
                    </h3>
                    <p className='text-success text-center mx-3 fs-4'>
                        ‘Management & Accounting System of BSEC (MAcS of BSEC)’

                    </p>
                </div>
                <img
                    src={bsec}
                    className="rounded-circle"
                    height="80"
                />
            </div>

            <p className='text-success text-black mt-4 fs-4 px-' style={{ textAlign: 'justify' }}>
                ‘MAcS of BSEC’ সফটওয়্যার সিস্টেমটির Accounts, Payroll এবং Inventory মডিউল সম্পন্ন করে দাপ্তরিক কার্যক্রম পরিচালনা করা হচ্ছে।
            </p>


            <img
                src={bsec_product}
                className="rounded-circle text-center"
                width={'400px'}
            />

            <div className='d-flex justify-content-center w-100 flex-wrap'>
                <img
                    src={cm1}
                    height='50'
                />
                <img
                    src={cm2}
                    height='50'
                />
                <img
                    src={cm3}
                    height='50'
                />
                <img
                    src={cm4}
                    height='50'
                />
                <img
                    src={cm5}
                    height='50'
                />
                <img
                    src={cm6}
                    height='50'
                />
                <img
                    src={cm7}
                    height='50'
                />
                <img
                    src={cm8}
                    height='50'
                />
                <img
                    src={bsec}
                    height='50'
                />
            </div>
        </Card>


    )
}

export default LoginLeftbar