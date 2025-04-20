import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap'
import { updatePassword } from '../../../store/users-list/actions';

const UserPasswordTab = ({ user }) => {
    const [passwordError, setpasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const [pwChangeInformation, setpwChangeInformation] = useState(
        {
            userID: user.userID,
            newPassword: '',
            confirmNewPassword: '',
        }
    )

    const dispatch = useDispatch()

    const validatePassword = (val) => {

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;

        if (!passwordRegex.test(val)) {
            setpasswordError(
                'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 non-alphanumeric character.',
            );
            return false;
        }

        setpasswordError('');

        return true;
    };

    const handleChange = (e) => {
        validatePassword(e.target.value);
        const { name, value } = e.target
        const newPass = { ...pwChangeInformation, [name]: value }
        setpwChangeInformation(newPass)
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleupdatePassword = () => {
        const data = {
            data: pwChangeInformation
        }
        dispatch(updatePassword(data))

    }


    return (
        <div className='p-4'>
            <Row>
                <Col className="mb-3">
                    <Label className="form-label">
                        New Password
                    </Label>
                    <Input
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="mb-3">
                    <Label className="form-label">
                        Confirm Password
                    </Label>
                    <Input
                        name="confirmNewPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <div className="form-check fs-4 ">
                <input
                    type="checkbox"
                    className="form-check-input checkboxboder"
                    id="customControlInline"
                    onChange={handleShowPassword}
                />
                <label
                    className="form-check-label banglaBijoy"
                    htmlFor="customControlInline"
                >
                    {showPassword ? 'Hide Password' : 'Show Password'}
                </label>
            </div>
            {passwordError && <p className='text-danger'>{passwordError}</p>}
            <Row>
                <Col>
                    <div className="text-end">
                        <button
                            type="submit"
                            className="btn btn-success save-user"
                            disabled={passwordError || pwChangeInformation.newPassword !== pwChangeInformation.confirmNewPassword ? true : false || pwChangeInformation.newPassword === '' ? true : false}
                            onClick={handleupdatePassword}
                        >
                            Update Password
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default UserPasswordTab