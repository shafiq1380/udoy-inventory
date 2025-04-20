import React, { useEffect, useState } from 'react'
import { Button, Col, FormGroup, Input, Label, Progress, Row, Spinner } from 'reactstrap'
import Cropper from 'react-easy-crop'

import { useDispatch, useSelector } from 'react-redux';
import { uploadPhoto } from '../../../store/users-list/actions';
import getCroppedImg from '../../../components/InputFieldModal/getCroppedImg';


const style = {
    height: '250px',
    bgcolor: 'background.paper',

};


const UserProfileImageUpload = ({ user }) => {

    const [imagefile, setImageFile] = useState()

    // Crop Image State 
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [cropperedAreaPixel, setCropperedAreaPixel] = useState(null)
    const [newPhotoUrl, setPhotoUrl] = useState()

    const userID = JSON.parse(localStorage.getItem('userID'))

    const { reload, loading } = useSelector(state => state.usersReducer)

    const dispatch = useDispatch()


    const cropComplete = (cropedArea, cropAreaPixel) => {
        setCropperedAreaPixel(cropAreaPixel)
    }

    const cropImage = async () => {
        try {
            const croppedImageUrl = await getCroppedImg(imagefile, cropperedAreaPixel);
            setPhotoUrl(croppedImageUrl)

            const file = new FormData()
            file.append('UserID', userID)
            file.append('UserPhoto', croppedImageUrl)

            dispatch(uploadPhoto(file))
        } catch (error) {
            console.log('Error', error)
        }

    }


    //get Image and the ID
    const getImage = (e) => {
        const photo = URL.createObjectURL(e.target.files[0])
        setImageFile(photo)
    }


    const handleCancel = () => {
        setImageFile(null)
    }


    const maxZoom = 3;
    const handleZoomChange = (e) => {
        setZoom(parseFloat(e.target.value));
    };


    useEffect(() => {
        if (reload) {
            window.location.reload()
        }
    }, [reload])

    return (
        <div style={{ height: '420px' }} className='p-4 '>
            < Row >
                <input
                    onChange={getImage}
                    name='userPhoto'
                    className={`mb-3 form-control ${imagefile ? " " : 'p-4'} text-primary`}
                    type="file"
                    id="fileInput"
                />
                <Col>

                    {
                        imagefile &&
                        <div style={style}>
                            <Cropper
                                image={imagefile}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 4}
                                onZoomChange={setZoom}
                                onCropChange={setCrop}
                                onCropComplete={cropComplete}

                            />
                        </div>
                    }

                </Col>

            </Row >
            {
                imagefile &&
                <Row>
                    <FormGroup>
                        <Input
                            // style={{ background: 'linear-gradient(to right, #FF0000, #00FF00)', }}
                            className='mt-2 '
                            type="range"
                            id="zoomSlider"
                            min="1"
                            max={maxZoom}
                            step="0.1"
                            value={zoom}
                            onChange={handleZoomChange}
                        />
                    </FormGroup>
                    <Col>
                        {
                            loading ?
                                <Button className='btn-success'>
                                    <Spinner size={'md'} />
                                </Button>
                                :
                                <div>
                                    <Button className='btn-danger mx-2 px-4' onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button className='btn-success px-4' onClick={cropImage}>
                                        Crop & Upload
                                    </Button>
                                </div>
                        }
                    </Col>
                </Row>
            }

        </div >
    )
}

export default UserProfileImageUpload