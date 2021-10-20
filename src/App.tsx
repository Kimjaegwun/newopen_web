import { BrowserRouter as Router } from "react-router-dom";
import { isMobile } from "react-device-detect";

import "./App.css";
import Main from "./pages/Main";
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
        <Main />
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
