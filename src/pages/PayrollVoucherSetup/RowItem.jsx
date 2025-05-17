// import React, { useState, useEffect } from 'react';
// import { Button, Input, Spinner } from 'reactstrap';
// import { Post } from '../../utils/https';

// const RowItem = ({ row, rowIndex, handleModal, getError }) => {
//     // Initialize state
//     const [data, setData] = useState([]);
//     const [disabled, setDisabled] = useState(true);
//     const [loading, setLoading] = useState(false);

//     // Set initial state when row changes
//     useEffect(() => {
//         const initialState = row.empTypes.flatMap((empType, empIndex) =>
//             row.expTypes.map((expType, expIndex) => ({
//                 forID: row.forID,
//                 empTypeID: empIndex + 1,
//                 expTypeID: expIndex + 1,
//                 coaID: row.coaID,
//                 coaCode: expType.coaCode,
//                 analCode1: expType.analCode1,
//                 analCode2: expType.analCode2,
//                 analCode3: expType.analCode3
//             }))
//         );
//         setData(initialState);
//         setDisabled(true);
//     }, [row]);

//     // console.log("Data", data[0])
//     // console.log(row)

//     // Handle input change
//     const handleDataChange = (e, empIndex, expIndex) => {
//         const { name, value } = e.target;
//         setData(prevData => {
//             const newData = [...prevData];
//             newData[empIndex * row.expTypes.length + expIndex] = {
//                 ...newData[empIndex * row.expTypes.length + expIndex],
//                 [name]: value
//             };
//             return newData;
//         });
//         setDisabled(false);
//         // console.log(data)
//     };

//     // Handle form submission
//     const handleSubmit = async () => {
//         console.log(data)
//         setLoading(true);
//         try {
//             await Post('/api/v1/Payroll/UpdateSalaryVoucherSetup', { data: data })
//                 .then(res => {
//                     if (res.data.success === true) {
//                         setLoading(false);
//                         getError("Update Successful");
//                         handleModal()
//                     } else {
//                         // console.log(res)
//                         setLoading(false);
//                         getError(res.data.errorMessage);
//                         handleModal()
//                     }

//                 });
//         } catch (error) {
//             setLoading(false);
//             getError("An error occurred");
//         }
//     };

//     // console.log(row[1]?.coaCode)

//     return (
//         <>
//             {/* Render table rows */}
//             {row.empTypes.map((empType, empIndex) => (
//                 row.expTypes.map((expType, expIndex) => (
//                     <tr key={`${rowIndex}-${empIndex}-${expIndex}`}>
//                         {/* Render cells for table */}
//                         {empIndex === 0 && expIndex === 0 && (
//                             <>
//                                 <td rowSpan={row.empTypes.length * row.expTypes.length}>{row.id}</td>
//                                 <td rowSpan={row.empTypes.length * row.expTypes.length}>{row.type}</td>
//                                 <td rowSpan={row.empTypes.length * row.expTypes.length}>{row.code}</td>
//                             </>
//                         )}
//                         {expIndex === 0 && (
//                             <td rowSpan={row.expTypes.length}>{empType?.empType}</td>
//                         )}
//                         <td>{expType?.expType}</td>
//                         <td>
//                             <Input
//                                 className='p-1 '
//                                 type="text"
//                                 name="coaCode"
//                                 value={data[empIndex * row.expTypes.length + expIndex]?.coaCode || ''}
//                                 onChange={(e) => handleDataChange(e, empIndex, expIndex)}
//                             />
//                         </td>
//                         <td>
//                             <Input
//                                 className='p-1 '
//                                 type="text"
//                                 name="analCode1"
//                                 value={data[empIndex * row.expTypes.length + expIndex]?.analCode1 || ''}
//                                 onChange={(e) => handleDataChange(e, empIndex, expIndex)}
//                             />
//                         </td>
//                         <td>
//                             <Input
//                                 className='p-1 m-1'
//                                 type="text"
//                                 name="analCode2"
//                                 value={data[empIndex * row.expTypes.length + expIndex]?.analCode2 || ''}
//                                 onChange={(e) => handleDataChange(e, empIndex, expIndex)}
//                             />
//                         </td>
//                         <td>
//                             <Input
//                                 className='p-1 m-1'
//                                 type="text"
//                                 name="analCode3"
//                                 value={data[empIndex * row.expTypes.length + expIndex]?.analCode3 || ''}
//                                 onChange={(e) => handleDataChange(e, empIndex, expIndex)}
//                             />
//                         </td>
//                         {empIndex === 0 && expIndex === 0 && (
//                             <td rowSpan={row.empTypes.length * row.expTypes.length}>
//                                 {/* Render button or loading spinner */}
//                                 {loading ? (
//                                     <div className="d-flex justify-content-center align-items-center">
//                                         <Spinner color="success" />
//                                     </div>
//                                 ) : (
//                                     <Button
//                                         color="success"
//                                         className={'ms-4'}
//                                         disabled={disabled}
//                                         onClick={handleSubmit}
//                                     >
//                                         Update
//                                     </Button>
//                                 )}
//                             </td>
//                         )}
//                     </tr>
//                 ))
//             ))}
//         </>
//         // <></>
//     );
// };

