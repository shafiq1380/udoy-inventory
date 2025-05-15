/* eslint-disable react/prop-types */
import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { Alert, Card, CardBody, Col, Input, Label, Row, Spinner } from 'reactstrap'

const LoginRightBar = (
    {
        user,
        handleInputChange,
        handleLogin,
        error,
        captchaRef,
        handleCaptchaVerify,
        showPassword,
        handleShowPassword,
        loginStatus
    }
) => {
    return (
        <Card className='h-100 bg-white p-3'>
            <div className="bg-info bg-soft">
                <Row>
                    <Col xs={8} className='text-center w-100'>
                        <div className="text-primary p-4">
                            <p className="fs-3">Sign In to <br />
                                &apos;UDOY&apos;</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <CardBody className="pt-0">

                <div className="p-2">

                    {error ? <Alert color="danger">{error}</Alert> : null}
                    {/* <div className="mb-3">
                        <Label className="form-label fs-4 banglaBijoy">Company Code</Label>
                        <Input
                            name="cCode"
                            className="form-control fs-4 rounded-pill"
                            placeholder="Company Code"
                            type="text"
                            onChange={handleInputChange}
                            value={user.cCode.toUpperCase()}
                        />

                    </div> */}

                    <div className="mb-3">
                        <Label className="form-label fs-4 banglaBijoy">User ID</Label>
                        <Input
                            name="userID"
                            className="form-control fs-4 rounded-pill"
                            placeholder="user id"
                            type="text"
                            onChange={handleInputChange}
                            value={user.userID}
                        />

                    </div>

                    <div className="mb-3">
                        <Label className="form-label fs-4 banglaBijoy">Password</Label>
                        <div className=" position-relative  ">
                            <Input
                                className="form-control fs-4 rounded-pill pe-5  bg-transparent"
                                name="password"
                                value={user.password}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="password"
                                onChange={handleInputChange}
                            />

                            <div style={{ marginTop: '10px' }} className='position-absolute  end-0 me-3 top-0 rounded-end rounded-3 '>
                                {
                                    showPassword ?
                                        <AiOutlineEyeInvisible
                                            size={24}
                                            color='red'
                                            onClick={handleShowPassword}
                                            cursor='pointer'
                                        />
                                        :
                                        <AiOutlineEye
                                            size={24}
                                            color='green'
                                            onClick={handleShowPassword}
                                            cursor='pointer'
                                        />
                                }

                            </div>
                        </div>
                    </div>

                    {/* <div className="mt-4">
                        <ReCAPTCHA
                            ref={captchaRef}
                            sitekey="6LeJ3pAnAAAAAH-Wfk2OklT1llAYKiv1sRW4hEyp"
                            onChange={handleCaptchaVerify}
                        />
                    </div> */}

                    <div className="mt-3 d-grid">
                        <button
                            className="btn btn-info btn-block rounded-pill bg-gradient fs-4 banglaBijoy font-weight-bold"
                            // type="submit"
                            onClick={handleLogin}
                            disabled={!user.userID || !user.password}
                        >
                            {
                                loginStatus.loading
                                    ? <Spinner color="light">
                                    </Spinner> : 'Login'
                            }

                        </button>

                    </div>

                    <div className="mt-4 text-center ">
                        <Link to="/forgot-password" className="text-warning fs-5 banglaBijoy ">
                            <i className="mdi mdi-lock me-1" />
                            <u> Forgot your password ?</u>
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default LoginRightBar