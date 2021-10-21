import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { isMobile } from "react-device-detect";
import "./App.css";

import Main from "./pages/main";
import Login from "./pages/Login/Login";
import Join from "./pages/SignUp/SignUp";
import InputForm from "./pages/InputForm/InputForm";

import MainMobile from "./pages/MainMobile";
import { getUserToken } from "./utils/utils";

function App() {
  const [authToken, setAuthToken] = useState(getUserToken());

  //비회원 이용 가능
  useEffect(() => {
    const token: any = getUserToken();
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const LoggedIn = () => (
    <Switch>
      <Route exact path="/" component={!isMobile ? Main : MainMobile} />
      <Route exact path="/StoreLogin" component={Login} />
      <Route exact path="/StoreSignUp" component={Join} />
      <Route exact path="/InputForm" component={InputForm} />
      <Redirect from="*" to="/" />
    </Switch>
  );

  const LoggedOut = () => (
    <Switch>
      <Route exact path="/" component={!isMobile ? Main : MainMobile} />
      <Route exact path="/StoreLogin" component={Login} />
      <Route exact path="/StoreSignUp" component={Join} />
      <Redirect from="*" to="/" />
    </Switch>
  );

  return (
    <div className="App">
      <Router>{authToken ? <LoggedIn /> : <LoggedOut />}</Router>
    </div>
  );
}

export default App;
