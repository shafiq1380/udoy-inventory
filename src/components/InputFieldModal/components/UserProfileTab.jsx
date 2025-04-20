import React, { useState } from 'react'
import { Button, Col, FormGroup, Input, Label, Progress, Row } from 'reactstrap'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../getCroppedImg';
import { useDispatch } from 'react-redux';
import { uploadPhoto } from '../../../store/users-list/actions';
import { fileUploadURL } from '../../../utils/https';


const style = {
    height: '250px',
    bgcolor: 'background.paper',

};


const Tab2 = ({ user }) => {

    const [imagefile, setImageFile] = useState()

    // Crop Image State 
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [cropperedAreaPixel, setCropperedAreaPixel] = useState(null)
    const [newPhotoUrl, setPhotoUrl] = useState()

    const dispatch = useDispatch()


    const cropComplete = (cropedArea, cropAreaPixel) => {
        setCropperedAreaPixel(cropAreaPixel)
    }

    const cropImage = async () => {
        try {
            const croppedImageUrl = await getCroppedImg(imagefile, cropperedAreaPixel);
            setPhotoUrl(croppedImageUrl)

            const file = new FormData()
            file.append('UserID', user.userID)
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


    const handleAttachment = (id) => {

        const popupWidth = 900; // Set your desired width
        const popupHeight = 500; // Set your desired height
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 4;
        const url = `${fileUploadURL}catId=2&id=${id}`;
        window.open(
            url,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`
        );
    };



    return (
        <div className='p-4 '>
            <Row>
                <label className='text-primary fw-bolder'>Upload Photo</label>
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

            </Row>
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
                        <Button className='btn-danger mx-2 px-4' onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button className='btn-success px-4' onClick={cropImage}>
                            Crop & Upload
                        </Button>
                    </Col>
                </Row>
            }
            <label className='text-primary fw-bolder mt-5'>Add User Other's Attachment</label>
            <Row className='border border-success p-3 rounded'>
                <div>
                    <Button
                        color="success"
                        className="btn btn-success"
                        onClick={() => handleAttachment(user.userID)}
                    >
                        Attachment
                    </Button>
                </div>
            </Row>

        </div>
    )
}

export default Tab2