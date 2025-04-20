import React, { useEffect, useState } from 'react';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { redirect } from 'react-router-dom';
import { Post, REPORT_URL } from '../../utils/https';
import { Container } from 'reactstrap';
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

function AccPartnerAccount() {

  const token = JSON.parse(localStorage.getItem('authKey'))
  const [isLoading, setIsLoading] = useState(true);
  const { userID } = useSelector(state => state.Login.userInformation)


  const cCode = JSON.parse(localStorage.getItem('cCode'))

  // Use the 'onLoad' event of the iframe to detect when the content has loaded
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  //Authorization check
  useEffect(() => {
    authorization(16)
  }, [])


  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="SETUP" breadcrumbItem="Partner / Partner Account" />

        {isLoading && (
          <div className="centered-loader">
            <Loader />
          </div>
        )}

        <iframe title="external-iframe" src={`${REPORT_URL}/AccPartnerAccounts/Index?cCode=${cCode}&auth=${token}&`}
          width="100%" height="1000px"
          onLoad={handleIframeLoad} />
      </Container>
    </div >
  );
}

export default AccPartnerAccount;