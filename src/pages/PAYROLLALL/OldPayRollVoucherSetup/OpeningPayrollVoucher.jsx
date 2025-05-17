import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Button, Card, CardBody, Container, Input, Table } from 'reactstrap'
import CustomItem from './CustomItem'
import ErrorModal from '../Common/ErrorModal'
import { Post } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import TableHeader from './TableHeader'
import CustomButton from '../../JournalVoucher/CustomButton'
import { authorization } from '../../../components/Common/Authorization'
import { CSVLink } from 'react-csv'
import _, { slice } from 'lodash';

const OpeningPayrollVoucher = () => {

    const [showModal, setShowModal] = useState(false)
    const [payrollOpeningData, setPayrollOpeningData] = useState(null)
    const [searchText, setSearchText] = useState('')

    const [error, setError] = useState(null)

    const toggle = () => setShowModal(!showModal)


    const debouncedSearch = useMemo(() => _.debounce((value) => {
        setSearchText(value);
    },), []);

    const onSearchTextHandler = (e) => {
        debouncedSearch(e);
    };

    // console.log('Search Text', searchText)

    const getOpenigData = async () => {
        try {
            const data = Post('/api/v1/Payroll/GetPayrollOpening')
                .then(res => setPayrollOpeningData(res.data.data?.reverse()))
        } catch (error) {

        }
    }

    const payRollTableHeader = payrollOpeningData && payrollOpeningData[0]?.paySetup


    const filteredData = useMemo(() => {
        if (!payrollOpeningData) return [];
        return payrollOpeningData.filter(data => {
            if (searchText === "") {
                return true;
            }
            return (
                data.employeeCode?.toLowerCase().includes(searchText.toLowerCase()) ||
                data.employeeName?.toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [payrollOpeningData, searchText]);


    const getError = (msg) => {
        setError(msg)
    }

    const handleDownlaodPyroll = () => {
        try {
            Post('/api/v1/Payroll/GetPayrollOpeningTable')
                .then(res => {
                    // console.log(res.data)
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                        // console.log(downloadLink)
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    }


    const uniqueForCodes = [...new Set(filteredData?.flatMap(employee => employee.paySetup.map(item => item.forCode)))];

    const formatDataForCSV = (data) => {
        return data?.map(employee => {
            const formattedEmployee = {
                employeeID: employee.employeeID,
                employeeCode: employee.employeeCode,
                employeeName: employee.employeeName,
                employeeDesignation: employee.employeeDesignation,
                employeeDepartment: employee.employeeDepartment,
                employeeTypeDet: employee.employeeTypeDet
            };
            uniqueForCodes.forEach(forCode => {
                const paySetupItem = employee.paySetup.find(item => item.forCode === forCode);
                formattedEmployee[forCode] = paySetupItem ? paySetupItem.amount : 0;
            });

            return formattedEmployee;
        });
    };

    const csvData = useMemo(() => formatDataForCSV(filteredData), [filteredData]);

    const calculateTotals = (data, keys) => {
        return data?.reduce((totals, item) => {
            keys?.forEach(key => {
                const value = parseFloat(item[key] || 0);
                totals[key] = (parseFloat(totals[key] || 0) + value).toFixed(2);
            });
            return totals
        }, {});
    };

    const keys = csvData?.length > 0 ? Object.keys(csvData[0]) : [];

    const totals = useMemo(() => calculateTotals(csvData, keys), [csvData, keys]);



    useEffect(() => {
        getOpenigData()
        authorization(104)
    }, [])


    return (
        <div className='page-content'>

            <Container fluid>
                <Breadcrumb title={' Setup '} breadcrumbItem={'Payroll Voucher Opening'} />

                {
                    payrollOpeningData && filteredData ?
                        <Card>
                            <CardBody>

                                <div className='pb-2 d-flex justify-content-start gap-2'>
                                    <CustomButton
                                        text={"Export All to Excel"}
                                        onClick={() => handleDownlaodPyroll()}
                                        color={'primary'}
                                    />

                                    <Button
                                        text={"Export Grid Data"}
                                        color={'success'}
                                        className='btn-rounded px-4'
                                    >
                                        {/* <i className="mdi mdi-plus me-1" /> */}
                                        <CSVLink
                                            filename="BSEC"
                                            data={csvData}
                                            className="text-white">
                                            Export Grid Data</CSVLink>
                                    </Button>

                                </div>

                                <div style={{ overflowX: 'auto', height: '70vh' }}>
                                    <Table className="table table-striped table-bordered w-100 " >
                                        <thead className="table-light " style={{ position: 'sticky', top: -1, zIndex: 1, background: 'white' }}>
                                            <tr>
                                                <th >EMP ID</th>
                                                <TableHeader
                                                    title={'Emp Code'}
                                                    onSearchTextHandler={onSearchTextHandler}
                                                    placeholder={payrollOpeningData.length}
                                                />
                                                <TableHeader
                                                    title={'Employee Name'}
                                                    onSearchTextHandler={onSearchTextHandler}
                                                    placeholder={payrollOpeningData.length}
                                                />
                                                <th>
                                                    Employee Type
                                                </th>
                                                <th>
                                                    Employee Designation
                                                </th>
                                                <th>
                                                    Employee Department
                                                </th>
                                                {
                                                    payRollTableHeader?.map((item, index) => (
                                                        <th style={{ minWidth: '150px' }} key={index}>{item?.forCode}</th>
                                                    ))
                                                }
                                                <th >Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData?.slice(0, 100).map((item, index) => (
                                                <tr key={index}>
                                                    <CustomItem
                                                        item={item}
                                                        handleModal={toggle}
                                                        getError={getError}
                                                    />
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className='fw-bold'>
                                                {keys.map((key, index) => (
                                                    index === 0 ? (
                                                        <td key={index} colSpan={6} className='text-center'>Total</td>
                                                    ) : index >= 6 ? (
                                                        <td key={index} className='text-end'>{totals[key]}</td>
                                                    ) : null
                                                ))}
                                            </tr>
                                        </tfoot>
                                    </Table>

                                </div>
                            </CardBody>
                        </Card> :
                        <CustomSpinner />
                }

            </Container>

            <ErrorModal
                test={error?.message}
                color={error?.color}
                show={showModal}
                handleModal={toggle}
            />
        </div >
    )
}

export default OpeningPayrollVoucher