import React, { useEffect, useRef, useState } from 'react'
import GlobalTableContainer from '../../components/Common/GlobalTableContainer';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import CustomButton from './CustomButton';
import AutoCompleteInput from './AutoCompleteInput';
import { authorization } from '../../components/Common/Authorization';


const JournalVoucher = () => {

    const columns = [
        "SL#", "Select Account Code",
        "Particulars", "Debit(Dr)",
        "Credit(Cr)", "Currency",
        "Foreign Currency Amt", "Analysis", "Action"
    ]

    const [sl, setSl] = useState(1)
    const textInput = useRef(null);

    const { userName } = useSelector(state => state.Login.userInformation)

    const [selectOption, setSelectedOption] = useState()

    const [data, setData] = useState([]);
    const [inputValues, setInputValues] = useState({
        sl: sl,
        selectAccountCode: '',
        particulars: '',
        debit_dr: '',
        credit_cr: '',
        currency: '',
        forenginCurrency: '',
        analysis: ''

    });

    const deleteData = (e) => {
        const filter = data.filter(data => data.sl !== e)
        setData(filter)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, selectAccountCode: selectOption, [name]: value });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setSl(prec => prec + 1)
            setData([...data, inputValues]);
            setInputValues({
                sl: sl,
                selectAccountCode: '',
                particulars: '',
                debit_dr: '',
                credit_cr: '',
                currency: '',
                forenginCurrency: '',
                analysis: '',
            });
            setSelectedOption([])
        }
        // textInput.current.focus();
    };

    const handleAddData = () => {
        setSl(sl + 1)
        setData([...data, inputValues]);
        setInputValues({
            sl: sl,
            selectAccountCode: '',
            particulars: '',
            debit_dr: '',
            credit_cr: '',
            currency: '',
            forenginCurrency: '',
            analysis: ''
        });
        setSelectedOption()
    }


    const collectData = () => {
        // Get all input field data
    };

    // console.log(data);


    const handleSelection = (e) => {
        setSelectedOption(e.value)
    }



    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    // Format the date components as a string
    const fullDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const reduceDr = data.reduce((accumulator, current) => Number(accumulator) + Number(current.debit_dr), 0)
    const reduceCr = data.reduce((accumulator, current) => Number(accumulator) + Number(current.credit_cr), 0)
    const creditValue = reduceCr - reduceDr;

    const color = creditValue < 0 ? 'text-danger' : 'text-primary'



    //Authorization check
    useEffect(() => {
        authorization(14)
    }, [])


    return (
        <div className="page-content">
            <Row>
                {/* input top */}
                <Col xs="12">
                    <Card>
                        <CardBody>
                            <Form>
                                <Row className='align-items-center mb-4'>
                                    <Col md={6} className='d-flex flex-wrap'>
                                        <h4>Search Drafts Voucher:</h4>
                                        <Input
                                            name="search"
                                            placeholder='Search draft.....'
                                            className='mb-3 mb-md-0'
                                        />
                                    </Col>
                                    <Col md={6} className='d-flex gap-4 flex-wrap mt-md-4'>
                                        <CustomButton text={"Draft"} />
                                        <CustomButton text={"Preview"} />
                                        <CustomButton text={"Clear"} />
                                        <CustomButton text={"Copy"} />
                                        <CustomButton text={"Post"} />
                                    </Col>
                                </Row>

                                {/* calculative Value */}
                                <Row className='align-items-center'>
                                    <Col md={6}>
                                        <div className='d-flex justify-content-between  px-4'>
                                            <h4>{fullDate}</h4>
                                            <h3 className='text-success'>{userName}</h3>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <h5>Accont Dr - <span className='px-3 text-primary'>{reduceDr}</span></h5>
                                        <h5>Accont Cr - <span className='px-3 text-primary'>{reduceCr}</span></h5>
                                        <h5>Currency - <span className='px-4 text-primary'>{'BDT'}</span></h5>
                                        <h5>Currency Cr - <span className={`px-3 ${color}`}>{Math.abs(creditValue)}</span></h5>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* input from for data input */}
            <Row>
                <Col xs="12">
                    <Card>
                        <CardBody>
                            <Form>
                                <Row>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="account">
                                                Select Account Code
                                            </Label>
                                            {/* <Input
                                                id="account"
                                                name="selectAccountCode"
                                                onChange={handleInputChange}
                                                value={inputValues.selectAccountCode}
                                                innerRef={textInput}
                                            /> */}
                                            <AutoCompleteInput
                                                handleSelect={handleSelection}
                                                selectedOption={selectOption}
                                                innerRef={textInput}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="particulars">
                                                Particulars
                                            </Label>
                                            <Input
                                                id="particulars"
                                                name="particulars"
                                                placeholder='particulars'
                                                onChange={handleInputChange}
                                                value={inputValues.particulars}

                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1}>
                                        <FormGroup>
                                            <Label for="debit">
                                                Debit(Dr)
                                            </Label>
                                            <Input
                                                id="debit"
                                                name="debit_dr"
                                                type='number'
                                                placeholder='debitDr'
                                                onChange={handleInputChange}
                                                value={inputValues.debit_dr}
                                                disabled={inputValues.credit_cr}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1}>
                                        <FormGroup>
                                            <Label for="credit">
                                                Credit(Cr)
                                            </Label>
                                            <Input
                                                id="credit"
                                                name="credit_cr"
                                                type='number'
                                                placeholder='creditCr'
                                                onChange={handleInputChange}
                                                value={inputValues.credit_cr}
                                                disabled={inputValues.debit_dr}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1}>
                                        <FormGroup>
                                            <Label for="currency">
                                                Currency
                                            </Label>
                                            <Input
                                                id="currency"
                                                name="currency"
                                                placeholder='currency'
                                                onChange={handleInputChange}
                                                value={inputValues.currency}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="foreignCurrency">
                                                Foreign Currency Amt
                                            </Label>
                                            <Input
                                                id="exampleCity"
                                                name="forenginCurrency"
                                                placeholder='forenginCurrency'
                                                onChange={handleInputChange}
                                                value={inputValues.forenginCurrency}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={1}>
                                        <FormGroup>
                                            <Label for="analysis">
                                                Analysis
                                            </Label>
                                            <Input
                                                id="analysis"
                                                name="analysis"
                                                placeholder='analysis'
                                                onChange={handleInputChange}
                                                value={inputValues.analysis}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={1}>
                                        <FormGroup>
                                            <Label for="exampleZip">
                                                {''}
                                            </Label>
                                            <div className="exampleZip">
                                                <Button
                                                    type="button"
                                                    color="success"
                                                    className="btn-rounded mt-md-2 "
                                                    onClick={handleAddData}
                                                >
                                                    <i className="mdi mdi-plus me-1" />
                                                    Add
                                                </Button>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xs="12">
                    <Card>
                        <CardBody>
                            <GlobalTableContainer
                                data={data}
                                columns={columns}
                                className="custom-header-css"
                                deleteData={deleteData}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </div >

    )
}

export default JournalVoucher