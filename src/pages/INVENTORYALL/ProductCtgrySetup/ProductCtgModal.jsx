import React, { useEffect, useState } from 'react'
import { Button, CardTitle, Col, Input, Label, Modal, ModalBody, Row } from 'reactstrap'
import { Post } from '../../../utils/https'

const ProductCtgModal = ({ show, handleModal, isEdit, updateData }) => {

    const [productCtgData, setProductCtgData] = useState({
        categoryName: '',
    })
    const [error, setError] = useState()

    const handleInputValue = (e) => {
        const { name, value } = e.target
        setProductCtgData({ ...productCtgData, [name]: value })
    }

    const updateProductCtg = async () => {
        const data = { data: productCtgData }
        try {
            const response = await Post('/api/v1/Product/UpdateItemCategory', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setProductCtgData({
                            categoryName: '',
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }

    const addProductCtg = async () => {
        const data = { data: productCtgData }
        try {
            const response = await Post('/api/v1/Product/InsertItemCategory', data)
                .then(res => {
                    if (res.data.success === false) {
                        setError(res.data.errorMessage)
                    } else {
                        handleModal()
                        setProductCtgData({
                            categoryName: '',
                        })
                    }

                })
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (isEdit) {
            setProductCtgData({
                id: updateData.id,
                categoryName: updateData.categoryName,
            })
        } else {
            setProductCtgData({
                categoryName: '',
            })
        }
        setError('')
    }, [isEdit, updateData, show])



    return (
        <Modal isOpen={show} toggle={() => handleModal()} top={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5">
                    <button type="button" onClick={() => handleModal()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <CardTitle className="mb-4" tag="h1" >{isEdit ? 'Edit Product Category' : 'Add Product Category'}</CardTitle>
                    <Row>
                        <Col className="col-12">
                            <div className="mb-3">
                                <Label className="form-label">
                                    Category Name
                                </Label>

                                <Input
                                    name='categoryName'
                                    type="text"
                                    placeholder='Enter category name'
                                    onChange={handleInputValue}
                                    value={productCtgData?.categoryName}
                                // disabled
                                />
                            </div>
                        </Col>

                        {/* 
                    {
                        isEdit &&
                        <Col className="col-12 mb-3">
                            <Label className="activeStatus">
                                Active Status
                            </Label>
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                id='activeStatus'
                                name="status"
                            // value={storeData?.status}
                            // onChange={handleInputValue}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </Col>
                    } */}

                    </Row>

                    {
                        error &&
                        <p className="text-danger mt-3 fs-5">{error}</p>
                    }

                    <div className="text-right mt-md-3">
                        <Button
                            type="button"
                            color="success"
                            onClick={isEdit ? updateProductCtg : addProductCtg}
                        >
                            {isEdit ? 'Update Category' : 'Add Product Category'}
                        </Button>
                    </div>
                </ModalBody>
            </div >
        </Modal >
    )
}

export default ProductCtgModal