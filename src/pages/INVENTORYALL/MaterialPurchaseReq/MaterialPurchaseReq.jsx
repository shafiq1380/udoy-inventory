import React, { useState } from 'react'
import PurchasesScreen from '../component/PurchasesScreen'
import { Container } from 'reactstrap';

import Breadcrumbs from "../../../components/Common/Breadcrumb";

const MaterialPurchaseReq = () => {

    //fake data start
    const units = ["kg", "meter", "tons", "liter"];
    const arrayList = [];

    for (let i = 1; i <= 50; i++) {
        const newItem = {
            "id": 10000 + i,
            "productCode": `P${i.toString().padStart(2, '0')}`,
            "itemName": `Product ${i}`,
            "quantity": Math.floor(Math.random() * 100) + 1,
            "unit": units[i % units.length], // Cycle through the unique units
            "price": Math.floor(Math.random() * 50) + 1,
            "currentStock": Math.floor(Math.random() * 500) + 1,
        };

        arrayList.push(newItem);
    };

    const storeCodes = [
        { value: 'Store 1', label: 'Store 1' },
        { value: 'Store 2', label: 'Store 2' },
        { value: 'Store 3', label: 'Store 3' },
        { value: 'Store 4', label: 'Store 4' },
        { value: 'Store 5', label: 'Store 5' },
    ]

    // fake data edn


    //table Header
    const tableHeader = [
        {
            id: 1,
            title: "Item Code and Name",
            col: 'col-4'

        },
        {
            id: 2,
            title: "Unit",
            col: 'col-1'

        },
        {
            id: 7,
            title: "Store Name",
            col: 'col-2'

        },
        {
            id: 3,
            title: " Current Stock",
            col: 'col-2'

        },
        {
            id: 4,
            title: "Quantity",
            col: 'col-1'

        },

        {
            id: 5,
            title: "Rate",
            col: 'col-1'

        },
        {
            id: 6,
            title: "Total Price",
            col: 'col-1'

        },

    ];


    //initialRow
    const initialRow = {
        itemName: '',
        unit: '',
        storeCode: '',
        currentStock: '',
        quantity: '',
        rate: '',
        totalPrice: '',
    };

    // intial State
    const [rows, setRows] = useState([initialRow]);


    //Handle Added row
    const addNewRow = () => {
        setRows([...rows, initialRow]);
    }

    //handleRemove The Row
    const handleRemoveRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    }

    //handleChange the Input Value
    const handleChangeTheItemValue = (event, index) => {
        const { value, name } = event.target;
        if ((value.match(/\./g) || []).length > 1) {
            return;
        }
        const numericValue = value.replace(/[^0-9.]/g, '');
        const updatedRows = [...rows];
        updatedRows[index][name] = numericValue;
        updatedRows[index]['totalPrice'] = (updatedRows[index].quantity * updatedRows[index].rate).toFixed(2)
        setRows(updatedRows);
    }


    //handleChangeTheSelection
    const handleChangeItemName = (event, index, store) => {
        const updatedRows = [...rows];
        if (store === 'store') {
            const selectName = storeCodes.find((item) => item.value === event.value);
            if (selectName) {
                updatedRows[index].storeCode = selectName.label;
                setRows(updatedRows);
            }
        } else {
            const selectName = arrayList.find((item) => item.id === event.value);
            if (selectName) {
                updatedRows[index].itemName = selectName.itemName;
                updatedRows[index].id = selectName.id;
                updatedRows[index].unit = selectName.unit;
                updatedRows[index].currentStock = selectName.currentStock;
                setRows(updatedRows);
            }
        }
    }


    // useEffect(() => {
    //     authorization(14)
    // }, [])

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs title="Material Purchase Requisition"
                        breadcrumbItem="Material Purchase Requisition / Purchase Requisition"
                    />

                    {/* <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center">{title}</h3>
                        </CardHeader>
                    </CardBody>
                </Card> */}

                    <PurchasesScreen
                        arrayList={arrayList}
                        initialRow={initialRow}
                        rows={rows}
                        addNewRow={addNewRow}
                        handleRemoveRow={handleRemoveRow}
                        handleChangeTheItemValue={handleChangeTheItemValue}
                        handleChangeItemName={handleChangeItemName}
                        title='MATERIAL PURCHASE'
                        tableHeader={tableHeader}
                        storeCodes={storeCodes}
                        input1={'quantity'}
                        input2={'rate'}
                    />
                </Container >
            </div>
        </ >
    )
}

export default MaterialPurchaseReq