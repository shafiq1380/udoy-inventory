import React, { useEffect } from "react";
import { Container, Row } from "reactstrap";

//import component
import CardUser from "./CardUser";
import Settings from "./Settings";
import Posts from "./Posts";
import Comments from "./Comments";
import TapVisitors from "./TapVisitors";
import Activity from "./Activity";
import PopularPost from "./PopularPost";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { authorization } from "../../components/Common/Authorization";

const index = () => {

  //meta title
  // document.title = "Blog Dashboard | Skote - Vite React Admin & Dashboard Template";


  //Authorization check
  useEffect(() => {
    authorization(4)
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Dashboards" breadcrumbItem="Blog" />
          <Row>
            {/* card user */}
            {/* <CardUser dataColors='["--bs-primary", "--bs-warning"]' /> */}
            {/* <Settings /> */}
          </Row>
          {/* <Row>
            <Posts />
            <Comments />
            <TapVisitors />
          </Row> */}
          <Row>
            {/* {" "}
            <Activity />
            <PopularPost /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default index;
