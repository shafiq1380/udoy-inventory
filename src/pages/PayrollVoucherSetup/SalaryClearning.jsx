import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Row, Spinner } from 'reactstrap'
import PayrollInput from './PayrollInput'
import { Post } from '../../utils/https';

const SalaryClearning = ({ handleModal, getError, data }) => {

    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const [slData, setSlslData] = useState(null)

    const handleSlData = (e) => {
        setDisabled(false)
        setSlslData({ ...slData, [e.target.name]: e.target.value })
    }


    useEffect(() => {
        setSlslData(data)
    }, [data])

    const handleSubmit = async () => {
        const data = [{
            forID: slData?.forID,
            empTypeID: slData?.empTypeID,
            expTypeID: slData?.expTypeID,
            coaID: null,
            coaCode: slData?.coaCode,
            analCode1: slData?.analCode1,
            analCode2: slData?.analCode2,
            analCode3: slData?.analCode3
        }]
        setLoading(true);

        // console.log({ data })

        try {
            await Post('/api/Payroll/UpdateSalaryVoucherSetup', { data })
                .then(res => {
                    if (res.data.success === true) {
                        setLoading(false);
                        getError({ message: "Updated Successful", color: 'success' });
                        handleModal()
                    } else {
                        // console.log(res)
                        setLoading(false);
                        getError({ message: res.data.errorMessage, color: 'danger' });
                        handleModal()
                    }

                });
        } catch (error) {
            setLoading(false);
            getError("An error occurred");
        }
    };


    return (
        <Card className='mt-4'>
            <CardBody className={'pb-0'}>
                <Row>
                    <Col md={2} >
                        <PayrollInput
                            lable={'Salary  Clearing'}
                            // placeholder={'Salary Clearing'}
                            value={slData?.coaCode}
                            onChangeHandler={handleSlData}
                            name={'coaCode'}
                        />
                    </Col>
                    <Col md={2}>
                        <PayrollInput
                            lable={'Anal 1'}
                            // placeholder={'Anal 1'}
                            value={slData?.analCode1}
                            onChangeHandler={handleSlData}
                            name={'analCode1'}
                        />
                    </Col>
                    <Col md={2}>
                        <PayrollInput
                            lable={'Anal 2'}
                            // placeholder={'Anal 2'}
                            value={slData?.analCode2}
                            onChangeHandler={handleSlData}
                            name={'analCode2'}
                        />
                    </Col>
                    <Col md={2}>
                        <PayrollInput
                            lable={'Anal 3'}
                            // placeholder={'Anal 3'}
                            value={slData?.analCode3}
                            onChangeHandler={handleSlData}
                            name={'analCode3'}
                        />
                    </Col>
                    <Col md={2} className='d-flex align-items-center pt-2'>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner color="success" />
                            </div>
                        ) : (
                            <Button
                                color="success"
                                className={'ms-md-2 mb-3 mb-md-0'}
                                disabled={disabled}
                                onClick={handleSubmit}
                            >
                                Update
                            </Button>
                        )}
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default SalaryClearning