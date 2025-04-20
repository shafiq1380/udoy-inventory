import React, { useEffect, useMemo } from 'react'
import { authorization } from '../../../components/Common/Authorization'
import { Button, Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import TableContainer from '../../../components/Common/TableContainer'
import { UserID, UserName, DateFormate, AllowanceStatus } from '../../UserList/UserCol'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllowanceListsByTypeRequest } from '../../../store/allowance-types-store/actions'


const OvertimeAllowance = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllowanceListsByTypeRequest(1));
  }, [dispatch]);

  const { loading, allowanceListsByType, error } = useSelector(state => state.allowanceListsByTypeReducer);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        width: 150,
        filterable: true,
        Cell: (cellProps) => {
          return <UserID {...cellProps} />
        },
      },
      {
        Header: "Date",
        accessor: "allowDate",
        filterable: true,
        Cell: (cellProps) => {
          return <DateFormate {...cellProps} />;
        },
      },
      {
        Header: "Title",
        accessor: "allowTitle",
        filterable: true,
        Cell: (cellProps) => {
          return <UserName {...cellProps} />;
        },
      },
      {
        Header: "Voucher ID",
        accessor: "voucherID",
        filterable: true,
        Cell: (cellProps) => {
          return <UserName {...cellProps} />;
        },
      },
      {
        Header: "Update Date",
        accessor: "updateDate",
        filterable: true,
        Cell: (cellProps) => {
          return <DateFormate {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "allowStatus",
        filter: 'select',
        width: 200,
        Cell: (cellProps) => {
          return <AllowanceStatus {...cellProps} />;
        },
      },
      {
        Header: "View Details",
        accessor: "",
        disableFilters: true,
        Cell: (otList) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => viewOt(otList.row.original)}
            >
              View Details
            </Button>
          );
        },
      },
      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: (otList) => {

          // console.log("otList", otList.row.original)

          return (
            <div className="d-flex gap-3">
              {
                otList.row.original.allowStatus === 1 ?
                  <>
                    <FaEdit
                      id="edittooltip"
                      size={18}
                      className="text-success cursor-pointer"
                      onClick={() => editOt(otList.row.original)}
                    />
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      Edit
                    </UncontrolledTooltip>
                  </>
                  : null
              }
            </div>
          );
        },
      },
    ],
    []
  );

  const createOT = () => {
    navigate('/createOT')
  };

  const editOt = (otInfo) => {
    // console.log("otInfo", otInfo)
    navigate('/ot-edit', { state: otInfo })
  };

  const viewOt = (otInfo) => {
    // console.log("OT Info", otInfo)
    navigate('/ot-details', { state: otInfo })
  };

  useEffect(() => {
    authorization(94)
  }, [])


  return (
    <div className='page-content'>
      <Container fluid>
        <Breadcrumbs title="Transaction" breadcrumbItem="Overtime Allowance" />
        <div className="container-fluid">
          {
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={allowanceListsByType.reverse()}
                      isGlobalFilter={true}
                      isAddUserList={true}
                      customPageSize={100}
                      className="custom-header-css"
                      onClickBtn={createOT}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          }
        </div>

      </Container>
    </div>
  )
}

export default OvertimeAllowance