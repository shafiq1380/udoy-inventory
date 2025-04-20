import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    Button,
    Card,
    CardText,
    CardTitle,
    Col,
    Form,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../../store/users-list/actions';
import Tab2 from './components/UserProfileTab';
import Tab3 from './components/UserRoleTab';
import UserPasswordTab from './components/UserPasswordTab';
import StatusUpdate from './components/StatusUpdate';

const InputFieldModal = ({ modal, toggle, title, user, isEdit, reloadPage }) => {

    const { error, reload } = useSelector(state => state.usersReducer);

    const [activeTab, setactiveTab] = useState('tab1')

    const dispatch = useDispatch()

    const switchTab = (tab) => {
        setactiveTab(tab)
    }


    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            userID: (user && user.userID) || "",
            userName: (user && user.userName) || "",
            userDepartment: (user && user.userDepartment) || "",
            userDesignation: (user && user.userDesignation) || "",
            userEmail: (user && user.userEmail) || "",
            userMobile: (user && user.userMobile) || "",
            userSection: (user && user.userSection) || "",
            userNID: (user && user.userNID) || "",
            password: "",
        },
        validationSchema: () => {
            if (isEdit) {
                return Yup.object({
                    userID: Yup.string()
                        // .matches(/^[0-9]+$/, "Please Enter Valid user Id")
                        .required("Please Enter Your user Id"),
                    userName: Yup.string().required("Please Enter Your User Name"),
                    userDepartment: Yup.string().required("Please Enter Department"),
                    userDesignation: Yup.string().required("Please Enter Designation"),
                    userEmail: Yup.string()
                        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please Enter Valid Email")
                        .required("Email Address"),
                    userMobile: Yup.string()
                        .min(11, 'Input length must be at least 11 Digits')
                        .max(11, 'Mobile Number Must be 11 Digits')
                        .matches(/^(?:[0-9]|10|11)+$/, "Please Enter Valid Mobile Number")
                        .required("Mobile Number"),
                    // userSection: Yup.string().required("Please Enter User Section"),
                    // password: Yup.string()
                    //     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Enter Strong Password Example: (Adn$Ud@y@123)")
                    //     .required("Please Enter Your Password "),
                })
            }
            return Yup.object({
                userID: Yup.string()
                    // .matches(/^[0-9]+$/, "Please Enter Valid user Id")
                    .required("Please Enter Your user Id"),
                userName: Yup.string().required("Please Enter Your User Name"),
                userDepartment: Yup.string().required("Please Enter Department"),
                userDesignation: Yup.string().required("Please Enter Designation"),
                userEmail: Yup.string()
                    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please Enter Valid Email")
                    .required("Email Address"),
                userMobile: Yup.string()
                    .min(11, 'Input length must be at least 11 Digits')
                    .max(11, 'Mobile Number Must be 11 Digits')
                    .matches(/^(?:[0-9]|10|11)+$/, "Please Enter Valid Mobile Number")
                    .required("Mobile Number"),
                // userSection: Yup.string().required("Please Enter User Section"),
                password: Yup.string()
                    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Enter Strong Password Example: (Adn$Ud@y@123)")
                    .required("Please Enter Your Password "),
            })
        },
        onSubmit: (values) => {
            if (isEdit) {
                const data = {
                    userID: values.userID,
                    empCode: values.userID,
                    userName: values.userName,
                    userEmail: values.userEmail,
                    userDesignation: values.userDesignation,
                    userSection: values.userDepartment,
                    userDepartment: values.userDepartment,
                    userMobile: values.userMobile,
                    userNID: values.userNID,
                    userPhoto: null,
                    password: '',
                    empStatus: 1
                }

                // update user
                dispatch(updateUser(data));
                // validation.resetForm();
            } else {
                const newuser = {
                    userID: values.userID,
                    empCode: values.userID,
                    userName: values.userName,
                    userEmail: values.userEmail,
                    userDesignation: values.userDesignation,
                    userSection: values.userDepartment,
                    userDepartment: values.userDepartment,
                    userMobile: values.userMobile,
                    userNID: values.userNID,
                    userPhoto: null,
                    password: values.password,
                    empStatus: 1
                }
                // save new user
                dispatch(addUser(newuser));

            }
            // toggle();
            // reloadPage()
        },
    });



    return (
        <>
            <Modal isOpen={modal}
                toggle={() => {
                    setactiveTab('tab1')
                    toggle()
                }}
                size={user ? 'lg' : 'md'}
            >
                <ModalHeader tag="h4"
                    toggle={() => {
                        setactiveTab('tab1')
                        toggle()
                    }}
                >{title}</ModalHeader>

                <div className='p-3'>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={activeTab === 'tab1' ? 'active' : ''}
                                onClick={() => switchTab('tab1')}
                            >
                                User Information
                            </NavLink>
                        </NavItem>
                        {
                            user &&
                            <>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'tab2' ? 'active' : ''}
                                        onClick={() => switchTab('tab2')}
                                    >
                                        Profile Image
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'tab3' ? 'active' : ''}
                                        onClick={() => switchTab('tab3')}
                                    >
                                        Update User Role
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'tab4' ? 'active' : ''}
                                        onClick={() => switchTab('tab4')}
                                    >
                                        Update User Password
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'tab5' ? 'active' : ''}
                                        onClick={() => switchTab('tab5')}
                                    >
                                        Status Update
                                    </NavLink>
                                </NavItem>
                            </>
                        }
                    </Nav>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="tab1">
                            <ModalBody >
                                <Form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit()
                                        // return false;
                                    }}
                                >
                                    <Row>
                                        <Col className="col-12">
                                            <div className="mb-3">
                                                <Label className="form-label">
                                                    User ID
                                                    <span className='text-warning'>{isEdit ? ' (not editable)' : ""}</span>
                                                </Label>
                                                <Input
                                                    name="userID"
                                                    type="text"
                                                    placeholder="Insert user Id"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userID || ""}
                                                    readOnly={isEdit}
                                                    invalid={
                                                        validation.touched.userID &&
                                                            validation.errors.userID
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userID &&
                                                    validation.errors.userID ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userID}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Name</Label>
                                                <Input
                                                    name="userName"
                                                    type="text"
                                                    placeholder="user name"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userName || ""}
                                                    invalid={
                                                        validation.touched.userName &&
                                                            validation.errors.userName
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userName &&
                                                    validation.errors.userName ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userName}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">User Department</Label>
                                                <Input
                                                    name="userDepartment"
                                                    type="text"
                                                    placeholder="user department"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userDepartment || ""}
                                                    invalid={
                                                        validation.touched.userDepartment &&
                                                            validation.errors.userDepartment
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userDepartment &&
                                                    validation.errors.userDepartment ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userDepartment}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Designation</Label>
                                                <Input
                                                    name="userDesignation"
                                                    type="text"
                                                    placeholder="designation"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userDesignation || ""}
                                                    invalid={
                                                        validation.touched.userDesignation &&
                                                            validation.errors.userDesignation
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userDesignation &&
                                                    validation.errors.userDesignation ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userDesignation}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Email</Label>
                                                <Input
                                                    name="userEmail"
                                                    type="text"
                                                    placeholder="example@gmail.com"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userEmail || ""}
                                                    invalid={
                                                        validation.touched.userEmail &&
                                                            validation.errors.userEmail
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userEmail &&
                                                    validation.errors.userEmail ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userEmail}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Mobile Number</Label>
                                                <Input
                                                    name="userMobile"
                                                    type="text"
                                                    placeholder="01xxxxxxxxxx"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userMobile || ""}
                                                    invalid={
                                                        validation.touched.userMobile &&
                                                            validation.errors.userMobile
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userMobile &&
                                                    validation.errors.userMobile ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userMobile}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">User NID</Label>
                                                <Input
                                                    name="userNID"
                                                    type="text"
                                                    placeholder="NID"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.userNID || ""}
                                                    invalid={
                                                        validation.touched.userNID &&
                                                            validation.errors.userNID
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.userNID &&
                                                    validation.errors.userNID ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.userNID}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            {
                                                !user &&
                                                <div className="mb-3">
                                                    <Label className="form-label">Password</Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="password"
                                                        validate={{
                                                            required: { value: true },
                                                        }}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password || ""}
                                                        invalid={
                                                            validation.touched.password &&
                                                                validation.errors.password
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.password &&
                                                        validation.errors.password ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.password}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                            }

                                        </Col>
                                    </Row>
                                    {
                                        error &&
                                        <p className='text-danger'>{error}</p>
                                    }
                                    <Row>
                                        <Col>
                                            <div className="text-end">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success save-user"
                                                >
                                                    {
                                                        user ? 'Update User Information' : 'Add New User'
                                                    }
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                        </TabPane>
                        {
                            user &&
                            <>
                                <TabPane tabId="tab2">
                                    <Tab2 user={user} />
                                </TabPane>
                                <TabPane tabId="tab3">
                                    <Tab3 user={user} />
                                </TabPane>
                                <TabPane tabId="tab4">
                                    <UserPasswordTab user={user} />
                                </TabPane>
                                <TabPane tabId="tab5">
                                    <StatusUpdate user={user} />
                                </TabPane>
                            </>
                        }
                    </TabContent>
                </div>


                {/* modal body  */}

            </Modal>
        </>
    )
}

export default InputFieldModal