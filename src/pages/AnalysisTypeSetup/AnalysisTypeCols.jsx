import React from "react";
import { Link } from "react-router-dom";

const ID = (cell) => {
  return (
    <Link to="#" className="text-body fw-bold">
      {cell.value ? cell.value : ""}
    </Link>
  );
};

const AnalysisName = (cell) => {
  return cell.value ? cell.value : "";
};

const AnalysisStatus = (cell) => {
  return cell.value ? cell.value : "";
};

export { ID, AnalysisName, AnalysisStatus };
