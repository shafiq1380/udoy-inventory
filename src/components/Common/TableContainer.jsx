/* eslint-disable react/prop-types */
import React, { Fragment, useEffect, useState } from "react";
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
import { Filter, DefaultColumnFilter, SelectColumnFilter, CustomColumnFilter } from "./filters";

// make the csv and pdf 
import { CSVLink } from "react-csv";
import CustomSpinner from "./CustomSpinner";

//icon for sync data
import { FaSync } from "react-icons/fa";

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

const TableContainer = ({
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
  excelDownload,
  syncbtn,
  handleSyncData
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
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
          },
        ],
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




  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 7000);
    // console.log("anup")
  }, [])


  // console.log(page)

  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={customPageSizeOptions ? 2 : 1}>
          {/* <select
            className="form-select"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
        </Col>
        {/* export to excel and pdf */}


        {/* make pdf  */}
        {/* <Button
              type="button"
              color="success"
              className="btn-rounded mt-2 mt-md-0 mx-md-2"
            // onClick={() => generatePDF(pdfRows, pdfColoumData)}
            >
              Make PDF
            </Button> */}


        {
          showbtn &&
          <Col sm="11 d-flex justify-content-end ">
            <div className=" mt-0 mt-md-0">
              <Button
                type="button"
                color="primary"
                className="btn-rounded  mb-1 me-2"
              >
                <CSVLink data={data} className="text-white" filename="BSEC">Export to Excel</CSVLink>
              </Button>
            </div>

            <div className="text-sm-end mt-0 mt-md-0">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-1 me-2 "
                onClick={onClickBtn}
              >
                <i className="mdi mdi-plus me-1 display-7 " />
                Create New
              </Button>
            </div>
          </Col>

        }

        {/* {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )} */}

        {
          !showbtn && !hidden &&
          <Col sm="11 d-flex justify-content-end">
            <div className=" mt-2 mt-md-0">
              {
                exbtn &&
                <div className=" mt-2 mt-md-0">
                  <Button
                    type="button"
                    color="primary"
                    className="btn-rounded  mb-2 me-2"
                    onClick={excelDownload}
                  >
                    Export to Excel
                  </Button>
                </div>
              }
            </div>

            <div className="text-sm-end mt-2 mt-md-0">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-1 me-2"
                onClick={onClickBtn}
              >
                <i className="mdi mdi-plus me-1" />
                Create New
              </Button>
            </div>
          </Col>


        }

        {
          exbtn &&
          <div className=" mt-2 mt-md-0">
            <Button
              type="button"
              color="primary"
              className="btn-rounded  mb-2 me-2"
              onClick={excelDownload}
            >
              Export to Excel
            </Button>
          </div>
        }

        {
          syncbtn &&
          <Col sm="11 d-flex justify-content-start">
            <div className=" mt-2 mt-md-0">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-1 me-2"
                onClick={handleSyncData}
              >
                Sync Data
                <FaSync className="ms-2 " />
              </Button>
            </div>

          </Col>

        }
      </Row>


      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} className="p-2" >
                    <div className="mb-1" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    {!column.filter && <Filter column={column} />}
                    {column.filter && <SelectColumnFilter column={column} />}
                    {column.cutmFilter && <CustomColumnFilter column={column} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {
            page?.length > 0 ?
              <tbody {...getTableBodyProps()} >
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr>
                        {row.cells.map((cell) => {
                          return (
                            <td key={cell.id} {...cell.getCellProps()} className="p-1">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody> : !loading ?
                <td colSpan={headerGroups[0].headers.length}>
                  <div className="flex justify-center w-full">
                    <p className='text-center text-muted fs-3 p-3'>No Data Found</p>
                  </div>
                </td>
                :
                <tr>
                  <td colSpan={headerGroups[0].headers.length}>
                    <div className="flex justify-center w-full">
                      <CustomSpinner />
                    </div>
                  </td>
                </tr>
          }
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

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
