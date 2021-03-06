import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import AuthorizedRoute from './components/fragments/AuthorizedRoute';
import Main from './components/Main';
import Footer from './components/fragments/Footer';
import Header from './components/fragments/Header';
import ActivityAdmin from './components/ActivityAdmin';
import UserAdmin from './components/UserAdmin';
import RoleAdmin from './components/RoleAdmin';
import WorkReporting from './components/WorkReporting';
import WorkReportingSubmission from './components/WorkReportingSubmission';
// import Home from './components/Home';

import addIconsToLibrary from './fontAwesome';
import * as Constants from './Constants';

import '../scss/app.scss';

const App = () => {
  addIconsToLibrary();

  return (
    <Main>
      <BrowserRouter>
        <React.Fragment>
          <Header />
          <Container>
            <Switch>
              {/* <Route path={Constants.PATHS.HOME} exact component={Home} /> */}
              <Route path={Constants.PATHS.HOME} exact>
                <Redirect to={Constants.PATHS.ADMIN_USERS} />
              </Route>
              <AdminRoutes />
              <AuthorizedRoute
                path={Constants.PATHS.WORK_REPORTING}
                requires={Constants.PERMISSIONS.FILE_R}
                userType={Constants.USER_TYPE.BUSINESS}
              >
                <WorkReportingRoutes />
              </AuthorizedRoute>
              <Route path={Constants.PATHS.UNAUTHORIZED} exact component={Unauthorized} />
              <Route path="*" component={NoMatch} />
            </Switch>
          </Container>
          <Footer />
        </React.Fragment>
      </BrowserRouter>
    </Main>
  );
};

const NoMatch = () => {
  return <p>404</p>;
};

const Unauthorized = () => {
  return <p>Unauthorized</p>;
};

const WorkReportingRoutes = () => {
  return (
    <Switch>
      <Route path={Constants.PATHS.WORK_REPORTING} exact component={WorkReporting} />
      <Route path={`${Constants.PATHS.WORK_REPORTING}/:submissionId`} component={WorkReportingSubmission} />
    </Switch>
  );
};

const AdminRoutes = () => {
  return (
    <Switch>
      <Route path={Constants.PATHS.ADMIN} exact component={ActivityAdmin} />

      <AuthorizedRoute
        path={Constants.PATHS.ADMIN_ACTIVITIES}
        requires={Constants.PERMISSIONS.FILE_R}
        userType={Constants.USER_TYPE.INTERNAL}
      >
        <Route path={Constants.PATHS.ADMIN_ACTIVITIES} exact component={ActivityAdmin} />
      </AuthorizedRoute>
      <AuthorizedRoute
        path={Constants.PATHS.ADMIN_USERS}
        requires={Constants.PERMISSIONS.USER_R}
        userType={Constants.USER_TYPE.INTERNAL}
      >
        <Route path={Constants.PATHS.ADMIN_USERS} exact component={UserAdmin} />
      </AuthorizedRoute>
      <AuthorizedRoute
        path={Constants.PATHS.ADMIN_ROLES}
        requires={Constants.PERMISSIONS.ROLE_R}
        userType={Constants.USER_TYPE.INTERNAL}
      >
        <Route path={Constants.PATHS.ADMIN_ROLES} exact component={RoleAdmin} />
      </AuthorizedRoute>
      <Route path={Constants.PATHS.UNAUTHORIZED} exact component={Unauthorized} />
      <Route path="*" component={NoMatch} />
    </Switch>
  );
};

export default App;
