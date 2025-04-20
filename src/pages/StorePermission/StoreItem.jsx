import React, { useState } from 'react'
import { Spinner } from 'reactstrap'
import { Post } from '../../utils/https'

const StoreItem = ({ storesItems, checkedData, handleChangeTheCheckBox, userData }) => {

    const { storeCode, id } = storesItems
    const [loading, setLoading] = useState(false)

    // console.log(id)
    // console.log(userData.storeList)

    const handleChange = (userID, id) => {

        setLoading(true)
        const data = { data: { userID: userData?.userID, storeID: id, permission: userData?.storeList.includes(id) ? 0 : 1 } }
        // console.log(data)
        Post(`/api/InvTransaction/UpdateStorePermissionByUser`, data)
            .then(res => {
                // console.log(res.data)
                if (res.data.success) {
                    setLoading(false)
                    handleChangeTheCheckBox(userID, id)
                }
                if (!res.data.success) {
                    alert(res.data.errorMessage)
                    setLoading(false)
                }
            }
            )
    }

    // console.log(checkedData?.includes(id) ? true : false)

    return (
        <div className='mx-2 d-flex align-items-center justify-content-between gap-3 py-2'>
            <p
                className={`${checkedData?.includes(id) ? "text-success" : "text-danger"} mb-0 `}
                style={{ cursor: "default" }}
                onClick={() => handleChange(userData?.userID, id)}
            >
                {storeCode}
            </p>
            {
                loading ?
                    <Spinner size='sm' color='success' />
                    :
                    <input
                        type="checkbox"
                        checked={checkedData?.includes(id) ? true : false}
                        onChange={() => handleChange(userData?.userID, id)}
                    />
            }
        </div>

    )
}

export default StoreItem