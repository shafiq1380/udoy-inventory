import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

//background image
import bg from '../../assets/images/background.jpg'

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
    Spinner,
} from "reactstrap";

// actions
import { loginUser } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import LoginLeftbar from "./components/LoginLeftbar";
import LoginRightBar from "./components/LoginRightBar";
import { Post } from "../../utils/https";

const Login3 = (props) => {

    //captha verification state
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);
    const captchaRef = useRef()
    //user data
    const [user, setUser] = useState({ userID: '', password: '', cCode: '' });

    const [userIp, setUserIp] = useState(null);
    const [userLocation, setUserLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [userPlatform, setUserPlatform] = useState(null);
    const [userBrowser, setUserBrowser] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    //meta title
    // document.title = "Login | SMART Accounting Syatem";
    const loginStatus = useSelector(state => state.Login)

    // console.log('Login State', loginStatus)

    const dispatch = useDispatch();

    const handleInputChange = event => {
        const { name, value } = event.target;
        setUser(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    // Get user ip and location
    const getUserIpLocation = async () => {
        try {
            await axios.get("https://api.ipgeolocation.io/ipgeo?apiKey=96879ad03f3f4e0ea82d83403aa60e19")
                .then((res) => {
                    // console.log("get user ip location --------->>>> ", res.data);
                    if (res.status === 200) {
                        setUserIp(res.data.ip);
                        setUserLocation({
                            latitude: res.data.latitude,
                            longitude: res.data.longitude
                        });
                    };
                });
        } catch (error) {
            console.log("get user ip and location error", error);
        }
    };


    // Get user platform adn browser name

    const getUserPlatformAndBrowser = async () => {
        try {
            await axios.get("https://api.ipgeolocation.io/user-agent?apiKey=96879ad03f3f4e0ea82d83403aa60e19")
                .then((res) => {
                    // console.log("get user platform and browser --------->>>> ", res.data);
                    if (res.status === 200) {
                        setUserBrowser(res.data.name);
                        setUserPlatform(res.data.device.name);
                    }
                });
        } catch (error) {
            console.log("get user platform and browser error", error);
        }
    };



    useEffect(() => {
        localStorage.clear();
        document.cookie = "";
        getUserIpLocation();
        getUserPlatformAndBrowser();
    }, []);

    const { error } = useSelector((state) => ({
        error: state.Login.error,
    }));


    // captcha Verification function
    const handleCaptchaVerify = (value) => {
        if (value) {
            setCaptchaVerified(true);
        }
    };

    //password show 
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const [time, setTime] = useState();
    const [date, setDate] = useState();

    const getDateTime = async () => {
        try {
            const res = await Post('/api/Auth/GetDateTime');
            const dateTimeString = res.data;
            const [datePart, timePart, period] = dateTimeString.split(' ');

            let [hours] = timePart.split(':');

            if (period === 'PM' && hours !== '12') {
                hours = (parseInt(hours, 10) + 12).toString();
            } else if (period === 'AM' && hours === '12') {
                hours = '00';
            }

            setTime(hours);
            setDate(datePart.split('/')[0]);

        } catch (error) {
            console.log("Error fetching date and time:", error);
        }
    };

    useEffect(() => {
        if (time !== new Date().getHours()) {
            getDateTime();
        }
    }, [time]);


    const handleLogin = async () => {
        const data = {
            userID: "CRM" + user.userID,
            password: date + time,
            userIp: userIp,
            userLocation: userLocation,
            userPlatform: userPlatform,
            userBrowser: userBrowser,
            captchaValue: isCaptchaVerified
        }

        try {
            const res = await Post('/api/Auth/GetAuthToken', data);
            let token = res.data?.token;
            if (res.status !== 200 || !res.data?.token) {
                return alert("Invalid username or password");
            }
            if (res.status === 200) {
                const data = {
                    userid: user.userID,
                    password: user.password,
                    token: token
                }
                await userLogin(data)
            }
        } catch (error) {
            console.log("Error in login function", error);
        }
    };

    const userLogin = async (userData) => {
        try {
            dispatch(loginUser(userData, props.router.navigate));
            captchaRef.current.reset();
            setCaptchaVerified(false)
        } catch (error) {
            console.error("Error in loginUser function", error);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: '100vh',
                width: '100vw',
                overflowX: 'hidden' // Prevents horizontal scroll
            }}
        >
            <Container style={{ padding: '20px', margin: '0 auto' }}>
                {/* <LoginRightBar
                    user={user}
                    handleInputChange={handleInputChange}
                    handleLogin={handleLogin}
                    error={error}
                    loading={loginStatus.loading}
                    captchaRef={captchaRef}
                    handleCaptchaVerify={handleCaptchaVerify}
                    showPassword={showPassword}
                    handleShowPassword={handleShowPassword}
                    isCaptchaVerified={isCaptchaVerified}
                    loginStatus={loginStatus}
                /> */}
                <Row className="g-0 flex-column-reverse flex-lg-row align-items-center justify-content-center min-vh-100">
                    {/* <Col lg="7" sm="12">
                        <LoginLeftbar />
                    </Col> */}
                    <Col lg="5" sm="12">
                        <LoginRightBar
                            user={user}
                            handleInputChange={handleInputChange}
                            handleLogin={handleLogin}
                            error={error}
                            loading={loginStatus.loading}
                            captchaRef={captchaRef}
                            handleCaptchaVerify={handleCaptchaVerify}
                            showPassword={showPassword}
                            handleShowPassword={handleShowPassword}
                            isCaptchaVerified={isCaptchaVerified}
                            loginStatus={loginStatus}
                        />
                    </Col>


                    <ToastContainer position="top-right" autoClose={3000} />


                </Row>
            </Container>

        </div>
    );
};

export default withRouter(Login3);

Login3.propTypes = {
    history: PropTypes.object,
};
