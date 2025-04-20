import React, { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col } from 'reactstrap';
import Select from 'react-select'
import PrchScenContent from './PrchScenContent';
import { ToWords } from 'to-words';


const PurchasesScreen = ({
    arrayList, rows, addNewRow,
    handleRemoveRow, handleChangeTheItemValue,
    handleChangeItemName, title, tableHeader,
    storeCodes, input1, input2
}) => {

    const [tranDate, setTranDate] = useState(new Date().toISOString().split("T")[0].split('-').reverse().join('/'));
    const [deptSelect, setDeptSelect] = useState();
    const [reasonSelect, setReasonSelect] = useState();

    // style for react select
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
            backgroundColor: state.isSelected ? 'blue' : 'white',
        }),
    };

    //convert number to words
    const toWords = new ToWords({
        localeCode: 'en-BD',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: { // can be used to override defaults for the selected locale
                name: 'Taka',
                plural: 'Taka',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paisa',
                    symbol: '',
                },
            }
        }
    });

    const totalPrice = rows?.reduce((acc, row) => acc + Number(row.totalPrice), 0);
    const totalInWord = toWords.convert(totalPrice)

    const handleSubmit = () => {
        alert(`Working On it ${reasonSelect} ${tranDate}`)
    }


    return (
        <>
            <PrchScenContent
                tranDate={tranDate}
                setTranDate={setTranDate}
                deptSelect={deptSelect}
                setDeptSelect={setDeptSelect}
                reasonSelect={reasonSelect}
                setReasonSelect={setReasonSelect}
            />

            <Card>
                <CardBody>
                    <Row className='mb-3'>
                        <div className="table-responsive-sm">
                            <table className="table table-striped table-bordered table-sm" width="100%">
                                <thead>
                                    <tr>
                                        <th style={{ width: "10px" }}>S/N</th>
                                        {
                                            tableHeader.map((item, index) =>
                                                // console.log(item)
                                                <th key={index} className={`${item.col} ${item.title === 'Rate' ? 'text-center' : ''}`}>
                                                    {item.title}
                                                </th>
                                            )
                                        }
                                        <th style={{ width: '30px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rows.map((row, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>
                                                        <Select
                                                            styles={customStyles}
                                                            onChange={(event) => handleChangeItemName(event, index)}
                                                            options={arrayList.map((item) => {
                                                                return {
                                                                    label: item.productCode + " : " + item.itemName,
                                                                    value: item.id
                                                                };
                                                            })}
                                                            value={{
                                                                label: row.itemName,
                                                                value: row.id
                                                            }}
                                                            autoFocus
                                                            placeholder="Select Item Name"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name='unit'
                                                            className="form-control"
                                                            placeholder="Unit"
                                                            // onChange={(event) => handleChangeTheItemValue(event, index)}
                                                            value={row.unit}
                                                            readOnly
                                                        />
                                                    </td>
                                                    {
                                                        storeCodes && <td>
                                                            <Select
                                                                styles={customStyles}
                                                                onChange={(event) => handleChangeItemName(event, index, 'store')}
                                                                options={storeCodes}
                                                                value={{
                                                                    label: row.storeCode,
                                                                }}
                                                            />
                                                        </td>
                                                    }
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name='currentStock'
                                                            className="form-control"
                                                            placeholder="Current Stock"
                                                            // onChange={(event) => handleChange(event, index, 'currentStock')}
                                                            value={row.currentStock}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            // name='quantity'
                                                            name={input1}
                                                            className="form-control text-end"
                                                            placeholder="Quantity"
                                                            onChange={(event) => handleChangeTheItemValue(event, index, 'quantity')}
                                                            value={row.quantity}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            // name='rate'
                                                            name={input2}
                                                            className="form-control text-end"
                                                            placeholder="Rate"
                                                            onChange={(event) => handleChangeTheItemValue(event, index)}
                                                            value={row.rate}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name='totalPrice'
                                                            className="form-control text-end"
                                                            placeholder="Total "
                                                            value={row?.totalPrice}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-danger"
                                                            onClick={() => handleRemoveRow(index)}
                                                        >
                                                            -
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>

                                <tfoot className='bg-light'>
                                    <tr>
                                        <td colSpan="1" />
                                        <td colSpan="3" className=" fw-bold">
                                            Total: {""}
                                            {totalInWord}
                                        </td>
                                        <td colSpan="1" />
                                        <td colSpan="3" className=" fw-bold text-end">
                                            Total: {""}
                                            {totalPrice}
                                        </td>
                                        <td colSpan="1">  </td>
                                    </tr>
                                </tfoot>
                            </table>

                            <Col className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={addNewRow}
                                >
                                    +
                                </button>
                            </Col>
                        </div>
                    </Row>
                    <Row style={{ zIndex: -10 }}>
                        <Col className="text-center" >
                            <button
                                type="button"
                                className="btn btn-primary btn-lg fw-bold"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </Col>
                    </Row>

                </CardBody>
            </Card>

        </>
    )
}

export default PurchasesScreen