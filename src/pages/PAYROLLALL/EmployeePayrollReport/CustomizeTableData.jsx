import React, { useEffect, useState } from 'react'
import { Post } from '../../../utils/https'
import { Col, Row } from 'reactstrap'
import CustomButton from '../../JournalVoucher/CustomButton'

const CustomizeTableData = ({
    tableDataShow,
    checkedForCIds,
    checkedForDIds,
    setcheckedForCIds,
    setcheckedForDIds,
    handleForCcheckboxChange,
    handleForDcheckboxChange,
    selectAllForC,
    selectAllForD,
    handleCTextClick,
    handleDTextClick,
    forTypeC,
    forTypeD
}) => {


    return (
        <div className='h-full' >
            <Row>
                <Col md={6}>
                    <div className='d-flex align-items-center py-1' style={{ cursor: 'pointer' }}>
                        <input
                            type='checkbox'
                            className='me-2'
                            checked={checkedForCIds.length === forTypeC.length}
                            onChange={() => selectAllForC()}
                        />
                        <p
                            className='m-0 text-center cursor-pointer text-primary'
                            onClick={() => selectAllForC()}
                        >
                            Select All Addition
                        </p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className='d-flex align-items-center py-1' style={{ cursor: 'pointer' }}>
                        <input
                            type='checkbox'
                            className='me-2'
                            checked={checkedForDIds.length === forTypeD.length}
                            onChange={() => selectAllForD()}
                        />
                        <p
                            className='m-0 text-center cursor-pointer text-danger'
                            onClick={() => selectAllForD()}
                        >
                            Select All Deduction
                        </p>
                    </div>
                </Col>
            </Row>


            <Row style={{ overflow: 'scroll', height: '300px', }}
                className='custom-scrollbar shadow-sm p-3  bg-body-tertiary rounded'
            >
                <Col md={6}>
                    {
                        forTypeC.map(item => (
                            <div key={item.id} className='d-flex align-items-center py-1' style={{ cursor: 'pointer' }}>
                                <input
                                    type='checkbox'
                                    className='me-2'
                                    checked={checkedForCIds.includes(item.id)}
                                    onChange={() => handleForCcheckboxChange(item.id)}
                                />
                                <p
                                    className='m-0 text-center cursor-pointer'
                                    onClick={() => handleCTextClick(item.id)}
                                >
                                    {item?.forCode}
                                </p>
                            </div>
                        ))}
                </Col>
                <Col md={6}>
                    {forTypeD.map(item => (
                        <div key={item.id} className='d-flex align-items-center py-1' style={{ cursor: 'pointer' }}>
                            <input
                                type='checkbox'
                                className='me-2'
                                checked={checkedForDIds.includes(item.id)}
                                onChange={() => handleForDcheckboxChange(item.id)}
                            />
                            <p
                                className='m-0 text-center cursor-pointer'
                                onClick={() => handleDTextClick(item.id)}
                            >
                                {item?.forCode}
                            </p>
                        </div>
                    ))}
                </Col>
            </Row>

            <Row>
                <Col>
                    <div style={{ cursor: 'pointer' }} className='w-full bg-danger p-1 text-center text-white' onClick={tableDataShow}>
                        Hide
                    </div>

                </Col>
            </Row>
            {/* <CustomButton
                        onClick={tableDataShow}
                        text={'Hide Table Data'}
                        color={'info'}
                    /> */}
        </div>
    )
}

export default CustomizeTableData