import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.scss";
import { HeaderBar } from "./components";
import { Home, PostMovie } from "./containers";
import { AuthContext, getUserData, useAuthenActions } from "./shared";

const PrivateRoute = ({ children, ...rest }) => {
  const { isSignIn } = useAuthenActions();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isSignIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const App = () => {
  const [, dispatch] = useContext(AuthContext);

  useEffect(() => {
    const userData = getUserData();

    if (userData) {
      dispatch({
        type: "signin",
        payload: {
          userData,
        },
      });
    }
  }, [dispatch]);
  return (
    <Router>
      <div className="app-container">
        <HeaderBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <PrivateRoute path="/post-movie">
            <PostMovie />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
