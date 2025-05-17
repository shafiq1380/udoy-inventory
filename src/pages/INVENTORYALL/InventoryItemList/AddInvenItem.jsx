import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Label, Row, Spinner } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import InvenItemInputField from './InvenItemInputField'
import CheckBox from '../component/CheckBox'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllGroup, fetchCategory, fetchSubGroup, fetchUom } from '../../../store/InventoryItemList/actions'
import ReactSelectItem from '../component/ReactSelectItem'
import { useNavigate, useParams } from 'react-router-dom'
import { Post, fileUploadURL } from '../../../utils/https'
import ItemModal from './ItemModal'
import { authorization } from '../../../components/Common/Authorization'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import { flushSync } from 'react-dom'


const AddInvenItem = () => {

    const [invenData, setInvenData] = useState({
        groupID: 0,
        subGroupID: 0,
        catID: 0,
        itemCode: "",
        itemDesc: "",
        itemDisplayName: "",
        itemSpecificationDetail: "",
        isSerial: 0,
        uomID: 0,
        uom: "",
        secUomID: 0,
        secUom: "",
        convRatio: 0,
        coaCode: "",
        minStk: 0,
        maxStk: 0,
        reorderStk: 0,
        stdInvVal: 0,
        stdSalVal: 0,
        location: "",
        itmStatus: 1
    })

    const [checked, setChecked] = useState()

    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState('')
    const [submitionError, setSubmissionError] = useState('')
    const [loading, setLoading] = useState(false)
    const [updateDataLoading, setUpdateDataLoading] = useState(false)

    const { itemGroupList, itemSubGroupList, itemCategoryList, allItemUom } = useSelector(state => state.AllItemList)

    const { id } = useParams()

    const dispatch = useDispatch()
    const navigation = useNavigate()

    //select the default selection value
    const [selectVelue, setSelectValue] = useState()
    // const handleSelectedItem = (event, name) => {
    //     if (name === 'subGroupID') {
    //         setSelectValue(event);
    //         flushSync(() => {
    //             setInvenData({ ...invenData, [name]: event.id })
    //         })
    //         // getMaxId(event.id);

    //     } else if (name === 'uom') {
    //         setInvenData({ ...invenData, ['uom']: event.label, ['uomID']: event.value })
    //     } else if (name === 'secondUom') {
    //         setInvenData({ ...invenData, ['secUom']: event.label, ['secUomID']: event.value })
    //     } else {
    //         setInvenData({ ...invenData, [name]: event.value })
    //     }
    // }

    const handleSelectedItem = (event, name) => {
        if (!event) {
            // Handle the case where the selected item is cleared
            if (name === 'secondUom') {
                // Clear both secUom, secUomID, and convRatio when secondUom is cleared
                setInvenData({
                    ...invenData,
                    ['secUom']: '',
                    ['secUomID']: '',
                    ['convRatio']: '' // Clear the conversion ratio as well
                });
            } else if (name === 'uom') {
                setInvenData({
                    ...invenData,
                    ['uom']: '',
                    ['uomID']: ''
                });
            } else {
                setInvenData({
                    ...invenData,
                    [name]: ''
                });
            }
            return;
        }

        // Handle valid selection
        if (name === 'subGroupID') {
            setSelectValue(event);
            flushSync(() => {
                setInvenData({ ...invenData, [name]: event.id });
            });
        } else if (name === 'uom') {
            setInvenData({
                ...invenData,
                ['uom']: event.label,
                ['uomID']: event.value
            });
        } else if (name === 'secondUom') {
            setInvenData({
                ...invenData,
                ['secUom']: event.label,
                ['secUomID']: event.value
            });
        } else {
            setInvenData({
                ...invenData,
                [name]: event.value
            });
        }
    };


    // handle Modal 
    const handlModal = () => {
        setShowModal(!showModal)
        setSubmissionError('')
    }


    //change the text field value
    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setInvenData({ ...invenData, [name]: value })
    }

    //change the number field value
    const handleChangeInputToNumber = (e) => {
        const { name, value } = e.target
        if ((value.match(/\./g) || []).length > 1) {
            return;
        }
        const numericValue = value.replace(/[^0-9.]/g, '');
        setInvenData({ ...invenData, [name]: numericValue })
    }


    //change the checkbox value
    const handleCheckBox = (e) => {
        const { checked } = e.target
        setInvenData({ ...invenData, ['isSerial']: checked ? 1 : 0 })
    }


    // all options make here
    const groupOption = itemGroupList?.map((item) => ({
        label: item.groupCode + " : " + item.groupName,
        value: item.groupCode,
        id: item.id
    }))


    const subGroupOption = itemSubGroupList?.map((item) => ({
        label: item.subGroupCode + " : " + item.subGroupName,
        value: item.subGroupCode,
        id: item.id
    }))
    const category = itemCategoryList?.map((item) => ({
        label: item.id + " : " + item.categoryName,
        value: item.id
    }))
    const uomItem = allItemUom?.map((item) => ({
        label: item.uomCode,
        value: item.id
    }))


    //submit the inventory Data
    const padWithZero = (value) => {
        return value?.toString().length === 1 ? `0${value}` : value;
    };



    const handleSubmit = async () => {
        setLoading(true)
        const itemCode = `${invenData.groupID}.${selectVelue.value}.${invenData.itemCode}`;
        const newUpdateData = { ...invenData, ['itemCode']: itemCode }

        const response = await Post('/api/v1/Product/InsertItem', { data: newUpdateData })
            .then(res => {
                if (res.data.success === true) {
                    setLoading(false)
                    navigation('/inventory-list')
                } else {
                    setLoading(false)
                    setSubmissionError(res.data.errorMessage)
                    // handlModal()
                    setShowModal(true)
                }
            })

        // console.log(newUpdateData)

    }

    // console.log('test', submitionError)

    const handleUpdate = async () => {

        setLoading(true)

        const itemCode =
            `${padWithZero(invenData.groupID)}.${padWithZero(selectVelue?.value)}.${invenData.itemCode}`;
        const newUpdateData = {
            ...invenData,
            ['itemCode']: itemCode,
            ['subGroupID']: selectVelue?.id,

            // if secUom has data then send it, other ways send 0
            ['secUom']: invenData.secUom ? invenData.secUom : '',
            ['secUomID']: invenData.secUomID ? invenData.secUomID : 0,
            ['convRatio']: invenData.convRatio ? invenData.convRatio : 0
        }

        const response = await Post('/api/v1/Product/UpdateItem', { data: newUpdateData })
            .then(res => {
                if (res.data.success === true) {
                    setLoading(false)
                    navigation('/inventory-list')
                } else {
                    // console.log(res.data.errorMessage)
                    setLoading(false)
                    setSubmissionError(res.data.errorMessage)
                    setShowModal(true)
                }
            })
    }


    // added Attached Ment 
    const handleAttachment = (id) => {
        const popupWidth = 900; // Set your desired width
        const popupHeight = 500; // Set your desired height
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 4;
        const url = `${fileUploadURL}catId=4&id=${id}`;
        window.open(
            url,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`
        );
    };

    useEffect(() => {
        dispatch(fetchAllGroup())
        dispatch(fetchCategory())
        dispatch(fetchUom())
    }, [])

    // get the max id for the item 


    const getMaxId = async () => {
        if (invenData?.subGroupID) {
            try {
                const res = await Post('/api/v1/Product/GetNewCodeByID', { data: invenData.subGroupID });
                // console.log(res.data)
                setInvenData(prevData => ({
                    ...prevData,
                    itemCode: res.data.data?.slice(-3)
                }));
                // console.log('API', res.data.data);
            } catch (error) {
                console.error('Error fetching new code:', error);
            }
        }
    }


    useEffect(() => {
        if (!id) {
            getMaxId()
        }
    }, [invenData.subGroupID])


    useEffect(() => {
        setSelectValue('')
        if (!id) {
            setInvenData({ ...invenData, ['itemCode']: '', ['subGroupID']: '' })
        }
        dispatch(fetchSubGroup(invenData.groupID))
    }, [invenData.groupID])



    useEffect(() => {
        if (id) {
            setUpdateDataLoading(true)
            const response = Post('/api/v1/Product/GetItemByID', { data: id }).then((res) => {
                // console.log('Success', res.data.data)

                if (res?.data?.success === true) {

                    const editableItem = res?.data?.data

                    setChecked(editableItem?.isSerial === 1 ? true : false)

                    setInvenData({
                        id: editableItem?.id,
                        groupID: editableItem?.groupID,
                        subGroupID: editableItem?.subGroupID,
                        catID: editableItem?.catID,
                        itemCode: editableItem?.itemCode,
                        itemDesc: editableItem?.itemDesc,
                        itemDisplayName: editableItem?.itemDisplayName,
                        itemSpecificationDetail: editableItem?.itemSpecificationDetail,
                        isSerial: editableItem?.isSerial,
                        uomID: editableItem?.uomID,
                        uom: editableItem?.uom,
                        secUomID: editableItem?.secUomID,
                        secUom: editableItem?.secUom,
                        convRatio: editableItem?.convRatio,
                        coaCode: editableItem?.coaCode,
                        minStk: editableItem?.minStk,
                        maxStk: editableItem?.maxStk,
                        reorderStk: editableItem?.reorderStk,
                        stdInvVal: editableItem?.stdInvVal,
                        stdSalVal: editableItem?.stdSalVal,
                        location: editableItem?.location,
                        itmStatus: editableItem?.itmStatus,
                        addField1: editableItem?.addField1,
                        addField2: editableItem?.addField2,
                        addField3: editableItem?.addField3,
                        itmOldCode: editableItem?.itmOldCode

                    })

                    setUpdateDataLoading(false)

                } else {
                    setUpdateDataLoading(false)
                    setError(res.data.errorMessage)
                }


            })
        }

    }, [id])




    useEffect(() => {

        // console.log('Before', invenData.subGroupID)
        if (id) {
            setSelectValue(subGroupOption.find((option) => option.id === invenData?.subGroupID))
            setInvenData({
                ...invenData,
                // ['itemCode']: invenData?.itemCode?.length > 9 ?
                //     invenData?.itemCode.toString().slice(-5) : invenData?.itemCode.toString().slice(-3)
                ['itemCode']: invenData?.itemCode?.length > 10 ?
                    invenData?.itemCode.toString().slice(-5) :
                    invenData?.itemCode?.length === 10 ?
                        invenData?.itemCode.toString().slice(-4) :
                        invenData?.itemCode.toString().slice(-3)
            })
        }
    }, [itemSubGroupList])


    //authorization
    useEffect(() => {
        authorization(60)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Inventory Input'} title={'Inventory Item Input'} />

                {
                    id &&
                    <Card>
                        <CardBody>
                            <label className='text-primary fw-bolder'>Attachment</label>
                            <Row className='border border-success p-3 rounded'>
                                <div>
                                    <Button
                                        color="success"
                                        className="btn btn-success"
                                        onClick={() => handleAttachment(id)}
                                    >
                                        Attachment
                                    </Button>
                                </div>
                            </Row>
                        </CardBody>
                    </Card>
                }


                {
                    updateDataLoading ? <CustomSpinner /> : error ? <p className='text-center fs-1'>{error}</p> :
                        <Card>
                            <CardBody>
                                <Row className='mb-3'>
                                    <ReactSelectItem title={'Select Group'}
                                        handleSelectedItem={handleSelectedItem}
                                        name={'groupID'}
                                        options={groupOption}
                                        value={groupOption.find((option) => Number(option.value) == padWithZero(invenData.groupID))}
                                        text={'*'}

                                    />
                                    <ReactSelectItem title={'Select Sub-Group '}
                                        options={subGroupOption}
                                        handleSelectedItem={handleSelectedItem}
                                        name={'subGroupID'}
                                        // defaultValue={subGroupOption.find((option) => option.value === invenData.subGroupID)}
                                        value={selectVelue ? selectVelue : ""}
                                        text={'*'}
                                    />
                                    <ReactSelectItem title={'Select Category '}
                                        options={category}
                                        handleSelectedItem={handleSelectedItem}
                                        name={'catID'}
                                        value={category.find((option) => option.value === invenData.catID)}
                                        text={'*'}
                                    />
                                    <InvenItemInputField
                                        title={'Item Code '}
                                        name={'itemCode'} onchangeInput={handleChangeInput}
                                        value={invenData.itemCode}
                                        defaultValue={invenData?.groupID ? `${padWithZero(invenData.groupID)} . ${selectVelue ? selectVelue?.value : ''} . ` : ''}
                                        disabled={!invenData.groupID || !invenData.subGroupID}
                                        maxlength={5}
                                        text={'*'}
                                    />
                                    {/* 
                    </Row>

                    <Row className='mb-3'> */}
                                    <InvenItemInputField title={'Item Desc'}
                                        name={'itemDesc'} onchangeInput={handleChangeInput}
                                        value={invenData.itemDesc}
                                        text={'*'}
                                    />
                                    {
                                        id &&
                                        <Col md={3} sm={6} className='mt-2'>
                                            <Label className="activeStatus">
                                                Active Status
                                            </Label>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                id='activeStatus'
                                                name="itmStatus"
                                                value={invenData?.itmStatus}
                                                onChange={handleChangeInput}
                                            >
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </select>
                                        </Col>
                                    }
                                    <InvenItemInputField title={'Item Display Name'}
                                        name={'itemDisplayName'} onchangeInput={handleChangeInput}
                                        value={invenData.itemDisplayName}
                                    />
                                    <InvenItemInputField title={'Item Specification'}
                                        name={'itemSpecificationDetail'} onchangeInput={handleChangeInput}
                                        value={invenData.itemSpecificationDetail}
                                    />

                                    <ReactSelectItem title={'UOM '}
                                        options={uomItem}
                                        handleSelectedItem={handleSelectedItem}
                                        name={'uom'}
                                        value={uomItem.find((option) => option.value === invenData.uomID)}
                                        text={'*'}
                                    />

                                    <ReactSelectItem title={'Second UOM '}
                                        options={uomItem}
                                        handleSelectedItem={handleSelectedItem}
                                        name={'secondUom'}
                                        value={uomItem.find((option) => option.value === invenData.secUomID ? invenData.secUomID : 0)}
                                        isClearable={true}
                                    />

                                    <InvenItemInputField title={'Conversion Ratio'}
                                        name={'convRatio'} onchangeInput={handleChangeInputToNumber}
                                        value={invenData.secUomID ? invenData.convRatio : 0}
                                    />
                                    <InvenItemInputField title={'Coa Code'}
                                        name={'coaCode'} onchangeInput={handleChangeInput}
                                        value={invenData.coaCode}
                                    />

                                    <InvenItemInputField title={'Min Stock'}
                                        name={'minStk'}
                                        onchangeInput={handleChangeInputToNumber}
                                        value={invenData.minStk > 0 ? invenData.minStk : ''}
                                    />
                                    <InvenItemInputField title={'Max Stock'}
                                        name={'maxStk'} onchangeInput={handleChangeInputToNumber}
                                        value={invenData.maxStk > 0 ? invenData.maxStk : ''}
                                    />
                                    <InvenItemInputField title={'Record stock'}
                                        name={'reorderStk'} onchangeInput={handleChangeInputToNumber}
                                        value={invenData.reorderStk > 0 ? invenData.reorderStk : ''}
                                    />
                                    <InvenItemInputField title={'Std Inv Val'}
                                        name={'stdInvVal'} onchangeInput={handleChangeInputToNumber}
                                        value={invenData.stdInvVal > 0 ? invenData.stdInvVal : ''}
                                    />

                                    <InvenItemInputField title={'Std Sal Val'}
                                        name={'stdSalVal'} onchangeInput={handleChangeInputToNumber}
                                        value={invenData.stdSalVal > 0 ? invenData.stdSalVal : ''}
                                    />

                                    <InvenItemInputField title={'Location'}
                                        name={'location'} onchangeInput={handleChangeInput}
                                        value={invenData.location}
                                    />

                                    <InvenItemInputField
                                        title={'Info 1'}
                                        name={'addField1'}
                                        onchangeInput={handleChangeInput}
                                        value={invenData?.addField1}
                                    />
                                    <InvenItemInputField
                                        title={'Info 2'}
                                        name={'addField2'}
                                        onchangeInput={handleChangeInput}
                                        value={invenData?.addField2}
                                    />
                                    <InvenItemInputField
                                        title={'Info 3'}
                                        name={'addField3'}
                                        onchangeInput={handleChangeInput}
                                        value={invenData?.addField3}
                                    />
                                    <InvenItemInputField
                                        title={'Item Old Code'}
                                        name={'itmOldCode'}
                                        onchangeInput={handleChangeInput}
                                        value={invenData?.itmOldCode}
                                    />

                                    <CheckBox handleCheckBox={handleCheckBox}
                                        value={checked && checked}
                                    />
                                    {/* </Row> */}

                                    <Row className='mb-3 text-center'>
                                        <Col md={12} className='px-2 mt-3'>
                                            <Button
                                                type="button"
                                                color={"success"}
                                                className="btn-rounded px-4"
                                                onClick={id ? handleUpdate : handleSubmit}
                                                disabled={!invenData.groupID || !invenData.subGroupID || !invenData.catID || !invenData.itemDesc || !invenData.uom || !invenData.itemCode || loading
                                                }
                                            >
                                                {loading ?
                                                    <Spinner /> :
                                                    <>
                                                        {id ? 'Update Item' : 'Add Item'}
                                                    </>
                                                }
                                            </Button>
                                        </Col>
                                    </Row>
                                </Row>
                            </CardBody>
                        </Card>
                }
            </Container>


            <ItemModal
                show={showModal}
                handlModal={handlModal}
                error={submitionError}
                title={'Item Submission'}
            />

        </div>
    )
}

export default AddInvenItem