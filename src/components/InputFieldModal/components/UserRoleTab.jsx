import React, { useEffect, useState } from 'react'
import { Col, Label, Row } from 'reactstrap'
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { addUserRole } from '../../../store/users-list/actions';

const Tab3 = ({ user }) => {

    const [options, setOptions] = useState()
    const [selectedOption, setSelectedOption] = useState();

    const { userID } = useSelector(state => state.Login.userInformation)
    const dispatch = useDispatch()

    // const filterRole = user?.userRole.filter(role => role.selected === 1)

    const handleSelectChange = (e) => {
        setSelectedOption(e)
    }


    const selectValue = selectedOption?.map(item => item.value)

    const handleAddRole = () => {
        const data = {
            data: {
                userCode: user.userID,
                roleList: selectValue
            }
        }
        dispatch(addUserRole(data))
    }

    const defaultSelection = () => {
        const filterRole = user?.userRole.filter(role => role.selected === 1)
        const data = filterRole?.map(role => {
            return {
                value: role.roleID,
                label: role.roleName
            }
        })
        setSelectedOption(data)
    }


    const optionss = () => {
        const data = user?.userRole?.map(role => {
            return {
                value: role.roleID,
                label: role.roleName
            }
        })
        setOptions(data)
    }


    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: 'white', // Change this to the desired background color
        }),
    };


    useEffect(() => {
        optionss()
        defaultSelection()
    }, [])


    return (
        <div className='p-4'>
            <Row>
                <Col className="col-12 mb-3">
                    <Label className="form-label">Select User Role</Label>
                    <Select
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={options}
                        isMulti
                        styles={customStyles}
                    />
                </Col>
                <Col>
                    <div className="text-end">
                        <button
                            type="submit"
                            className="btn btn-success save-user"
                            onClick={handleAddRole}
                        >
                            Update User Role
                        </button>
                    </div>
                </Col>
            </Row>

        </div>
    )
}

export default Tab3