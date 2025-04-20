/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { Filter, DefaultColumnFilter, SelectColumnFilter, SelectDynamicColumnFilter } from "../../../components/Common/filters";
import { CSVLink } from "react-csv";


// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <Col sm={4}>
            <div className="search-box me-2 mb-2 d-inline-block">
                <div className="position-relative">
                    <label htmlFor="search-bar-0" className="search-label">
                        <span id="search-bar-0-label" className="sr-only">
                            Search this table
                        </span>
                        <input
                            onChange={(e) => {
                                setValue(e.target.value);
                                onChange(e.target.value);
                            }}
                            id="search-bar-0"
                            type="text"
                            className="form-control"
                            placeholder={`${count} records...`}
                            value={value || ""}
                        />
                    </label>
                    <i className="bx bx-search-alt search-icon"></i>
                </div>
            </div>
        </Col>
    );
}

const DynamicTable = ({
    columns,
    data,
    isGlobalFilter,
    isAddOptions,
    isAddUserList,
    onClickBtn,
    handleUserClick,
    handleCustomerClick,
    isAddCustList,
    customPageSize,
    className,
    customPageSizeOptions,
    handleItemView,
    showbtn,
    pdfRows,
    pdfColoumData,
    hidden,
    exbtn,
    gridExBtn,
    excelDownload
}) => {


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        rows,
    } = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: {
                pageIndex: 0,
                pageSize: customPageSize,

            },
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const generateSortingIndicator = (column) => {
        return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
    };

    const onChangeInSelect = (event) => {
        setPageSize(Number(event.target.value));
    };

    const onChangeInInput = (event) => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    };



    // Get visible rows based on current page and page size
    const visibleRows = rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    const columnsToSkip = columns.slice(3);
    const columnsToSum = columnsToSkip.map(item => item.id)

    const calculateColumnSum = (data, accessor) => {
        return data.reduce((acc, row) => acc + (row.values[accessor]), 0);
    };


    const columnSums = columnsToSum.reduce((sums, accessor) => {
        sums[accessor] = calculateColumnSum(visibleRows, accessor);
        return sums;
    }, {});


    const filteredObjectData = page.map((row) => row.original);
    // console.log(filteredObjectData)

    const preprocessData = (data) => {
        return data.map(row => {
            let newRow = {};
            for (let key in row) {
                if (typeof row[key] === 'object' && Object.keys(row[key]).length === 0) {
                    newRow[key] = ""; // Replace empty object with an empty string
                } else {
                    newRow[key] = row[key];
                }
            }
            return newRow;
        });
    };

    const preprocessedData = preprocessData(filteredObjectData);

    // console.log(preprocessedData)

    return (
        <Fragment>
            {
                exbtn &&
                <Col sm="11 d-flex justify-content-start">
                    <div className=" mt-2 mt-md-0">
                        <div className=" mt-2 mt-md-0">
                            <Button
                                type="button"
                                color="success"
                                className="btn-rounded  mb-2 me-2"
                                onClick={excelDownload}
                            >
                                Export All to Excel
                            </Button>
                        </div>
                    </div>

                    <div className="text-sm-end mt-2 mt-md-0">
                        {
                            <Button
                                type="button"
                                color="primary"
                                className="btn-rounded  mb-2 me-2"
                                onClick={''}
                            >
                                {/* <i className="mdi mdi-plus me-1" /> */}
                                <CSVLink filename="BSEC"
                                    data={preprocessedData}
                                    className="text-white"
                                >
                                    Export Grid Data
                                </CSVLink>
                            </Button>
                        }
                    </div>
                </Col>
            }
            {
                gridExBtn &&
                <Col sm="11 d-flex justify-content-start">
                    <div className="text-sm-end mt-2 mt-md-0">
                        <Button
                            type="button"
                            color="primary"
                            className="btn-rounded  mb-2 me-2"
                            onClick={''}
                        >
                            {/* <i className="mdi mdi-plus me-1" /> */}
                            <CSVLink filename="BSEC" data={filteredObjectData} className="text-white">
                                Export Grid Data</CSVLink>
                        </Button>
                    </div>
                </Col>
            }


            <div className="table-responsive react-table" style={{ height: '75vh', width: '100%' }}>
                <Table bordered hover {...getTableProps()} className={className}>
                    <thead className="table-light " >

                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} style={{ position: 'sticky', top: -1, zIndex: 0, background: 'white' }}>
                                {/* Custom row header */}
                                <th key="serial">Serial</th>
                                {headerGroup.headers.map((column) => (
                                    <th key={column.id}>
                                        <div className="mb-2 p-0 font-weight-normal"
                                            {...column.getSortByToggleProps()} style={{ width: '100px', cursor: 'pointer' }}>
                                            {column.render("Header")}
                                            {generateSortingIndicator(column)}
                                        </div>
                                        {/* {!column.filter && column.Header !== 'Department' && <Filter column={column} />} */}
                                        {
                                            column.Header === 'Department' ||
                                                column.Header === 'Grade' ||
                                                column.Header === 'EmpStatus' ||
                                                column.Header === 'EmpType' ||
                                                column.Header === 'PayStatus' ?
                                                <SelectDynamicColumnFilter column={column} /> : <Filter column={column} />}

                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()} >
                        {page.map((row, rowIndex) => {
                            prepareRow(row);
                            return (
                                <Fragment key={row.getRowProps().key}>

                                    <tr {...row.getRowProps()}>
                                        {/* it's a custom row number */}
                                        <td>{rowIndex + 1}</td>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td key={cell.column.id} {...cell.getCellProps()}
                                                    className={(typeof cell.value === 'string' ? 'text-start' : cell.column.Header === 'SL') ? 'text-start' : 'text-end'}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {typeof cell.value === 'object' && cell.value !== null
                                                        ? // Handle objects (e.g., for filter options)
                                                        JSON.stringify()
                                                        : cell.render('Cell')}

                                                    {/* {typeof cell.value === 'object' && cell.value !== null ? '' : cell.column.Header.includes('.') ? row.original['P.F. Contribution'] : cell.render('Cell')} */}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                </Fragment>
                            );
                        })}

                    </tbody>
                    <tfoot className=" text-end p-4" >
                        <td className="p-3">

                        </td>
                        {columns.map(column => (
                            <td key={column.id} className="p-3">
                                {/* {
                                    typeof columnSums[column.id] === 'number' ? columnSums[column.id] : ''
                                } */}

                                {typeof columnSums[column.id] === 'number' ? columnSums[column.id].toFixed(2) : ''}


                            </td>
                        ))}
                    </tfoot>
                </Table>

            </div>

            <Row className="justify-content-md-end justify-content-center align-items-center">
                <Col className="col-md-auto">
                    <div className="d-flex gap-1">
                        <Button
                            color="primary"
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                        >
                            {"<<"}
                        </Button>
                        <Button
                            color="primary"
                            onClick={previousPage}
                            disabled={!canPreviousPage}
                        >
                            {"<"}
                        </Button>
                    </div>
                </Col>
                <Col className="col-md-auto d-none d-md-block">
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </Col>
                <Col className="col-md-auto">
                    <Input
                        type="number"
                        min={1}
                        style={{ width: 70 }}
                        max={pageOptions.length}
                        defaultValue={pageIndex + 1}
                        onChange={onChangeInInput}
                    />
                </Col>

                <Col className="col-md-auto">
                    <div className="d-flex gap-1">
                        <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
                            {">"}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                        >
                            {">>"}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

DynamicTable.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default DynamicTable;