// export default RowItem;



// import React, { useState, useEffect } from 'react';
// import { Button, Input, Spinner } from 'reactstrap';
// import { Post } from '../../utils/https';

// const RowItem = ({ row, rowIndex, handleModal, getError }) => {
//     // Initialize state
//     const [data, setData] = useState([]);
//     const [disabled, setDisabled] = useState(true);
//     const [loading, setLoading] = useState(false);

//     // Set initial state when row changes
//     useEffect(() => {
//         const flattenedData = row.empTypes.flatMap((empType, empIndex) =>
//             empType.expTypes.map((expType, expIndex) => ({
//                 //               {  
//                 //                 forID: row.id,
//                 //                 forType: row.forType,
//                 //                 forCode: row.forCode,
//                 //                 empType: empType.empType,
//                 //                 expType: expType.expType,
//                 //                 coaCode: expType.coaCode,
//                 //                 analCode1: expType.analCode1,
//                 //                 analCode2: expType.analCode2,
//                 //                 analCode3: expType.analCode3
//                 // }
//                 forID: row.id,
//                 empTypeID: empIndex + 1,
//                 expTypeID: expIndex + 1,
//                 coaID: row.coaID,
//                 coaCode: expType.coaCode,
//                 analCode1: expType.analCode1,
//                 analCode2: expType.analCode2,
//                 analCode3: expType.analCode3,
//                 empType: empType.empType,
//                 expType: expType.expType,
//                 forType: row.forType,
//                 forCode: row.forCode,
//                 empType: empType.empType,
//             }))
//         );
//         setData(flattenedData);
//     }, [row]);


//     // console.log(row)

//     // Handle input change
//     const handleDataChange = (e, dataIndex) => {
//         setDisabled(false);
//         const { name, value } = e.target;
//         setData(prevData => {
//             const newData = [...prevData];
//             newData[dataIndex] = {
//                 ...newData[dataIndex],
//                 [name]: value
//             };
//             return newData;
//         });
//     };

//     // Handle form submission
//     const handleSubmit = async () => {
//         // console.log(data)
//         setLoading(true);
//         try {
//             const res = await Post('/api/v1/Payroll/UpdateSalaryVoucherSetup', { data });
//             if (res.data.success === true) {
//                 setLoading(false);
//                 getError("Update Successful");
//                 handleModal();
//             } else {
//                 setLoading(false);
//                 getError(res.data.errorMessage);
//                 handleModal();
//             }
//         } catch (error) {
//             setLoading(false);
//             getError("An error occurred");
//         }
//     };

//     // console.log(row)

//     return (
//         <>
//             {data.map((item, index) => (
//                 <tr key={`${rowIndex}-${index}`}>
//                     {index === 0 && (
//                         <>
//                             <td rowSpan={data.length}>{row.id}</td>
//                             <td rowSpan={data.length}>{item.forType}</td>
//                             <td rowSpan={data.length}>{item.forCode}</td>
//                         </>
//                     )}
//                     <td rowSpan=''>{item.empType}</td>
//                     <td rowSpan=''>{item.expType}</td>
//                     <td>
//                         <Input
//                             className='p-1 '
//                             type="text"
//                             name="coaCode"
//                             value={item.coaCode}
//                             onChange={(e) => handleDataChange(e, index)}
//                         />
//                     </td>
//                     <td>
//                         <Input
//                             className='p-1 '
//                             type="text"
//                             name="analCode1"
//                             value={item.analCode1}
//                             onChange={(e) => handleDataChange(e, index)}
//                         />
//                     </td>
//                     <td>
//                         <Input
//                             className='p-1 m-1'
//                             type="text"
//                             name="analCode2"
//                             value={item.analCode2}
//                             onChange={(e) => handleDataChange(e, index)}
//                         />
//                     </td>
//                     <td>
//                         <Input
//                             className='p-1 m-1'
//                             type="text"
//                             name="analCode3"
//                             value={item.analCode3}
//                             onChange={(e) => handleDataChange(e, index)}
//                         />
//                     </td>
//                     {index === 0 && (
//                         <td rowSpan={data.length}>
//                             {loading ? (
//                                 <div className="d-flex justify-content-center align-items-center">
//                                     <Spinner color="success" />
//                                 </div>
//                             ) : (
//                                 <Button
//                                     color="success"
//                                     className={'ms-4'}
//                                     disabled={disabled}
//                                     onClick={handleSubmit}
//                                 >
//                                     Update
//                                 </Button>
//                             )}
//                         </td>
//                     )}
//                 </tr>
//             ))}
//         </>
//     );
// };

