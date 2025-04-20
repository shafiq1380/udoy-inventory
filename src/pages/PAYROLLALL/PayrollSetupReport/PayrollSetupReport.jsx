import React, { useEffect, useMemo, useState } from 'react'
import { Post } from '../../../utils/https'
import { Card, CardBody, Spinner } from 'reactstrap'
import DynamicTable from './DynamicTable'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import { authorization } from '../../../components/Common/Authorization'

import TestPdf from './TestPdf'
import { TableFromSkeleton, TableSkeleton } from '../../../components/Common/Skeleton'

const PayrollSetupReport = () => {

    const [data, setData] = useState()

    const getData = () => {
        try {
            Post('/api/Payroll/GetAllEmployeePaySetupTable')
                .then(res => setData(res.data))
        } catch (error) {

        }
    }
    //remove the sepcial character from data 
    const sanitizeKey = (key) => key.replace(/[^\w\s]/gi, '');
    const sanitizedData = data?.map((item) => {
        const sanitizedItem = {};
        for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
                const sanitizedKey = sanitizeKey(key);
                sanitizedItem[sanitizedKey] = item[key];
            }
        }
        return sanitizedItem;
    });


    //separate accessors from data
    const accessors = Array.from(
        new Set(sanitizedData?.flatMap(item => Object?.keys(item)))
    );

    //separate headers from data
    const headers = Array.from(
        new Set(data?.flatMap(item => Object?.keys(item)))
    );

    const columns = useMemo(() => {
        return accessors.map((accessor, index) => ({
            Header: headers[index], // Use the corresponding header
            accessor: accessor,
        }));
    }, [accessors, headers]);

    //column key make unique 
    const uniqueColumns = columns.map((column, index) => ({
        ...column,
        id: `column-${index}`,
    }));



    useEffect(() => {
        getData()
    }, [])


    const handleDownload = () => {
        try {
            Post('/api/Payroll/GetAllEmployeePaySetupDetail')
                .then(res => {
                    console.log(res.data)
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                        console.log(downloadLink)
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };

    //Authorization check
    useEffect(() => {
        authorization(75)
    }, [])

    return (
        <div className='page-content '>
            {/* <TestPdf /> */}
            {
                data?.length > 0 ?
                    <Card>
                        <CardBody>
                            <DynamicTable
                                columns={uniqueColumns}
                                data={sanitizedData}
                                customPageSize={100}
                                excelDownload={handleDownload}
                                exbtn
                            />
                        </CardBody>
                    </Card>
                    :
                    // <CustomSpinner />
                    <TableFromSkeleton />

            }
        </div>
    )
}

export default PayrollSetupReport