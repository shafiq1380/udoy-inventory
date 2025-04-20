import React from "react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import { Badge } from "reactstrap";

const formateDate = (date, format) => {
  const dateFormat = format ? format : "DD MMM Y";
  const date1 = moment(new Date(date)).format(dateFormat);
  return date1;
};

const DateFormate = (cell) => {
  const date = cell?.value?.split('T')[0].split('-').reverse().join('/');
  return cell.value ? date : "";
}

const toLowerCase1 = (str) => {
  return str === "" || str === undefined ? "" : str.toLowerCase();
};

const UserID = (cell) => {
  return (
    <Link to="#" className="text-body fw-bold">
      {cell.value ? cell.value : ""}
    </Link>
  );
};

const UserName = (cell) => {
  return cell.value ? cell.value : "";
};

const MobileNumber = (cell) => {
  return cell.value ? cell.value : "";
};
const UserNID = (cell) => {
  return cell.value ? cell.value : "";
};
const UserEmail = (cell) => {
  return (
    <div >
      {cell.value}
    </div>
  );
};

const UserStatus = (cell) => {
  return (
    <div >
      {
        cell.value === 1 ? <Badge color="success">Active</Badge> :
          cell.value === 0 ? <Badge color="danger">Inactive</Badge> :
            cell.value === null ? <Badge color="danger">Not Assigned</Badge> :
              <Badge color="danger">Not Assigned</Badge>
      }
    </div>
  );
};

const AllowanceStatus = (cell) => {
  return (
    <div>
      {
        cell.value === 1 ? <Badge color="primary">Saved</Badge> :
          cell.value === 2 ? <Badge color="success">Post</Badge> :
            cell.value === 0 ? <Badge color="danger">Not Assigned</Badge> :
              <Badge color="danger">Not Assigned</Badge>
      }
    </div>
  );
};

const CustomStatus = (cell) => {
  return (
    <div >
      {
        cell.value === 1 ? <Badge color="success">Save</Badge> :
          cell.value === 2 ? <Badge color="danger">Post</Badge> :
            cell.value === null ? <Badge color="danger">Not Assigned</Badge> :
              <Badge color="danger">Not Assigned</Badge>
      }
    </div>
  );
};

const ActiveStatus = (cell) => {
  return (
    <div >
      {
        cell.value === true ? <Badge color="success">Active</Badge> : <Badge color="danger">Inactive</Badge>
      }
    </div>
  );
};

const OpenStatus = (cell) => {
  return (
    <div >
      {
        cell.value === 1 ? <Badge color="success">Open</Badge> : <Badge color="danger">Close</Badge>
      }
    </div>
  );
};

const ExpensesType = (cell) => {
  return (
    <div>
      {
        cell.value === 1 ? "Factory" :
          cell.value === 2 ? "Administration" :
            cell.value === 3 ? "Selling & Distribution" :
              cell.value === null && ""
      }
    </div>
  );
};


const PaymentMethod = (cell) => {
  return (
    <span>
      <i
        className={
          cell.value === "Paypal"
            ? "fab fa-cc-paypal me-1"
            : "" || cell.value === "COD"
              ? "fab fas fa-money-bill-alt me-1"
              : "" || cell.value === "Mastercard"
                ? "fab fa-cc-mastercard me-1"
                : "" || cell.value === "Visa"
                  ? "fab fa-cc-visa me-1"
                  : ""
        }
      />{" "}
      {cell.value}
    </span>
  );
};
export {
  UserID, UserName, UserEmail,
  MobileNumber, UserNID, PaymentMethod,
  UserStatus, ActiveStatus, CustomStatus,
  OpenStatus, DateFormate, AllowanceStatus, ExpensesType
};
// export { UserID, UserName, UserEmail, MobileNumber, UserNID, PaymentMethod, UserStatus, ActiveStatus, OpenStatus };
