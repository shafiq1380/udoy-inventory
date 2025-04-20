

import React, { useEffect, useState } from 'react';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Post } from '../../utils/https';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { authorization } from '../../components/Common/Authorization';

function VoucherFromBusiness() {
  const [excelData, setExcelData] = useState([]);


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(data);

      try {
        const adata = {
          data: data
        }
        Post('/api/VoucherEntry/UploadVoucher', adata).then((resp) => {
          console.log(resp);
          setapirespMsg(resp.data.errorMessage);

        })

      } catch (error) {
        console.log(error)
      }


      setExcelData(data);
    };

    reader.readAsBinaryString(file);
  };


  //Authorization check
  useEffect(() => {
    authorization(21)
  }, [])

  return (
    <div className="page-content">
      <Breadcrumbs title="Voucher" breadcrumbItem="Voucher / Voucher Upload" />
      <div>

        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        <table className="table table-striped table-bordered table-sm" >
          <thead>
            <tr>
              {excelData[0] &&
                excelData[0].map((cell, index) => <th key={index}>{cell}</th>)}
            </tr>
          </thead>
          <tbody>
            {excelData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {(() => {
                  const cells = [];
                  for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
                    const cell = row[cellIndex];
                    cells.push(
                      <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
                    );
                  }
                  return cells;
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VoucherFromBusiness;
