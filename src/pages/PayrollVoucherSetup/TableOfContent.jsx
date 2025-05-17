import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Input, Table } from 'reactstrap'
import RowItem from './RowItem'
import { Post } from '../../utils/https'
import { processData } from './ProcessData';
import ErrorModal from '../PAYROLLALL/Common/ErrorModal';
import { authorization } from '../../components/Common/Authorization';
import CustomSpinner from '../../components/Common/CustomSpinner';
import SalaryClearning from './SalaryClearning';

const TableOfContent = () => {

    const [text, setText] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [payRollVoucherData, setpayRollVoucherData] = useState([])
    const [processedData, setprocessedData] = useState([])

    const fetchVoucherData = async () => {
        try {
            const data = Post('/api/v1/Payroll/GetSalaryVoucherSetup')
                .then(res => {
                    // setVoucherData((res.data.data))
                    if (res.data.data) {
                        setpayRollVoucherData(res?.data?.data)
                        const processedData = processData(res?.data?.data.slice(1));
                        // console.log("Fom", processedData)
                        // console.log(res.data.data)
                        setprocessedData(processedData)
                    }
                })
        } catch (error) {
        }
    }

    // console.log('Data', processedData)

    const handleModal = () => {
        setShowModal(!showModal)
    }
    const getError = (error) => {
        setText(error)
    }

    useEffect(() => {
        fetchVoucherData()
    }, [])



    return (
        <>

            <SalaryClearning
                handleModal={handleModal}
                getError={getError}
                data={payRollVoucherData[0]}
            />

            {
                processedData.length > 0 ? <Card>
                    <CardBody>
                        <div style={{ overflowX: 'auto' }}>
                            <Table className="table table-striped table-sm" width="100%" >
                                <table className="w-100">
                                    <thead >
                                        <tr>
                                            <th >ID</th>
                                            <th className='p-2'>TYPE</th>
                                            <th style={{ width: '100px' }} >CODE</th>
                                            <th className='p-2'> EMP TYPE</th>
                                            <th >EXP Type</th>
                                            <th className='px-4 px-sm-4 px-md-0'>COA</th>
                                            <th className='px-4 px-sm-4 px-md-0'>ANAL1</th>
                                            <th className='px-4 px-sm-4 px-md-0'>ANAL2</th>
                                            <th className='px-4 px-sm-4 px-md-0'>ANAL3</th>
                                            <th className='px-4 px-sm-4 px-md-0'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processedData?.map((row, rowIndex) => (
                                            <RowItem
                                                row={row}
                                                rowIndex={rowIndex}
                                                // handleChange={handleChange}
                                                handleModal={handleModal}
                                                getError={getError}
                                                key={rowIndex}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </Table>
                        </div>
                    </CardBody>

                </Card > : <CustomSpinner />
            }
            <ErrorModal
                show={showModal}
                handleModal={handleModal}
                test={text?.message}
                color={text?.color}
            />
        </>
    )
}

export default TableOfContent