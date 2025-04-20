export const processData = (data) => {
    if (data) {
        let result = [];

        // Group data by 'forID'
        let groupedData = data.reduce((acc, item) => {
            if (!acc[item.forID]) {
                acc[item.forID] = [];
            }
            acc[item.forID].push(item);
            return acc;
        }, {});

        // Iterate through each group
        for (let id in groupedData) {
            let group = groupedData[id];
            let payrollEntry = {
                id: parseInt(id),
                forType: group[0]?.forType, // Set forType from the first item in the group
                forCode: group[0]?.forCode, // Set forCode from the first item in the group
                empTypes: []
            };

            // Group by 'empTypeID'
            let groupedByEmpType = group.reduce((acc, item) => {
                if (!acc[item.empTypeID]) {
                    acc[item.empTypeID] = [];
                }
                acc[item.empTypeID].push(item);
                return acc;
            }, {});

            // Iterate through each empTypeID group
            for (let empTypeID in groupedByEmpType) {
                let empTypeGroup = groupedByEmpType[empTypeID];
                let empTypeEntry = {
                    empType: empTypeGroup[0].employeeTypes,
                    expTypes: []
                };

                // Create expType entries
                empTypeGroup.forEach(expType => {
                    let expTypeEntry = {
                        expType: expType.employeeExpType,
                        coaCode: expType.coaCode,
                        analCode1: expType.analCode1,
                        analCode2: expType.analCode2,
                        analCode3: expType.analCode3
                    };
                    empTypeEntry.expTypes.push(expTypeEntry);
                });

                payrollEntry.empTypes.push(empTypeEntry);
            }

            result.push(payrollEntry);
        }

        return result;
    }
}




// export const processData = (data) => {
//     // console.log(data)

//     const result = [];

//     data?.forEach(item => {
//         let existingItem = result?.find(r => r.id === item.forID && r.type === item.forType && r.code === item.forCode);

//         if (!existingItem) {
//             existingItem = {
//                 id: item.forID,
//                 type: item.forType,
//                 code: item.forCode,
//                 empTypes: [],
//                 expTypes: [],
//                 forID: item.forID,
//                 empTypeID: item.empTypeID,
//                 expTypeID: item.expTypeID,
//                 coaID: item.coaID,
//                 coaCode: item.coaCode,
//                 analCode1: item.analCode1,
//                 analCode2: item.analCode2,
//                 analCode3: item.analCode3
//             };
//             result.push(existingItem);
//         }

//         if (!existingItem.empTypes.some(e => e.empType === item.employeeTypes)) {
//             existingItem.empTypes.push({
//                 empType: item.employeeTypes,
//                 coaCode: item.coaCode,
//                 analCode1: item.analCode1,
//                 analCode2: item.analCode2,
//                 analCode3: item.analCode3
//             });
//         }

//         if (!existingItem.expTypes.includes(item.employeeExpType)) {
//             existingItem.expTypes.push(item.employeeExpType);
//         }
//     });

//     return result;
//     // console.log(result)
// };



// export const processData = (data) => {
//     const result = [];

//     data?.forEach(item => {
//         let existingItem = result?.find(r => r.id === item.forID && r.type === item.forType && r.code === item.forCode);

//         if (!existingItem) {
//             existingItem = {
//                 id: item.forID,
//                 type: item.forType,
//                 code: item.forCode,
//                 empTypes: [],
//                 expTypes: [], // Initialize expTypes array
//                 forID: item.forID,
//                 empTypeID: item.empTypeID,
//                 expTypeID: item.expTypeID,
//                 coaID: item.coaID,
//                 coaCode: item.coaCode,
//                 analCode1: item.analCode1,
//                 analCode2: item.analCode2,
//                 analCode3: item.analCode3
//             };
//             result.push(existingItem);
//         }

//         // Check if empType exists, similar logic for expTypes
//         if (!existingItem.empTypes.some(e => e.empType === item.employeeTypes)) {
//             existingItem.empTypes.push({
//                 empType: item.employeeTypes,
//                 coaCode: item.coaCode,
//                 analCode1: item.analCode1,
//                 analCode2: item.analCode2,
//                 analCode3: item.analCode3
//             });
//         }

//         // Check if expType exists in expTypes array
//         if (!existingItem.expTypes.some(e => e.expType === item.employeeExpType)) {
//             existingItem.expTypes.push({
//                 expType: item.employeeExpType,
//                 coaCode: item.coaCode,
//                 analCode1: item.analCode1,
//                 analCode2: item.analCode2,
//                 analCode3: item.analCode3
//             });
//         }
//     });

//     return result;
// };







