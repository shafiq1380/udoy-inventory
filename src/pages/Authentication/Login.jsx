import React, { useEffect, useRef, useState } from "react";
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
import { Post } from "../../utils/https";

const Login = (props) => {

  //captha verification state
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef()
  //user data
  const [user, setUser] = useState({ userID: 'admin@smartaccounting.com', password: 'Monju@123' });


  //meta title
  // document.title = "Login | SMART Accounting System";
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
    // captchaRef.current.reset();
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
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to SMART Accounting System.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
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
                      <Label className="form-label">User ID</Label>
                      <Input
                        name="userID"
                        className="form-control"
                        placeholder="Enter User ID"
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

                    <div className="mb-3">
                      <Label className="form-label">Password</Label>
                      <Input
                        name="password"
                        value={user.password}
                        type="password"
                        placeholder="Enter Password"
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

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="customControlInline"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customControlInline"
                      >
                        Remember me
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
                        className="btn btn-primary btn-block"
                        // type="submit"
                        onClick={handleLogin}
                        disabled={!isCaptchaVerified || !user.userID || !user.password}
                      >
                        Log In
                      </button>
                    </div>

                    {/* use the gooogle recaptcha */}


                    <div className="mt-4 text-center">
                      <Link to="/forgot-password" className="text-muted">
                        <i className="mdi mdi-lock me-1" />
                        Forgot your password?
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
