import React, { useEffect, useState } from 'react'
import { Button, Col, Container, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Post } from '../../../utils/https'
import axios from 'axios'
import PayRollItem from './PayRollItem'
import TotalValue from './TotalValue'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import CustomSpinner from '../../../components/Common/CustomSpinner'

const Payroll = () => {

    const [payroll, setPayroll] = useState([])
    const [forTypeC, setForTypeC] = useState([])
    const [forTypeD, setForTypeD] = useState([])
    const [payStatus, setPayStatus] = useState(true)
    const [loading, setLoading] = useState(false)
    const [absentDays, setAbsentDays] = useState(0)

    const [houseResntShow, sethouseResntShow] = useState(false)

    const [error, setError] = useState('')

    const history = useNavigate()
    const { id } = useParams()


    const getPayroll = async () => {
        const response = await Post('/api/Payroll/GetEmployeePaySetup', {
            data: id
        }).then(res => {
            if (res.data.success === true) {
                setPayroll(res.data.data)
                setAbsentDays(res.data.data?.absentDays)
                setForTypeC(res.data.data?.paySetup?.filter(item => item.forType === "C"))
                // setForTypeD(payroll?.paySetup?.filter(item => item.forType === "D"))
                setForTypeD(res.data.data?.paySetup?.filter(item => item.forType === "D").map(item => item.forCode === 'Revenue stamp' && item.amount < 10 ? { ...item, amount: 10 } : item));
            }
        })
    }

    // console.log(payroll)

    const getHouseRent = async () => {
        const updatedForTypeC = [...forTypeC];
        const response = await Post('/api/Payroll/GetEmployeeHRent',
            {
                data: {
                    empID: id || 0,
                    basicAmount: forTypeC[0]?.amount,
                }
            }
        ).then(res => {
            // console.log(res.data)
            if (res.data.success === true) {
                updatedForTypeC[1] = { ...updatedForTypeC[1], amount: res.data.data };
                setForTypeC(updatedForTypeC);
                sethouseResntShow(false)
            }
        }).catch(err => console.log(err))

    }


    const reduceSumation = (value) =>
        (value || []).reduce((total, item) => {
            if (item?.amount !== undefined && item?.amount !== null && item?.amount !== "") {
                return total + parseFloat(item.amount);
            }
            return total;
        }, 0).toFixed(2);


    const totalSalary = reduceSumation(forTypeC)
    const totalDeduction = reduceSumation(forTypeD)
    const netSalary = totalSalary - totalDeduction

    // console.log(forTypeC)
    const handleChangeTypeC = (id, value, forCode) => {

        if ((value.match(/\./g) || []).length > 1) {
            return;
        }
        const numericValue = value.replace(/[^0-9.]/g, '');

        setForTypeC(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, amount: numericValue } : item
            )
        );

        if (id === 1) {
            sethouseResntShow(true)
        }


        //change the leave and Gratutity
        if (id === 20) {
            const updatedForTypeD = [...forTypeD];
            const index = updatedForTypeD.findIndex(item => item.id === 60);
            updatedForTypeD[index] = { ...updatedForTypeD[index], amount: numericValue };
            setForTypeD(updatedForTypeD);
        }
        if (id === 21) {
            //change the pension
            const updatedForTypeD = [...forTypeD];
            const index = updatedForTypeD.findIndex(item => item.id === 59);
            updatedForTypeD[index] = { ...updatedForTypeD[index], amount: numericValue };
            setForTypeD(updatedForTypeD);
        }

    };

    // console.log(forTypeD)


    const handleChangeTypeD = (id, value) => {
        if ((value.match(/\./g) || []).length > 1) {
            return;
        }
        const numericValue = value.replace(/[^0-9.]/g, 0);
        setForTypeD(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, amount: numericValue || 0 } : item
            )
        );
    };

    const handleUploadData = () => {
        setLoading(true)
        const data = [...forTypeC, ...forTypeD]
        // const updatedData = { ...payroll, paySetup: data, forName: payroll?.employeePayStatusID };

        const updatedData = {
            ...payroll, paySetup: data,
            ['employeePayStatusID']: payStatus ? 1 : 0,
            ['absentDays']: absentDays
        };

        // console.log(updatedData)
        try {
            Post('/api/Payroll/UpdateEmployeePaySetup', { data: updatedData })
                .then((res) => {
                    // console.log(res)
                    if (res.data.success === true) {
                        setLoading(false)
                        history('/payroll-list')
                    } else {
                        setError('Something went wrong')
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }


    const handleCheckBox = (e) => {
        const { checked } = e.target
        // setPayroll(prePayRoll => ({
        //     ...prePayRoll,
        //     ['employeePayStatusID']: checked ? 1 : 0,
        // }))
        setPayStatus(checked)
    }

    useEffect(() => {
        getPayroll()
    }, [])


    // useEffect(() => {
    //     if (payroll) {
    //         setForTypeC(payroll?.paySetup?.filter(item => item.forType === "C"))
    //         // setForTypeD(payroll?.paySetup?.filter(item => item.forType === "D"))
    //         setForTypeD(payroll?.paySetup?.filter(item => item.forType === "D").map(item => item.forCode === 'Revenue stamp' && item.amount < 10 ? { ...item, amount: 10 } : item));
    //     }
    // }, [payroll]) // relaod the rayroll


    // console.log(houseResntShow)

    useEffect(() => {
        // if (forTypeC?.[0]?.amount !== null && forTypeC?.[0]?.amount !== '') {
        //     getHouseRent();
        // }
        const timer = setTimeout(() => {
            if (forTypeC?.[0]?.amount !== null && forTypeC?.[0]?.amount !== '' && forTypeC?.[0]?.amount > 0
                && houseResntShow

            ) {
                getHouseRent();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [forTypeC?.[0]?.amount])

    // console.log(payroll)
    // console.log(forTypeD)

    return (
        <div className='page-content'>
            <Container fluid className='pb-5'>
                <Button
                    type="button"
                    color="success"
                    className="btn-rounded px-3"
                    onClick={() => history(-1)}
                >
                    <IoMdArrowRoundBack size={20} color='white' />
                </Button>
                {
                    payroll && payroll?.employeeName ?
                        <>
                            <h2 className='text-center'>Payroll Setup</h2>
                            <div>
                                <p className='m-0'>Emp ID: <span className='text-primary '>{payroll.employeeID}</span> </p>
                                <p className='m-0'>Name: <span className='text-primary '>{payroll.employeeName}</span> </p>
                                <p className='m-0'>Emp Code: <span className='text-primary '>{payroll.employeeCode}</span> </p>
                                <p className='m-0'>Emp Designation : <span className='text-primary '> {payroll.employeeDesignation}</span> </p>
                                <p className='m-0'>Emp Department : <span className='text-primary '> {payroll.employeeDepartment}</span> </p>
                                <p className='m-0'>Emp Type: <span className='text-primary '>{payroll.employeeTypeDet}</span> </p>

                                {payroll?.employeSalaryGrade ?
                                    < p className='m-0'>Emp Salary Grade:
                                        <span className='text-primary ps-2'>
                                            {payroll?.employeSalaryGrade}
                                        </span>
                                    </p> : null
                                }

                                {payroll?.employeWorklocation &&
                                    <p className='m-0'>Emp Work Location: <span className='text-primary '>{payroll?.employeWorklocation}</span> </p>
                                }


                                <p className='m-0'>Emp PayStatus: <span className='text-primary '>{payroll.employeePayStatus}</span> </p>
                            </div>

                            <div className='mt-4 text-start'>
                                <Row>
                                    <Col md={6}>
                                        <Col>
                                            <div className='d-flex'>
                                                <Col md={4}>
                                                    <h3 className='text-success mb-3 d-inline-block border-bottom border-4 border-success '>ADDITION </h3>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="fs-5 px-2 d-flex align-items-center">
                                                        <label className="form-check-label mx-4">Pay Status</label>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input checkboxboder  p-3"
                                                            // // name='isSerial'
                                                            // value={value}
                                                            defaultChecked={payroll.employeePayStatusID === 1 ? true : false}
                                                            onClick={handleCheckBox}
                                                        />
                                                    </div>
                                                </Col>
                                                {/* <Col md={4}>
                                                    <div className="fs-5 px-2 px-5">
                                                        <label className="form-check-label ">Absent Days</label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name='absentDays'
                                                            value={absentDays || 0}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                let number = value.replace(/[^0-9]/g, '');
                                                                if (number.startsWith("0") && number.length > 1) {
                                                                    number = number.slice(1);
                                                                }
                                                                setAbsentDays(number);
                                                            }}
                                                            placeholder="absent days"
                                                            onWheel={(event) => event.target.blur()}
                                                        />
                                                    </div>
                                                </Col> */}
                                            </div>
                                        </Col>
                                        {
                                            forTypeC?.map((item, index) => (
                                                <PayRollItem
                                                    key={item.id}
                                                    item={item}
                                                    handleChange={handleChangeTypeC}
                                                />
                                            ))
                                        }
                                        <TotalValue value={totalSalary} color={"success"} />
                                    </Col>

                                    <Col md={6}>
                                        <h3 className='text-danger mb-3 d-inline-block border-bottom border-4 border-danger'>DEDUCTION </h3>
                                        {
                                            forTypeD?.map((item, index) => (
                                                <PayRollItem
                                                    key={item?.id}
                                                    item={item}
                                                    handleChange={handleChangeTypeD}
                                                />
                                            ))
                                        }
                                        <TotalValue value={totalDeduction} color={"danger"} />
                                    </Col>
                                </Row>
                            </div>
                            <Col className='text-center mt-3' md={10}>
                                <h5>Net Payable: <h3 className='text-success d-inline'> {netSalary.toFixed(2)}</h3> </h5>
                                <Col className='text-center  mt-3' >
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="mb-2 me-2  px-5  "
                                        onClick={handleUploadData}
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner color="light" size="sm" /> : "Update"}
                                    </Button>
                                </Col>
                            </Col>
                        </> :
                        <h3 className='text-center'>No Data Found</h3>
                }
            </Container >

        </div >
    )
}

export default Payroll