// export default RowItem;



import React, { useState, useEffect } from 'react';
import { Button, Input, Spinner } from 'reactstrap';
import { Post } from '../../utils/https';

const RowItem = ({ row, rowIndex, handleModal, getError }) => {
    // Initialize state
    const [data, setData] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    // Set initial state when row changes
    useEffect(() => {
        const initialState = row.empTypes.flatMap((empType, empIndex) =>
            empType.expTypes.map((expType, expIndex) => ({
                forID: row.id,
                empTypeID: empIndex + 1,
                expTypeID: expIndex + 1,
                empType: empType.empType,
                expType: expType.expType,
                coaID: row.coaID,
                coaCode: expType.coaCode,
                analCode1: expType.analCode1,
                analCode2: expType.analCode2,
                analCode3: expType.analCode3,
                empTypeLength: empType.expTypes.length // Add the length of expTypes for each empType
            }))
        );
        setData(initialState);
        setDisabled(true);
    }, [row]);

    // console.log(row)

    // Handle input change
    const handleDataChange = (e, index) => {
        const { name, value } = e.target;
        setData(prevData => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [name]: value
            };
            return newData;
        });
        setDisabled(false);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // console.log(data)
        setLoading(true);
        try {
            const res = await Post('/api/v1/Payroll/UpdateSalaryVoucherSetup', { data: data });
            if (res.data.success === true) {
                setLoading(false);
                getError({ message: "Updated Successful", color: 'success' });
                handleModal();
            } else {
                setLoading(false);
                getError({ message: res.data.errorMessage, color: 'danger' });
                handleModal();
            }
        } catch (error) {
            setLoading(false);
            getError("An error occurred");
        }
    };

    // Calculate the number of rows each empType should span
    let empTypeRowSpan = {};
    let currentEmpType = '';
    let rowIndexOffset = 0;

    data.forEach((item, index) => {
        if (currentEmpType !== item.empType) {
            currentEmpType = item.empType;
            empTypeRowSpan[currentEmpType] = item.empTypeLength;
            rowIndexOffset = 0;
        }
        rowIndexOffset++;
        if (rowIndexOffset === item.empTypeLength) {
            currentEmpType = '';
        }
    });

    return (
        <>
            {/* Render table rows */}
            {data.map((item, index) => (
                <tr key={`${rowIndex}-${index}`}>
                    {index === 0 && (
                        <>
                            <td rowSpan={data.length}>{row.id}</td>
                            <td rowSpan={data.length} className='text-center'>{row.forType}</td>
                            <td rowSpan={data.length}  >{row.forCode}</td>
                        </>
                    )}
                    {(index === 0 || data[index - 1].empType !== item.empType) && (
                        <td rowSpan={empTypeRowSpan[item.empType]}>{item.empType}</td>
                    )}
                    <td>{item.expType}</td>
                    <td>
                        <Input
                            className='p-1'
                            type="text"
                            name="coaCode"
                            value={item.coaCode}
                            onChange={(e) => handleDataChange(e, index)}
                        />
                    </td>
                    <td>
                        <Input
                            className='p-1'
                            type="text"
                            name="analCode1"
                            value={item.analCode1}
                            onChange={(e) => handleDataChange(e, index)}
                        />
                    </td>
                    <td>
                        <Input
                            className='p-1 m-1'
                            type="text"
                            name="analCode2"
                            value={item.analCode2}
                            onChange={(e) => handleDataChange(e, index)}
                        />
                    </td>
                    <td>
                        <Input
                            className='p-1 m-1'
                            type="text"
                            name="analCode3"
                            value={item.analCode3}
                            onChange={(e) => handleDataChange(e, index)}
                        />
                    </td>
                    {index === 0 && (
                        <td rowSpan={data.length}>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Spinner color="success" />
                                </div>
                            ) : (
                                <Button
                                    color="success"
                                    className={'ms-4'}
                                    disabled={disabled}
                                    onClick={handleSubmit}
                                >
                                    Update
                                </Button>
                            )}
                        </td>
                    )}
                </tr>
            ))}
        </>
    );
};

export default RowItem;

