import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import ReCAPTCHA from "react-google-recaptcha";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


//redux
import { useSelector, useDispatch } from "react-redux";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import {
    Row,
    Col,
    CardBody,
    Card,
    Alert,
    Container,
    Form,
    Input,
    FormFeedback,
    Label,
} from "reactstrap";

// actions
import { loginUser } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";

const Login = (props) => {

    //captha verification state
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);
    const captchaRef = useRef()
    //user data
    const [user, setUser] = useState({ userID: 'admin@smartaccounting.com', password: 'Monju@123' });


    //meta title
    // document.title = "Login | SMART Accounting Syatem";
    const dispatch = useDispatch();

    const handleInputChange = event => {
        const { name, value } = event.target;
        setUser(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleLogin = () => {
        const userData = {
            data: {
                userID: user.userID,
                password: user.password
            }
        }

        dispatch(loginUser(userData, props.router.navigate));
        setUser({ userID: "", password: "" })
        captchaRef.current.reset();
        setCaptchaVerified(false)

    }

    // const validation = useFormik({
    //   // enableReinitialize : use this flag when initial values needs to be changed
    //   enableReinitialize: true,

    //   initialValues: {
    //     email: "admin@smartaccounting.com" || "",
    //     password: "123456" || "",
    //   },
    //   validationSchema: Yup.object({
    //     email: Yup.string().required("Please Enter Your Email"),
    //     password: Yup.string().required("Please Enter Your Password"),
    //   }),
    //   onSubmit: (values) => {
    //     dispatch(loginUser(values, props.router.navigate));
    //   },
    // });

    //catch the Error 

    const { error } = useSelector((state) => ({
        error: state.Login.error,
    }));


    // captha Verification function
    const handleCaptchaVerify = (value) => {
        if (value) {
            setCaptchaVerified(true);
        }
    };

    return (
        <React.Fragment>
            <ToastContainer position="top-right" autoClose={3000} />
            {/* <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div> */}

            <div className="account-pages sm-my-5  pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <div className="bg-info bg-soft">
                                    <Row>
                                        <Col xs={8}>
                                            <div className="text-primary p-4">
                                                <h2 className="text-primary banglaBijoy">
                                                    স্মার্ট একাউন্টিং সিস্টেমে আপনাকে স্বাগতম !
                                                </h2>
                                                {/* <p>Sign in to continue to SMART Accounting System.</p> */}
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            {/* <img src={profile} alt="" className="img-fluid" /> */}
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div>
                                        <Link to="#" className="auth-logo-light">
                                            <div className="avatar-md profile-user-wid2 mb-0 ">
                                                <span className="avatar-title rounded-circle bg-light ">
                                                    <img
                                                        src={logo}
                                                        alt="logo"
                                                        className="rounded-circle"
                                                        height="100"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-2">
                                        {/* <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    > */}
                                        {error ? <Alert color="danger">{error}</Alert> : null}

                                        <div className="mb-3">
                                            <Label className="form-label fs-4 banglaBijoy">ইউজার আইডি</Label>
                                            <Input
                                                name="userID"
                                                className="form-control fs-4 rounded-pill"
                                                placeholder="ইউজার আইডি"
                                                type="text"
                                                onChange={handleInputChange}
                                                // onBlur={validation.handleBlur}
                                                value={user.userID}
                                            // invalid={
                                            //   validation.touched.email && validation.errors.email
                                            //     ? true
                                            //     : false
                                            // }
                                            />
                                            {/* {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null} */}
                                        </div>

                                        <div className="mb-3 ">
                                            <Label className="form-label fs-4 banglaBijoy">পাসওয়ার্ড</Label>
                                            <Input
                                                className="fs-4 rounded-pill"
                                                name="password"
                                                value={user.password}
                                                type="password"
                                                placeholder="পাসওয়ার্ড"
                                                onChange={handleInputChange}
                                            // onBlur={validation.handleBlur}
                                            // invalid={
                                            //   validation.touched.password &&
                                            //     validation.errors.password
                                            //     ? true
                                            //     : false
                                            // }
                                            />
                                            {/* {validation.touched.password &&
                        validation.errors.password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null} */}
                                        </div>

                                        <div className="form-check fs-4 py-2 ">
                                            <input
                                                type="checkbox"
                                                className="form-check-input checkboxboder"
                                                id="customControlInline"
                                            />
                                            <label
                                                className="form-check-label banglaBijoy"
                                                htmlFor="customControlInline"
                                            >
                                                মনে  রাখুন
                                            </label>
                                        </div>

                                        <div className="mt-3">
                                            <ReCAPTCHA
                                                ref={captchaRef}
                                                sitekey="6LeJ3pAnAAAAAH-Wfk2OklT1llAYKiv1sRW4hEyp"
                                                onChange={handleCaptchaVerify}
                                            />
                                        </div>

                                        <div className="mt-3 d-grid">
                                            <button
                                                className="btn btn-info btn-block rounded-pill bg-gradient fs-4 banglaBijoy font-weight-bold"
                                                // type="submit"
                                                onClick={handleLogin}
                                                disabled={!isCaptchaVerified || !user.userID || !user.password}
                                            >
                                                লগইন করুন
                                            </button>
                                        </div>

                                        {/* use the gooogle recaptcha */}


                                        <div className="mt-4 text-center">
                                            <Link to="/forgot-password" className="text-warning fs-5 banglaBijoy ">
                                                <i className="mdi mdi-lock me-1" />
                                                <u> পাসওয়ার্ড ভুলে গেছেন ?</u>
                                            </Link>
                                        </div>
                                        {/* </Form> */}
                                    </div>
                                </CardBody>
                            </Card>
                            {/* <div className="mt-5 text-center">
                <p>
                  Don&#39;t have an account ?{" "}
                  <Link to="/register" className="fw-medium text-primary">
                    {" "}
                    Signup now{" "}
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default withRouter(Login);

Login.propTypes = {
    history: PropTypes.object,
};
