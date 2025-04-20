import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'

const BackButton = () => {

    const history = useNavigate()

    return (
        <Button
            type="button"
            color="success"
            className="btn-rounded px-3"
            onClick={() => history(-1)}
        >
            <IoMdArrowRoundBack size={20} color='white' />
        </Button>
    )
}

export default BackButton