import React from 'react'

const Spinner = () => {
    return (
        <div className="w-100 d-flex justify-content-center">
            <div className="spinner-grow text-success  text-center"
                style={{ width: '2.5rem', height: "2.5rem" }} role="status">
            </div>
        </div>
    )
}

export default Spinner