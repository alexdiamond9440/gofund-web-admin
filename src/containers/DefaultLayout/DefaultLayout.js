import React, { Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import { useHistory } from 'react-router';
// sidebar nav config
import { AppRoutes } from "../../Config";
import { ApiHelper } from "../../Helpers/ApiHelper";
// routes config
import routes from "../../routes";
import Loader from "../Loader/Loader";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const  DefaultLayout = () => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  
  const history = useHistory();
  const { location: { pathname } } = history;

  const handleSignOut = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    history.push(AppRoutes.LOGIN);
  }

  const checkAuthentication = async () => {
    try {
      const res = await new ApiHelper().FetchFromServer(
        "/admin",
        "/validate",
        "GET",
        true,
        undefined
      );

      if (!res.isError) {
        setIsLoading(false);
        setIsAuthenticated(true);
        setUser(res.data.data);
      } else {
        localStorage.removeItem("token");
        history.push(AppRoutes.LOGIN);
      }
    } catch (error) {
      localStorage.removeItem("token");
      history.push(AppRoutes.LOGIN);
    }
  };
  
  const handleToggleSidebar = (visible) => {
    setSidebarVisible(visible);
  }
  
  useEffect(() => {
    handleToggleSidebar(false);
  }, [pathname])

  useEffect(() => {
    checkAuthentication();
  }, []);

  if(isLoading) {
    return <Loader />;
  }
    if(!isAuthenticated) {
      return null;
    }

    return (
      <div>
        <AppSidebar onToggle={handleToggleSidebar} visible={sidebarVisible} />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader onLogout={handleSignOut} onToggleSidebar={handleToggleSidebar} sidebarVisible={sidebarVisible} />
        <div className="body flex-grow-1 px-3">
            <Container fluid>
              <Suspense fallback={<Loader />}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={renderProps => <route.component {...renderProps} />}
                      />
                    ) : null;
                  })}
                  <Redirect from={AppRoutes.MAIN} to={AppRoutes.HOME} />
                </Switch>
              </Suspense>
            </Container>
            </div>
           <AppFooter />
          </div>
      </div>
    );
  }

export default DefaultLayout;
