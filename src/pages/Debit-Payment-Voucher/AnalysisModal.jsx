import React, { useEffect, useRef, useState } from 'react'
import {
    CardHeader,
    CardTitle,
    Col,
    Row,
    Label,
    Card,
    CardBody,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
} from "reactstrap";
import Select from 'react-select'
const AnalysisModal = ({ analysisData, onCloseClick, handleAnalysisChange, setIsAnalysisModal, isAnalysisModal, rowIndex, getSerialLabel }) => {

    const getDefaultValues = () => {

        const defaults = analysisData.defaultSelectedAnalysis?.map(({ analTypeId, analId }) => {
            // console.log(analTypeId)
            const foundItem = analysisData.analysisData?.analysisList.find(
                (item) => item.analysisTypeID === analTypeId);

            if (foundItem) {
                const label = foundItem.itemList?.find((subItem) => subItem.analysisID === analId)
                return {
                    value: foundItem.analysisTypeID, // You can customize this based on your data structure
                    label: `${label.analysisCode} : ${label.analysisName}`
                };
            }
            return foundItem;
        });
        return defaults;
    };

    const selectDefaults = getDefaultValues()

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: '#00CCFF ',
            },
        }),
    };


    return (
        <div>
            <Modal
                isOpen={isAnalysisModal}
                role="dialog"
                // autoFocus={true}
                centered={true}
                className="exampleModal"
                tabIndex="-1"
                toggle={() => { setIsAnalysisModal(!isAnalysisModal) }}
                size="lg"
            >
                <div className="modal-content">
                    <button
                        type="button" onClick={() => onCloseClick()} className="btn-close position-absolute end-0 top-0 m-3"></button>

                    <ModalHeader>
                        {/* {analysisData.analysisData?.coaCode} : {analysisData.analysisData?.coaName} : Row Index : {rowIndex} */}
                        {analysisData.analysisData?.coaCode} : {analysisData.analysisData?.coaName}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            {analysisData.analysisData?.analysisList &&
                                analysisData.analysisData?.analysisList?.map((item, indx) => (
                                    <Card key={indx} value={item.analysisTypeID}>
                                        <CardBody>
                                            <Row>
                                                <Col className='align-self-center'>
                                                    <h5 value={item.analysisTypeID}>
                                                        {getSerialLabel(indx)}: Analysis: {item.analysisTypeName} -&gt;{' '}
                                                    </h5>
                                                </Col>
                                                <Col>
                                                    {/* <select
                                                        className="form-control"
                                                        key={item.analysisTypeID}
                                                        onChange={(e) => handleAnalysisChange(item, e, analysisData.analysisData.coaId, rowIndex, indx)}
                                                        defaultValue={analysisData.defaultSelectedAnalysis?.find(data => data.analTypeId === item.analysisTypeID)?.analId || ''}
                                                    >
                                                        <option value="">Select Analysis</option>
                                                        {item.itemList.map((iList, index) => (
                                                            <option key={index} value={iList.analysisID}>
                                                                {iList.analysisCode} : {iList.analysisName}
                                                            </option>
                                                        ))}
                                                    </select> */}

                                                    <Select
                                                        styles={customStyles}
                                                        // value={getDefaultValues()}
                                                        value={selectDefaults[indx]}
                                                        onChange={(e) => handleAnalysisChange(item, e, analysisData.analysisData.coaId, rowIndex, indx)}
                                                        options={item.itemList.map((item) => {
                                                            return {
                                                                label: item.analysisCode + " : " + item.analysisName,
                                                                value: item.analysisID
                                                            };
                                                        })}
                                                        autoFocus
                                                    />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                ))
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="success" onClick={() => { setIsAnalysisModal(!isAnalysisModal) }}>
                            Done
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    )
}

export default AnalysisModal