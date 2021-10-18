import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from "react-router-dom";
import { isMobile } from "react-device-detect";

import "./App.css";
import Main from "./pages/main";

function App() {
  // const [authToken, setAuthToken] = useState("");

  // 비회원 이용 가능
  // useEffect(() => {
  //   const token: any = getUserToken();
  //   if (token) {
  //     setAuthToken(token);
  //   }
  // }, []);

  const main_page = () =>
    !isMobile ? (
      <>
        <Switch>
          <Route exact path="/Join" component={Main} />
        </Switch>
        <Link to="/Join">유저 관리</Link>
      </>
    ) : (
      <div></div>
    );

  return (
    <div className="App">
      <Router>{main_page()}</Router>
    </div>
  );
}

export default App;
