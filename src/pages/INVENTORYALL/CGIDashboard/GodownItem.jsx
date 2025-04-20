import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap'
import GDAlertModal from './GDAlertModal'
import { useNavigate } from 'react-router-dom'
import './style.css'

const GodownItem = ({ item }) => {

    const [modal, setModal] = React.useState(false)

    const { id, storeCode, contactStatus, partnerName, contactEndDate } = item

    const navigation = useNavigate()

    const handleModalShown = (e) => {
        setModal(!modal)
    }

    const handleToNaviagate = (e) => {
        // e.stopPropagation();
        navigation(`/godown/${id}`)
    }

    return (
        <div className="col-md-2">
            {/* <Link to={`/godown/${id}`} className="col-md-3"> */}
            <div
                className={`${contactStatus ? "activecard" : "inactive"} mb-md-2 shadow-lg main-card`}
                onClick={handleToNaviagate}
            >
                <div className="card-content text-white">
                    <div className='d-flex justify-content-between'>
                        <h5 className="fs-4 fw-bold ">{storeCode ? storeCode : 'N/A'}</h5>
                        <div>
                            <FaEdit
                                id="edittooltip"
                                size={20}
                                className="text-white cursor-pointer iconHover"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent Link click
                                    navigation('/cgi-management')   // Trigger modal
                                }}
                            />
                        </div>
                    </div>

                    <div className='mt-2 main-balance d-flex align-items-center' style={{ cursor: 'pointer' }}>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();  // Prevent Link click
                                navigation('/item-ledger-report')  // Trigger modal
                            }}
                            className='link-text'
                        >
                            <h5 className="balance-title">Main Balance</h5>
                            <h2 className="balance-amount">
                                <span>&#2547;</span> Null</h2>
                        </div>
                        <div className='ms-auto text-end '>
                            <p className='p-0 m-0 link-text'
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent Link click
                                    navigation('/item-current-stock-report')  // Trigger modal
                                }}>
                                current Stock
                            </p>
                            <p className='  link-text' style={{ margin: '5px 0px' }}
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent Link click
                                    navigation('/item-ledger-report')  // Trigger modal
                                }}
                            >
                                Ledger
                            </p>
                            <p className='p-0 m-0 link-text'
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent Link click
                                    navigation('/cgi-management')    // Trigger modal
                                }}>
                                History
                            </p>
                        </div>
                    </div>


                    {/* <div className="card-details d-flex justify-content-between mt-3">
                        <div className="chip d-flex align-items-center">
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>

                    </div> */}

                    <div className="card-footer  mt-2 row">
                        <div className="valid-thru col-md-4">
                            <span>VALID</span>
                            <p>{contactEndDate?.split('T')[0].split('-').reverse().join('/')}</p>
                        </div>
                        <div className="col-md-8 text-end ms-auto ">
                            <span>Godown Holder</span>
                            <p>{partnerName}</p>
                        </div>
                    </div>
                </div>

            </div>
            {/* </Link> */}

            <GDAlertModal
                show={modal}
                handleModal={handleModalShown}
                id={id}
            />
        </div >
    )
}

export default GodownItem