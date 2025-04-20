import React, { useMemo } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import TableContainer from '../../../components/Common/TableContainer';
import { MobileNumber, UserEmail, UserName, UserStatus } from '../../UserList/UserCol';
import CustomButton from '../../JournalVoucher/CustomButton';

const SearchItemSelectModal = ({ show, allItemList, handleCloseSearchModal, handleAccountCodeChange, indext }) => {

    const handleClick = (itemCode, index) => {
        handleCloseSearchModal()
        handleAccountCodeChange({
            label: `${itemCode.row.original.itemCode}:${itemCode.row.original.itemDesc}`,
            value: itemCode.row.original.id
        }, index)
    }

    // ID, [group Name, Subgroup Name,] ItemCode, Item Name, AddInfo1, AddInfo2, AddInfo3, OldCode

    // console.log(allItemList)

    const columns = useMemo(
        () => [

            {
                Header: "ID",
                accessor: "id",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },

            {
                Header: "Item Code",
                accessor: "itemCode",
                disableFilters: false,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Item Name",
                accessor: "itemDesc",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "AddInfo1",
                accessor: "addField1",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "AddInfo2",
                accessor: "addField2",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "AddInfo3",
                accessor: "addField3",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: " OldCode",
                accessor: "itmOldCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },

            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (itemCode) => {
                    return (
                        <div className="d-flex gap-3">
                            <CustomButton
                                text="Select"
                                onClick={() => handleClick(itemCode, indext)}
                            />
                        </div>
                    );
                },
            },
        ],
        [indext]
    );

    // console.log(allItemList)

    return (
        <Modal size="xl"
            isOpen={show}
            toggle={handleCloseSearchModal}
        >
            <div className="modal-content">
                <ModalBody >
                    <ModalHeader
                        toggle={handleCloseSearchModal}
                    >Select Item</ModalHeader>

                    <ModalBody className='custom-scrollbar'>
                        <TableContainer
                            columns={columns}
                            data={allItemList}
                            // onClickBtn={handleClick}
                            customPageSize={100}
                            className="custom-header-css"
                            showbtn={false}
                            hidden={true}
                        />
                    </ModalBody>

                    <ModalFooter>

                    </ModalFooter>
                </ModalBody>
            </div>
        </Modal >
    )
}

export default SearchItemSelectModal