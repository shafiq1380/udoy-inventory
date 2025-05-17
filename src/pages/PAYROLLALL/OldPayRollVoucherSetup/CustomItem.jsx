import React, { useEffect, useState } from 'react'
import CustomInput from './CustomInput'
import { Button, Spinner } from 'reactstrap'
import { Post } from '../../../utils/https'

const CustomItem = ({ item, handleModal, getError }) => {
    const [loading, setLoading] = useState(false)
    const [itemData, setItem] = useState()
    const userID = JSON.parse(localStorage.getItem('userID'))
    const [disabled, setDisabled] = useState(true)

    // console.log(item)

    const handleOpeningData = (e, index = 0) => {
        setDisabled(false)
        const { value } = e.target;
        setItem(prevItem => {
            if (prevItem && prevItem.paySetup && prevItem.paySetup[index]) {
                const updatedItem = { ...prevItem };
                updatedItem.paySetup = [...prevItem.paySetup];
                updatedItem.paySetup[index] = {
                    ...prevItem.paySetup[index],
                    amount: parseFloat(value)
                };
                return updatedItem;
            } else {
                console.error('item or item.paySetup is undefined');
                return prevItem;
            }
        });
    };

    const validation = (data) => {
        // console.log(data)
        const isValid = data?.paySetup?.every((item) => {
            // console.log(item?.amount)
            if (Number.isNaN(item.amount)) {
                getError({ message: `${item?.forCode} amount must be a number `, color: 'danger' })
                handleModal()
                setLoading(false)
                return false;
            }
            return true;
        });
        return isValid
    }

    const handleItem = () => {
        const data = { ...itemData, updateBy: userID }
        setLoading(true)
        const isValid = validation(data)
        if (isValid) {
            try {
                Post('/api/v1/Payroll/UpdatePayrollOpening', { data: data })
                    .then(res => {
                        if (res.data.errorMessage) {
                            setLoading(true)
                            getError({ message: res.data.errorMessage, color: 'danger' })
                            handleModal()
                        } else {
                            setLoading(false)
                            getError({ message: "Updated Successfully", color: 'success' })
                            handleModal()
                        }
                    })
            } catch (error) {

            }

        }
    }


    useEffect(() => {
        setItem(item)
    }, [item])

    // console.log(itemData)

    return (
        <>
            {
                itemData &&
                <>
                    <td>{itemData?.employeeID}</td>
                    <td>{itemData?.employeeCode}</td>
                    <td>{itemData?.employeeName}</td>
                    <td>{itemData?.employeeTypeDet}</td>
                    <td>{itemData?.employeeDesignation}</td>
                    <td>{itemData?.employeeDepartment}</td>
                    {
                        itemData?.paySetup?.map((item, index) => {
                            // console.log(item)
                            return (
                                <td>
                                    <CustomInput
                                        data={item}
                                        handleOpeningData={handleOpeningData}
                                        index={index}
                                    />
                                </td>
                            )
                        })
                    }
                    <td>
                        {
                            loading ?
                                <div className='d-flex justify-content-center'>
                                    <Spinner color='success' />
                                </div>
                                :
                                <Button
                                    color="success"
                                    onClick={handleItem}
                                    disabled={disabled}
                                >
                                    Update
                                </Button>
                        }
                    </td>
                </>
            }
        </>
    )
}

export default React.memo(CustomItem)