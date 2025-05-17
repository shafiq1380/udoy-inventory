import React, { useEffect, useState } from 'react'
import { Card, Container, Input, Row } from 'reactstrap'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { authorization } from '../../../components/Common/Authorization'
import { Post } from '../../../utils/https'
import GodownItem from './GodownItem'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import { AiOutlineSearch } from "react-icons/ai";

const CGIDashboard = () => {

    const [allStoreList, setAllStoreList] = useState([])
    const [originalStoreList, setOriginalStoreList] = useState([])


    const filterAllStoreList = (e) => {
        const searchTerm = e.target.value?.toLowerCase();
        if (searchTerm) {
            setAllStoreList(
                originalStoreList.filter(item =>
                    item.storeCode?.toLowerCase().includes(searchTerm)
                )
            );
        } else {
            setAllStoreList(originalStoreList);
        }
    };



    const fetchAllData = async () => {
        try {
            const [rentDataResponse, storeDataResponse] = await Promise.all([
                Post('/api/v1/ChemicalGdown/GetDashboardRentData'),
                Post('/api/v1/Product/GetAllStore')
            ]);

            // console.log(storeDataResponse)

            const rentData = rentDataResponse.data.data;
            const storeData = storeDataResponse.data.data;

            const matchingStores = [];
            const nonMatchingStores = [];

            storeData.forEach(store => {
                const matchingRentData = rentData.find(rent => rent.storeID === store.id);
                if (matchingRentData) {
                    matchingStores.push(matchingRentData);
                } else {
                    nonMatchingStores.push(store);
                }
            });

            const updatedStoreList = [...matchingStores, ...nonMatchingStores];


            // Update state
            setOriginalStoreList(updatedStoreList);
            setAllStoreList(updatedStoreList);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    useEffect(() => {
        fetchAllData()
    }, [])


    //authorization
    useEffect(() => {
        authorization(115)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Chemical Godown Dashboard'} title={'CGI'} />
                <div className=' mb-4 col-md-3 position-relative '>
                    <Input placeholder='Search godown name' className='form-control p-2 ' autoFocus
                        onChange={filterAllStoreList}
                    />
                    <AiOutlineSearch
                        size={25}
                        className='position-absolute top-50 end-0 translate-middle-y  '
                        color='gray'
                        style={{ marginRight: '15px' }}
                    />
                </div>
                <>
                    {allStoreList.length > 0 && (
                        <Row className="g-4">
                            {allStoreList.map((item, index) => (
                                <GodownItem key={index} item={item} />
                            ))}
                        </Row>
                    )}
                    {originalStoreList.length === 0 && <CustomSpinner />}
                    {allStoreList.length === 0 && originalStoreList.length > 0 && <h3 className='text-secondary fs-5 text-md-start text-center' >
                        No Godown Found
                    </h3>}
                </>

            </Container>
        </div>
    )
}

export default CGIDashboard