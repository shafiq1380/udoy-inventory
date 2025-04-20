import React, { useEffect, useState } from 'react'
import Flatpickr from "react-flatpickr";

import Select from 'react-select'
import { Button, Col, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, } from 'reactstrap'
import { Post } from '../../../utils/https';

import { Spinner } from 'reactstrap'
const CGIManagementModal = ({ show, handleModal, allStoreList, allPartner, editByID, editData }) => {

    const [store, setStore] = useState([]);
    const [partner, setPartner] = useState([]);
    const [rentdate, setRentdate] = useState(new Date().toISOString());
    const [enddate, setEnddate] = useState(new Date().toISOString());
    const [status, setStatus] = useState(1);
    const [error, setError] = useState('')
    const [contactDetail, setContactDetail] = useState('')
    const [loading, setLoading] = useState(false)

    const userID = JSON.parse(localStorage.getItem('userID'))

    const handleCloseTheModal = () => {
        if (!loading) {
            handleModal()
            setError('')
        }
    }

    const getRentDatbyId = async (id) => {
        const data = { data: id };
        try {
            const response = await Post('/api/ChemicalGdown/GetRentByID', data);
            if (response.data.success === true) {
                setStore({
                    label: response.data.data.storeID + " : " + response.data.data.storeCode,
                    value: response.data.data.storeID
                });
                setPartner({
                    label: response.data.data.partnerID + " : " + response.data.data.partnerName,
                    value: response.data.data.partnerID
                });
                setContactDetail(response.data.data.contactDetail);
                setRentdate(response.data.data.contactStartDate);
                setEnddate(response.data.data.contactEndDate);
                setStatus(response.data.data.contactStatus);
            } else {
                setError(response.data.message)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const updateRentData = async (data) => {
        setLoading(true)
        try {
            const response = await Post('/api/ChemicalGdown/UpdateRentData', { data: data });
            if (response.data.success === true) {
                setLoading(false)
                handleCloseTheModal()
            } else {
                setLoading(false)
                setError(response.data.errorMessage)
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    const addRenttData = async (data) => {
        setLoading(true)
        try {
            const response = await Post('/api/ChemicalGdown/AddRentData', { data: data });
            if (response.data.success === true) {
                setLoading(false)
                handleCloseTheModal()
            } else {
                setLoading(false)
                setError(response.data.errorMessage)
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }


    const handleAddCGI = () => {
        const data = {
            id: editByID ? editByID : 0,
            storeID: store?.value,
            partnerID: partner?.value,
            contactStartDate: rentdate,
            contactEndDate: enddate,
            contactDetail: contactDetail,
            contactStatus: status,
            lastUpdateBy: userID,
        }

        if (editByID) {
            updateRentData(data)
        } else {
            addRenttData(data)
        }
    }


    useEffect(() => {
        if (editByID) {
            getRentDatbyId(editByID)
        } else {
            setStore({});
            setPartner({});
            setContactDetail();
            setRentdate(new Date().toISOString());
            setEnddate(new Date().toISOString());
            setStatus();
        }
    }, [editByID])

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#00CCFF ' : 'white',
            '&:hover': {
                backgroundColor: '#007CAB ',
                color: 'white',
            },
        }),
        menu: (provided) => ({
            ...provided,
            width: '95%',  // Match the control width if needed
        }),
    };



    return (
        <Modal isOpen={show} toggle={() => handleCloseTheModal()} top={true}>
            <ModalHeader toggle={() => {
                handleModal()
                setLoading(false)
            }}>{editByID ? "Update" : "Add"} Godown Rent Informatin</ModalHeader>
            <ModalBody className="px-4">
                <Row>
                    <Label>Select Store</Label>
                    <Select
                        onChange={(e) => setStore(e)}
                        options={allStoreList?.map((item) => {
                            return {
                                label: item.id + " : " + item.storeCode,
                                value: item.id
                            };
                        })}
                        placeholder="Select Store"
                        value={store}
                        styles={customStyles}
                    />
                </Row>

                <Row className={"mt-2"}>
                    <Label>Select Partner</Label>
                    <Select
                        onChange={(e) => setPartner(e)}
                        options={allPartner?.map((item) => {
                            return {
                                label: item.id + " : " + item.partnerName,
                                value: item.id
                            };
                        })}
                        placeholder="Select Partner"
                        value={partner}
                        styles={customStyles}
                    />
                </Row>

                <Row>
                    <Col>
                        <Label className="mt-3">Contact Details</Label>
                        <InputGroup>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Details"
                                value={contactDetail ? contactDetail : ""}
                                onChange={(e) => setContactDetail(e.target.value)}
                            // maxLength={11}
                            />
                        </InputGroup>
                    </Col>
                </Row>

                {
                    editByID &&
                    <Row>
                        <Label className="mt-3">Status</Label>
                        <InputGroup>
                            <select className="form-select p-2" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </InputGroup>
                    </Row>
                }

                <Row className={"mt-3"}>
                    <Col md={6}>
                        <Label>Rent Start Date</Label>
                        <InputGroup size='md'>
                            <Flatpickr
                                className="form-control"
                                placeholder="dd/mm/YYYY"
                                options={{
                                    altInput: true,
                                    altFormat: "d/m/Y",
                                    allowInput: true
                                }}
                                id="date"
                                name="date"
                                onChange={(selectedDates, dateStr) => setRentdate(dateStr)}
                                onClose={(selectedDates, dateStr) => setRentdate(dateStr)}
                                onReady={(selectedDates, dateStr, instance) => {
                                    const inputElement = instance.altInput;
                                    if (inputElement) {
                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                    }
                                }}
                                value={rentdate}
                            />
                        </InputGroup>
                    </Col>

                    <Col md={6}>
                        <Label>Rent End Date</Label>
                        <InputGroup size='md'>
                            <Flatpickr
                                className="form-control"
                                placeholder="dd/mm/YYYY"
                                options={{
                                    altInput: true,
                                    altFormat: "d/m/Y",
                                    allowInput: true
                                }}
                                id="date"
                                name="date"
                                onChange={(selectedDates, dateStr) => setEnddate(dateStr)}
                                onClose={(selectedDates, dateStr) => setEnddate(dateStr)}
                                onReady={(selectedDates, dateStr, instance) => {
                                    const inputElement = instance.altInput;
                                    if (inputElement) {
                                        inputElement.addEventListener('focus', (e) => e.target.select());
                                    }
                                }}
                                value={enddate}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {error && <p className="text-danger fs-5 mt-2">{error}</p>}
            </ModalBody>
            <ModalFooter>
                {/* <div className="text-start"> */}
                <Button
                    type="button"
                    color="success"
                    className='px-5'
                    onClick={handleAddCGI}
                    disabled={loading}
                >
                    {/* {editByID ? "Update CGI" : "Add CGI"} */}
                    {loading ? <Spinner color="light" size="sm" /> : editByID ? "Update CGI" : "Add CGI"}
                </Button>
                {/* </div> */}
            </ModalFooter>
        </Modal >
    )
}

export default CGIManagementModal