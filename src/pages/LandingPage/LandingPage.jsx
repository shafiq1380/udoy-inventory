import React, { useEffect } from 'react'

const LandingPage = () => {

    // const module = JSON.parse(localStorage.getItem('module'))

    // const title = module === 2 ? 'Payroll Management System' : module === 3 ? 'Inventory Management System' : 'Management and Accounting System'


    // document.title = title
    return (
        <div className="page-content">
            <div className='d-flex justify-content-center align-items-center flex-column '>
                <img />
                {/* <p className='mt-5 display-5 text-muted'>
                    Welcome !
                </p> */}
                <p className='display-5 text-muted'>
                    {/* {title} */}
                    Inventory Management System
                </p>
                {/* <Link to={'/'}>
                <Button className='btn btn-primary bg-primary p-3'>Back To Home Page</Button>
            </Link> */}
            </div>
        </div>
    )
}

export default LandingPage