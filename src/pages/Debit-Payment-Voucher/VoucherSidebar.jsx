/* eslint-disable react/prop-types */
import React from 'react'
import {
    Row,
    Label,
    Card,
    CardBody,
} from "reactstrap";
import Spinner from '../../components/Common/Spinner';

const VoucherSidebar = ({ allEnterpriseSetup, allDivision, allEntity, allBusinessUnit, loading, selectedEnterprise, selectedDivision,
    selectedEntity,
    selectedBusinessUnit,
    setSelectedEnterprise,
    setSelectedDivision,
    setSelectedEntity,
    setSelectedBusinessUnit }) => {
    return (
        <div>
            <Card>
                <CardBody>

                    <Row className='mb-3 mt-3'>
                        {
                            loading === true ?
                                <Spinner />
                                :
                                <div>
                                    <Label for="selectEnterprise">Select Enterprise</Label>
                                    <select
                                        className="form-control"
                                        value={selectedEnterprise}
                                        onChange={(e) => setSelectedEnterprise(e.target.value)}
                                        disabled
                                    >
                                        {allEnterpriseSetup.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.enterpriseName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                        }
                    </Row>

                    <Row className='mb-3 mt-3'>
                        {
                            loading === true ?
                                <Spinner />
                                :
                                <div>
                                    <Label for="selectDivision">Select Division</Label>
                                    <select
                                        className="form-control"
                                        value={selectedDivision}
                                        onChange={(e) => setSelectedDivision(e.target.value)}
                                        disabled
                                    >
                                        {allDivision.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.divisionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                        }
                    </Row>

                    <Row className='mb-3 mt-3'>
                        {
                            loading === true ?
                                <Spinner />
                                :
                                <div>
                                    <Label for="selectEntity">Select Entity</Label>
                                    <select
                                        className="form-control"
                                        value={selectedEntity}
                                        onChange={(e) => setSelectedEntity(e.target.value)}
                                        disabled
                                    >
                                        {allEntity.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.entityName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                        }
                    </Row>

                    <Row className='mb-3 mt-3'>
                        {
                            loading === true ?
                                <Spinner />
                                :
                                <div>
                                    <Label for="selectBusinessUnit">Select Business Unit</Label>
                                    <select
                                        className="form-control"
                                        value={selectedBusinessUnit}
                                        onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                                        disabled
                                    >
                                        {allBusinessUnit.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.businessUnitName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                        }
                    </Row>

                </CardBody>
            </Card>
        </div>
    )
}

export default VoucherSidebar