import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Label, Row } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import Select from 'react-select'
import RadioButton from '../../../components/Common/RadioButton'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllItemList } from '../../../store/InventoryItemList/actions'
import { Post } from '../../../utils/https'
import moment from 'moment'
import { authorization } from '../../../components/Common/Authorization'

const ItemStockDetail = ({ data }) => {
    // console.log("data", data)
    if (!data || !data.data || !data.data.data || data.data.data.length === 0) {
        return (
            <Card>
                <CardBody>
                    <h1 className='text-center fw-bold text-danger'>No Stock Found</h1>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardBody>
                <h1></h1>
                <div>
                    <CardHeader className="py-1 text-center">
                        <h4 style={{ backgroundColor: 'lightGray', padding: '3px', borderRadius: '5px' }}>Item Stock Details</h4>
                    </CardHeader>
                    <table className="table table-striped table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Group Name</th>
                                <th>Sub Group Name</th>
                                <th>Category Name</th>
                                <th>Item Code</th>
                                <th>Item Desc</th>
                                <th>UOM</th>
                                <th>Store</th>
                                <th className='text-end'>Total Qty</th>
                                <th className='text-end'>Avg Rate</th>
                                <th className='text-end'>Total Value</th>
                                <th className='col-3'>Serial List</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.data.data.map((item, index) => {

                                    const avg = item.totVal / item.totQty

                                    return (
                                        <tr key={index}>
                                            <td>{item.itemID}</td>
                                            <td>{item.groupName}</td>
                                            <td>{item.subGroupName}</td>
                                            <td>{item.categoryName}</td>
                                            <td>{item.itemCode}</td>
                                            <td>{item.itemDesc}</td>
                                            <td>{item.uom}</td>
                                            <td>{item.storeCode}</td>
                                            <td className='text-end'>{item.totQty}</td>
                                            <td className='text-end'>{avg.toFixed(2)}</td>
                                            <td className='text-end'>{item.totVal.toFixed(2)}</td>
                                            <td>
                                                {
                                                    item.serialList !== null && <textarea
                                                        className="form-control"
                                                        rows="4"
                                                        value={item.serialList}
                                                        disabled
                                                    ></textarea>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={8} className='text-end'>Total</th>
                                <th className='text-end'>
                                    {data && data.data.data.reduce((total, item) => total + item.totQty, 0)}
                                </th>
                                <th className='text-end'>
                                    {data && (data.data.data.reduce((total, item) => total + item.totVal, 0) / data.data.data.reduce((total, item) => total + item.totQty, 0)).toFixed(2)}
                                </th>
                                <th className='text-end'>
                                    {data && data.data.data.reduce((total, item) => total + item.totVal, 0).toFixed(2)}
                                </th>

                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardBody>
        </Card>
    )
}

const SerialStockTrace = ({ data }) => {
    // console.log("data", data)

    if (!data || !data.data || !data.data.data || data.data.data.length === 0) {
        return (
            <Card>
                <CardBody>
                    <h1 className='text-center fw-bold text-danger'>No Item Found</h1>
                </CardBody>
            </Card>
        )
    }
    return (
        <Card>
            <CardBody>
                <CardHeader className="py-1 text-center">
                    <h4 style={{ backgroundColor: 'lightGray', padding: '3px', borderRadius: '5px' }}>Item Serial Trace</h4>
                </CardHeader>
                <table className="table table-striped table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>Trn ID</th>
                            <th>Trn Ref No</th>
                            <th>Trn Date</th>
                            <th>Trn Desc</th>
                            <th>Item Code</th>
                            <th>Item Desc</th>
                            <th>UOM</th>
                            <th>Store</th>
                            <th>Item Serial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.data.data.map((item, index) => {

                                return (
                                    <tr key={index}>
                                        <td>{item.trnHdrID}</td>
                                        <td>{item.trnRefNo}</td>
                                        <td>{moment(item.trnDate).format('DD/MM/YYYY')}</td>
                                        <td>{item.trnDesc}</td>
                                        <td>{item.itemCode}</td>
                                        <td>{item.itemDesc}</td>
                                        <td>{item.uom}</td>
                                        <td>{item.storeCode}</td>
                                        <td>{item.itemSerial}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </CardBody>
        </Card>
    )
}

const InventorySerialReport = () => {
    const dispatch = useDispatch()

    const { allItemList } = useSelector(state => state.AllItemList)
    const [selectedOption, setSelectedOption] = useState(1)
    const [selectedItem, setSelectedItem] = useState(null)
    const [serialValue, setSerialValue] = useState('')
    const [showComponents, setShowComponents] = useState(false)
    const [getItemStockDetail, setGetItemStockDetail] = useState([])
    const [getSerialStockTrace, setGetSerialStockTrace] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSelection = useCallback((e) => {
        setSelectedItem(null);
        setSerialValue('');
        setShowComponents(false);
        setGetItemStockDetail([]);
        setGetSerialStockTrace([]);

        setSelectedOption(parseInt(e.target.value));
    }, []);


    const options = useMemo(() => {
        return allItemList.map((item) => {
            return {
                label: item.itemCode + " : " + item.itemDesc,
                value: item.id
            };
        })
    }, [allItemList])

    useEffect(() => {
        dispatch(fetchAllItemList())
    }, [dispatch])

    useEffect(() => {
        setSelectedItem(null)
        setSerialValue('')
    }, [selectedOption])

    const getItemStockDetails = useCallback(async () => {
        setLoading(true)
        const data = {
            data: selectedItem?.value
        }

        try {
            const res = await Post('/api/v1/InvTransaction/GetItemStockDetail', data)
            // console.log("res", res)
            setGetItemStockDetail(res)
            setShowComponents(true)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [selectedItem])

    const getSerialStockTraces = useCallback(async () => {
        setLoading(true)
        const data = {
            data: serialValue.trim('')
        }

        try {
            const res = await Post('/api/v1/InvTransaction/GetItemSerialTrace', data)
            // console.log("res", res)
            setGetSerialStockTrace(res)
            setShowComponents(true)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [serialValue])

    const clear = useCallback(() => {
        setSelectedItem(null)
        setSerialValue('')
        setShowComponents(false)
        setGetItemStockDetail([])
        setGetSerialStockTrace([])
    }, [])


    useEffect(() => {
        authorization(91)
    }, [])


    return (
        <div className="page-content">
            <Breadcrumb title="Report" breadcrumbItem="Serial Item Report" />
            <Container fluid>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={8} sm={12}>
                                <Row row className='align-items-center'>
                                    <Col md={3}>
                                        <Label size='lg'>Select Search Type</Label>
                                    </Col>
                                    <Col md={7}>
                                        <RadioButton
                                            value={1}
                                            name='selectOption'
                                            selectedOption={selectedOption}
                                            handleOptionChange={handleSelection}
                                            label={'Search By Item'}
                                        />
                                        <RadioButton
                                            value={2}
                                            name='selectOption'
                                            selectedOption={selectedOption}
                                            handleOptionChange={handleSelection}
                                            label={'Search By Serial'}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {
                            selectedOption === 1 ?
                                <Row className='mt-3'>
                                    <Col md={8} sm={12}>
                                        <Row row className='align-items-center'>
                                            <Col md={3}>
                                                <Label size='lg'>Item List</Label>
                                            </Col>
                                            <Col md={7}>
                                                <Select
                                                    options={options}
                                                    placeholder="Select an Item"
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    onChange={(e) => setSelectedItem(e)}
                                                    value={selectedItem}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                :
                                selectedOption === 2 ?
                                    <Row className='mt-3'>
                                        <Col md={8} sm={12}>
                                            <Row row className='align-items-center'>
                                                <Col md={3}>
                                                    <Label size='lg'>Serial Number</Label>
                                                </Col>
                                                <Col md={7}>
                                                    <Input
                                                        type="text"
                                                        name="serial"
                                                        id="serial"
                                                        value={serialValue}
                                                        onChange={(e) => setSerialValue(e.target.value)}
                                                        placeholder="Enter Serial Number"
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    : null
                        }
                        <Row>
                            <Col md={7} sm={12} className='text-end mt-2'>
                                <div>
                                    <Button
                                        type="button"
                                        color="success"
                                        className="btn-rounded  mb-2 me-4 px-4 text-end"
                                        onClick={selectedOption === 1 ? getItemStockDetails : selectedOption === 2 ? getSerialStockTraces : null}
                                        disabled={selectedOption === 1 ? selectedItem === null : selectedOption === 2 ? serialValue.trim() === '' : loading}
                                    >
                                        {loading ? 'Loading...' : 'Show Report'}
                                    </Button>
                                    <Button
                                        type="button"
                                        color="danger"
                                        className="btn-rounded  mb-2 me-4 px-4 text-end"
                                        onClick={clear}
                                        disabled={loading}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <>
                    {showComponents && (
                        <>
                            {selectedOption === 1 && getItemStockDetail && <ItemStockDetail data={getItemStockDetail} />}
                            {selectedOption === 2 && getSerialStockTrace && <SerialStockTrace data={getSerialStockTrace} />}
                        </>
                    )}
                </>
            </Container>
        </div>
    )
}

export default InventorySerialReport