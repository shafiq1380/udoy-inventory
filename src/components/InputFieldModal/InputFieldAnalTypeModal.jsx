import React, { useState } from 'react'
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
import { addAnalType, updateAnalType } from '../../store/analysis-type-setup/actions';

const InputFieldAnalTypeModal = ({ modal, onCloseClick, title, anal, isEdit, reloadPage }) => {

    const [activeTab, setactiveTab] = useState('tab1')

    const dispatch = useDispatch()

    const switchTab = (tab) => {
        setactiveTab(tab)
    }

    const { userID } = useSelector(state => state.Login.userInformation)

    const { error } = useSelector(state => state.analtypeReducer);

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            id: (anal && anal.id) || "",
            analysisTypeName: (anal && anal.analysisTypeName) || "",
            rStatus: anal?.rStatus,
        },
        validationSchema: () => {
            if (isEdit) {
                return Yup.object({
                    id: Yup.string()
                        .matches(/^[0-9]+$/, "Please Enter Id")
                        .required("Please Enter Your  Id"),
                    analysisTypeName: Yup.string().required("Please Enter Analysis Name"),

                })
            }
            return Yup.object({

                analysisTypeName: Yup.string().required("Please Enter Analysis Name"),

            })
        },
        onSubmit: (values) => {
            if (isEdit) {
                const data = {
                    id: values.id,
                    analysisTypeName: values.analysisTypeName,
                    rStatus: values.rStatus,
                    LastUpdateUserID: userID
                }

                // update anal
                dispatch(updateAnalType(data));
                // validation.resetForm();
            } else {
                const newanal = {
                    //  id: values.id,
                    analysisTypeName: values.analysisTypeName,
                    // rStatus: 1,
                    EntryUserID: userID
                }
                // save new user
                dispatch(addAnalType(newanal));
                // validation.resetForm();
            }
            //toggle();
            // reloadPage()

        },


    });


    return (
        <>
            <Modal isOpen={modal} toggle={() => onCloseClick()}>
                <ModalHeader tag="h4" toggle={() => onCloseClick()}>{title}</ModalHeader>

                <div className='p-3'>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={activeTab === 'tab1' ? 'active' : ''}
                                onClick={() => switchTab('tab1')}
                            >
                                Analysis Information
                            </NavLink>
                        </NavItem>

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
                                            <div className="mb-3" >
                                                <Label className="form-label"
                                                    hidden={!isEdit}
                                                >
                                                    ID
                                                    <span className='text-warning'>{isEdit ? ' (not editable)' : ""}</span>
                                                </Label>
                                                <Input
                                                    name="id"
                                                    type="text"
                                                    placeholder="Analysis ID"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.id || ""}
                                                    readOnly={isEdit}
                                                    hidden={!isEdit}
                                                    invalid={
                                                        validation.touched.id &&
                                                            validation.errors.id
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.id &&
                                                    validation.errors.id ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.id}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Analysis Name</Label>
                                                <Input
                                                    name="analysisTypeName"
                                                    type="text"
                                                    placeholder="Analysis Name"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.analysisTypeName || ""}
                                                    invalid={
                                                        validation.touched.analysisTypeName &&
                                                            validation.errors.analysisTypeName
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.analysisTypeName &&
                                                    validation.errors.analysisTypeName ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.analysisTypeName}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="control-label" hidden={!isEdit}   >Active Status</Label>
                                                <select
                                                    name="rStatus"
                                                    type="number"
                                                    hidden={!isEdit}
                                                    className="form-control select2"
                                                    value={validation.values.rStatus}
                                                    onChange={validation.handleChange}
                                                >
                                                    <option value={1}>Active</option>
                                                    <option value={0}>Inactive</option>
                                                </select>
                                            </div>
                                        </Col>
                                    </Row>
                                    {
                                        error &&
                                        <Row>
                                            <Col>
                                                <p className='text-danger'>{error}</p>
                                            </Col>
                                        </Row>
                                    }
                                    <Row>
                                        <Col>
                                            <div className="text-end">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success save-user"
                                                >
                                                    {
                                                        anal ? 'Update' : 'Add New Analysis'
                                                    }
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                        </TabPane>

                    </TabContent>
                </div>




            </Modal>
        </>
    )
}

export default InputFieldAnalTypeModal