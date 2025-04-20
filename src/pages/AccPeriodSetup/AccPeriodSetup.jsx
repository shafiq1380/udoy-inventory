import React, { useEffect, useState } from 'react';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from 'axios';
import { useSelector } from 'react-redux';

import { REPORT_URL } from '../../utils/https';
import { authorization } from '../../components/Common/Authorization';


function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

function AccPeriodSetup() {

  const token = JSON.parse(localStorage.getItem('authKey'))
  const cCode = JSON.parse(localStorage.getItem('cCode'))
  const [isLoading, setIsLoading] = useState(true);

  const { userID } = useSelector(state => state.Login.userInformation)



  //Authorization check
  useEffect(() => {
    authorization(49)
  }, [])

  // const url = `${REPORT_URL}/AccPeriodSetups/Index?cCode=${cCode}&auth=${token}`
  // console.log(url)

  // Use the 'onLoad' event of the iframe to detect when the content has loaded
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  return (
    <div className="page-content">
      <Breadcrumbs title="SETUP" breadcrumbItem="Voucher / Period Setup" />

      {isLoading && (
        <div className="centered-loader">
          <Loader />
        </div>
      )}

      <iframe title="external-iframe" src={`${REPORT_URL}/AccPeriodSetups/Index?cCode=${cCode}&auth=${token}`}
        width="100%" height="1000px"
        onLoad={handleIframeLoad} />

    </div >
  );
}

export default AccPeriodSetup;