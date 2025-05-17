import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Nav, NavItem, NavLink, TabContent, TabPane
} from "reactstrap";

// Formik Validation
//import * as Yup from "yup";
//import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

//import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
//import { editProfile, resetProfileFlag } from "../../store/actions";
import { Post } from "../../utils/https";
import UserProfileImageUpload from "./components/UserProfileImageUploda";



const UserProfile = (props) => {

  // const { userID, userPhoto, userName, userEmail, userDesignation, userSection, userDepartment, userMobile } = useSelector(state => state.Login.userInformation)

  const userID = JSON.parse(localStorage.getItem('empCode'));
  const userPhoto = JSON.parse(localStorage.getItem('userPhoto'));
  const userName = JSON.parse(localStorage.getItem('userName'));
  const userEmail = JSON.parse(localStorage.getItem('userEmail'));
  const userDesignation = JSON.parse(localStorage.getItem('userDesignation'));
  const userDepartment = JSON.parse(localStorage.getItem('userDepartment'));
  const userMobile = JSON.parse(localStorage.getItem('userMobile'));

  //meta title
  // document.title = "Profile | SMART Account System";

  const dispatch = useDispatch();

  const [activeTab, setactiveTab] = useState('tab1')

  const [pwChangeInformation, setpwChangeInformation] = useState(
    {
      // bankCode: '',
      CurrentPassword: '',
      NewPassword: '',
      ConfirmNewPassword: '',


    }
  )

  const [passwordError, setpasswordError] = useState('')
  const [apirespMsg, setapirespMsg] = useState('')

  const [successMsg, setsuccessMsg] = useState('')

  const handleSubmit = async () => {
    //const data = { pwChangeInformation,  }

    setsuccessMsg('');

    const pdata = {
      data: {
        userID: userID,
        currentPassword: pwChangeInformation.CurrentPassword,
        newPassword: pwChangeInformation.NewPassword,
        confirmNewPassword: pwChangeInformation.ConfirmNewPassword
      }
    }

    console.log(pdata);

    try {
      Post('/api/UserManagement/UpdateLoginPassword', pdata).then((resp) => {
        // console.log(resp);
        setapirespMsg(resp.data.errorMessage);
        setpasswordError(resp.data.errorMessage);
        console.log(apirespMsg);
        console.log(passwordError);
      })

    } catch (error) {

    }

    console.log(apirespMsg);

    if (apirespMsg?.data.success == true) {
      setpasswordError('');
      setsuccessMsg('Password Updated Succesfully');
      console.log(apirespMsg?.data.success);
      setpwChangeInformation({
        CurrentPassword: '',
        NewPassword: '',
        ConfirmNewPassword: '',
      })

    }
    else {
      setpasswordError(apirespMsg?.data.errorMessage);
    }
  }

  const switchTab = (tab) => {
    setactiveTab(tab)
  }

  const handlepwChangeInformation = (e) => {
    // console.log(e.target.name);

    if (e.target.name == 'NewPassword') {
      validatePassword(e.target.value);
    }
    setpwChangeInformation({
      ...pwChangeInformation,
      [e.target.name]: e.target.value,

    });
  }

  const validatePassword = (val) => {

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;

    if (!passwordRegex.test(val)) {
      setpasswordError(
        'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 non-alphanumeric character.',
      );
      return false;
    }

    setpasswordError('');

    return true;
  };


  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }));

  useEffect(() => {

  }, [dispatch, success]);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="SMART Accounring" breadcrumbItem="Profile" />

          <Row>
            <Col lg="6">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}


              <Card>
                <CardBody>
                  <div className="d-flex p-4 justify-content-around">
                    {
                      userPhoto ?
                        <img src={`data:image/png;base64,${userPhoto}`} alt="" className="avatar-xl" />
                        : <p>No Image Found</p>
                    }
                    <div>
                      <p className="mb-2">
                        ID: <span className="text-primary">{userID}</span>
                      </p>
                      <p className="mb-2">
                        Name: <span className="text-primary">{userName}</span>
                      </p>
                      {
                        userDesignation &&
                        <p className="mb-2">
                          Designation: <span className="text-primary">{userDesignation}</span>
                        </p>
                      }
                      <p className="mb-2">
                        Department: <span className="text-primary">{userDepartment}</span>
                      </p>
                      <p className="mb-2">
                        Email: <span className="text-primary">{userEmail}</span>
                      </p>
                      <p className="mb-2">
                        Mobile : <span className="text-primary">{userMobile}</span>
                      </p>
                    </div>
                  </div>
                </CardBody>

              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardBody>
                  <div className='p-3'>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={activeTab === 'tab1' ? 'active' : ''}
                          onClick={() => switchTab('tab1')}
                        >
                          Change Password
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={activeTab === 'tab2' ? 'active' : ''}
                          onClick={() => switchTab('tab2')}
                        >
                          Change Profile Picture
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="tab1">

                        <div>

                          <br></br>
                          <Label for="CurrentPassword">
                            Current Password
                          </Label>
                          <Input
                            type="password"
                            id="CurrentPassword"
                            name="CurrentPassword"
                            placeholder='Current Password'
                            bsSize="sg"
                            onChange={handlepwChangeInformation}
                          />
                          <br></br>
                          <Label for="NewPassword">
                            New Password
                          </Label>
                          <Input
                            type="password"
                            id="NewPassword"
                            name="NewPassword"
                            placeholder='New Password'
                            bsSize="sg"
                            onChange={handlepwChangeInformation}
                          />
                          <br></br>
                          <Label for="ConfirmNewPassword">
                            Confirm New Password
                          </Label>
                          <Input
                            type="password"
                            id="ConfirmNewPassword"
                            name="ConfirmNewPassword"
                            placeholder='Confirm New Password'
                            bsSize="sg"
                            onChange={handlepwChangeInformation}
                          />
                          <br></br>

                          {successMsg && <p className="success">{successMsg}</p>}
                          {passwordError && <p className="error">{passwordError}</p>}
                          <br></br>
                          <Button
                            type="button"
                            color="success"
                            className="mb-2 me-2  px-5 "
                            onClick={handleSubmit}
                          >
                            Update
                          </Button>
                        </div>


                      </TabPane>
                      <TabPane tabId="tab2">
                        <UserProfileImageUpload />
                        {/* 
                        <div>

                          <br></br>

                          <label htmlFor="userImage">Select Image </label>
                          <input
                            type="file"
                            id="userImage"
                            name="userImage"
                            accept="image/*"
                            onChange={handlepwChangeInformation}
                          />

                          <br></br>
                          <br></br>
                          <Button
                            type="button"
                            color="success"
                            className="mb-2 me-2  px-5 "
                            onClick={handleSubmit}
                          >
                            Upload Image
                          </Button>
                        </div>
 */}

                      </TabPane>
                    </TabContent>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
