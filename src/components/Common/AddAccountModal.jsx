/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { Button, Col, Label, Modal, ModalBody, Row, CardTitle, Input, FormGroup, ModalHeader } from "reactstrap"
import { useDispatch, useSelector } from "react-redux";
import { addCoaAccount, updateCoaAccount } from "../../store/coa-setup/actions";
import Select from 'react-select';


const AddAccountModal = ({ show, onCloseClick, menuData, isEditable }) => {

    const [updateData, setUpdateData] = useState(menuData)
    const [options, setOptions] = useState()
    const [selectedOption, setSelectedOption] = useState();

    const [required, setRequired] = useState(false)


    const { userID } = useSelector(state => state.Login.userInformation)
    const { dataUpdateLoading, error, success, coaAnalysis } = useSelector(state => state.coaSetupReducer);
    const dispatch = useDispatch()

    const [newData, setNewData] = useState({
        id: updateData.id,
        parentId: updateData.coaID,
        coaCode: '',
        coaName: '',
        accountType: 'L',
        analysisRequired: 'N',
        analysisList: [],
        status: 1,
        userCode: userID
    })

    //handle checkbox data 
    const handleCheckBoxChange = (event) => {
        setRequired(!required)
        const isChecked = event.target.checked;
        if (!isChecked) {
            setSelectedOption([]);
        }
        const updatedData = {
            ...newData,
            analysisRequired: isChecked ? "Y" : "N",
        };
        setNewData(updatedData);
    };



    const handleInput = (e) => {
        const { name, value } = e.target
        setNewData({ ...newData, [name]: value })
    }

    //selected Option selected value format
    const selectValue = selectedOption?.map(item => item.value)

    const handleAddedData = () => {
        const updateData = { ...newData, analysisList: selectValue || [] }
        const data = { data: updateData }
        dispatch(addCoaAccount(data))
    }

    const handleUpdate = () => {
        const updateData = { ...newData, analysisList: selectValue || [] }
        const data = { data: updateData }
        dispatch(updateCoaAccount(data))
    }



    //select state and format data for select state
    // console.log(selectValue)
    const handleSelectChange = (e) => {
        setSelectedOption(e)
    }


    const optionss = () => {
        const data = coaAnalysis?.map(item => {
            return {
                value: item.id,
                label: item.analysisTypeName
            }
        })
        setOptions(data)
    }


    useEffect(() => {
        if (isEditable) {
            if (updateData.analysisRequire === 'Y') {
                setRequired(true)
            }
            const getanalysisList = updateData.analysisList;
            const filteredObjects = options.filter((obj) => getanalysisList?.includes(obj.value)).sort((a, b) => getanalysisList.indexOf(a.value) - getanalysisList.indexOf(b.value));
            setSelectedOption(filteredObjects)

            setNewData({
                id: updateData.id,
                coaCode: updateData.coaCode,
                coaName: updateData.coaName,
                accountType: menuData.cashBank,
                analysisRequired: updateData.analysisRequire,
                status: updateData.status || 1,
                userCode: userID,
                analysisList: updateData.analysisList
            })
        }

        optionss()
    }, [isEditable])



    //this style for the select option
    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: 'white', // Change this to the desired background color
        }),
    };


    return (
        <Modal isOpen={show} toggle={() => onCloseClick()} >
            <div className="modal-content">
                <ModalHeader>
                    <CardTitle tag="h1" >Add COA Account</CardTitle>
                    <button type="button" onClick={() => onCloseClick('update')}
                        className="btn-close position-absolute end-0 top-0 m-2">
                    </button>
                </ModalHeader>
                <ModalBody className="px-4 ">
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    COA code
                                </Label>
                                <Input
                                    name='coaCode'
                                    type="number"
                                    placeholder='Enter COA Code'
                                    onChange={handleInput}
                                    onBlur={handleInput}
                                    value={newData.coaCode}
                                />
                            </div>
                        </Col>

                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    COA Account Name
                                </Label>
                                <Input
                                    name='coaName'
                                    type="text"
                                    placeholder='Enter COA Account Name'
                                    onChange={handleInput}
                                    onBlur={handleInput}
                                    defaultValue={newData.coaName}
                                />
                            </div>
                        </Col>

                        {
                            isEditable && <Col className="col-12 mb-3">
                                <Label className="activeStatus">
                                    Active Status
                                </Label>
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    id='activeStatus'
                                    name="status"
                                    onChange={handleInput}
                                    value={newData.status}
                                >
                                    <option value={'1'}>Active</option>
                                    <option value={'0'}>Inactive</option>
                                </select>
                            </Col>
                        }

                        <Col className="col-12 mb-3">
                            <Label className="accountType">
                                Account Type
                            </Label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id='accountType'
                                name="accountType"
                                onChange={handleInput}
                                value={`${newData.accountType}`}
                            >
                                <option value={'L'}>Ledger</option>
                                <option value={'C'}>Cash Account</option>
                                <option value={'B'}>Bank Account</option>
                                <option value={'P'}>Partner Account</option>
                            </select>
                        </Col>

                        <Col className="">
                            <Label check className="d-flex  align-items-center pb-3">
                                <Input
                                    className="p-3 me-2"
                                    type="checkbox"
                                    name="analysisRequired"
                                    checked={required}
                                    onChange={handleCheckBoxChange}
                                />
                                <span className="">Analysis Required</span>
                            </Label>
                        </Col>
                        {
                            required &&
                            <Col className="col-12 mb-3">
                                <Select
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    options={options}
                                    isMulti
                                    styles={customStyles}
                                />
                            </Col>
                        }
                    </Row>


                    {
                        error &&
                        <p className="text-danger ">{error}</p>
                    }

                    {
                        isEditable ?
                            <div className="text-right">
                                <Button
                                    type="button"
                                    color="success"
                                    className="mb-2 me-2  px-3 "
                                    onClick={handleUpdate}
                                    disabled={dataUpdateLoading}
                                >
                                    {dataUpdateLoading ? 'Loading...' : 'Update'}
                                </Button>
                            </div>
                            :
                            <div className="text-right">
                                <Button
                                    type="button"
                                    color="success"
                                    className="mb-2 me-2  px-3 "
                                    onClick={handleAddedData}

                                    disabled={
                                        !newData.coaCode ||
                                        !newData.coaName ||
                                        dataUpdateLoading
                                    }
                                >
                                    {dataUpdateLoading ? 'Loading...' : 'Add Account'}
                                </Button>
                            </div>
                    }
                </ModalBody>
            </div>

        </Modal >
    )
}

export default AddAccountModal