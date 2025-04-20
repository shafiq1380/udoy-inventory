import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const AuthMiddleware = (props) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    const authTimestamp = localStorage.getItem("authTimestamp");

    if (authUser && authTimestamp) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(authTimestamp, 10);
      const oneMinuteInMillis = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

      if (elapsedTime <= oneMinuteInMillis) {
        setUserLoggedIn(true);
        const intervalId = setInterval(() => {
          checkExpiration();
        }, 50000); // Check expiration every 50 seconds

        return () => {
          clearInterval(intervalId);
        };
      } else {
        clearLocalStorageAndRedirect();
      }
    } else {
      redirectToLogin();
    }
  }, []);

  const checkExpiration = () => {
    const authTimestamp = localStorage.getItem("authTimestamp");
    if (authTimestamp) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(authTimestamp, 10);
      const oneMinuteInMillis = 8 * 60 * 60 * 1000; // 1 minute in milliseconds

      if (elapsedTime > oneMinuteInMillis) {
        clearLocalStorageAndRedirect();
      }
    }
  };

  const redirectToLogin = () => {
    // Redirect the user to the login page
    window.location.href = "/login"; // You can change this to your actual login URL
  };

  const clearLocalStorageAndRedirect = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authTimestamp");
    localStorage.removeItem('userID');
    localStorage.removeItem('cCode');
    localStorage.removeItem('authKey');
    localStorage.removeItem('voucherType');
    localStorage.removeItem('module');
    localStorage.removeItem('i18nextLng');
    localStorage.removeItem('cName');
    localStorage.removeItem('nodeList');
    localStorage.removeItem('_grecaptcha');
    localStorage.removeItem('I18N_LANGUAGE');
    redirectToLogin();
  };

  return (
    <React.Fragment>
      {userLoggedIn ? props.children : null}
    </React.Fragment>
  );
};
AuthMiddleware.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AuthMiddleware;
