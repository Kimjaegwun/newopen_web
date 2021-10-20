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
          <Route exact path="/" component={Main}/>
          <Route exact path="/StoreLogin" component={Login}/>
          <Route exact path="/StoreSignUp" component={Join}/>
          <Route exact path="/InputForm" component={InputForm}/>
          <Redirect from="*" to="/" />
        </Switch>
      </>
    ) : (
      <>
        <MainMobile />
      </>
    );

  return (
    <div className="App">
      <Router>{main_page()}</Router>
    </div>
  );
}

export default App;
