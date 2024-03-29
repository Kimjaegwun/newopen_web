import $ from "jquery";
import { gql, useMutation } from "@apollo/client";
import { setUserToken } from "../../utils/utils";
import Modal from "react-modal";
import { useState } from "react";

import Header from "../components/Header";

const NEW_OPEN_LOGIN = gql`
  mutation newOpenLogin($login_id: String!, $login_pw: String!) {
    NewOpenLogin(login_id: $login_id, login_pw: $login_pw) {
      ok
      error
      token
    }
  }
`;

const Login = () => {
  const [newOpenLogin] = useMutation(NEW_OPEN_LOGIN);

  //아이디 비밀번호 찾기 모달
  const [findModal, setFindModal] = useState(false);

  const onFinish = async () => {
    const loginId = $("#login-id");
    const loginPw = $("#login-pw");
    const loginFail = $("#login-fail");

    loginFail.css("display", "none");

    if (loginId.val() === "") {
      emptyInput("#login-id");
    }
    if (loginPw.val() === "") {
      emptyInput("#login-pw");
    }

    const login_id = loginId.val();
    const login_pw = loginPw.val();

    if (login_id === "" || login_pw === "") {
      return;
    }
    const { data: NewOpenLogin } = await newOpenLogin({
      variables: { login_id, login_pw },
    });

    const result = NewOpenLogin.NewOpenLogin;

    if (!result.ok) {
      loginFail.css("display", "block");

      onFinishFailed(result.error);
      return;
    }

    setUserToken(result.token);

    window.location.href = "/InputForm";
  };

  const emptyInput = (id) => {
    const input = $(id);
    const needSpan = $(id + "-need");
    input.css("border", "1px solid #FF2E4C");
    needSpan.css("display", "block");
  };

  const fillInput = (id) => {
    const input = $(id);
    const needSpan = $(id + "-need");
    input.css("border", "1px solid #D1D1D1");
    needSpan.css("display", "none");

    const loginId = $("#login-id").val();
    const loginPw = $("#login-pw").val();

    if (loginId !== "" && loginPw !== "") {
      $("#login-button").css("background-color", "#2F80ED");
      $("#login-button").css("color", "#FFFFFF");
    } else {
      $("#login-button").css("background-color", "#D1D1D1");
      $("#login-button").css("color", "#3E3F41");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{ backgroundColor: "#F6F6F6", paddingTop: 70, height: "100vh" }}
    >
      <Header logout={false} />
      <div style={{ width: 335, marginLeft: "auto", marginRight: "auto" }}>
        <div
          style={{
            marginTop: 60,
            marginBottom: 40,
            fontWeight: "bold",
            fontSize: "20px",
            lineHeight: "31px",
            letterSpacing: -1,
            color: "#042045",
            backgroundColor: "#F6F6F6",
          }}
        >
          이제막 오픈한 내가게!
          <br />
          어디에 처음 홍보해야 할 지 막막하신가요?
        </div>

        <div
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            lineHeight: "13px",
            color: "#3E3F41",
            textAlign: "left",
          }}
        >
          아이디
        </div>
        <div style={{ marginTop: 20 }}>
          <input
            id="login-id"
            style={{ width: 335 }}
            placeholder="아이디를 입력하세요"
            onChange={() => fillInput("#login-id")}
          />
          <span
            id="login-id-need"
            style={{
              float: "left",
              fontSize: "12px",
              color: "#FF2E4C",
              display: "none",
            }}
          >
            아이디를 입력해주세요.
          </span>
        </div>
        <div
          style={{
            marginTop: 25,
            fontWeight: "bold",
            fontSize: "13px",
            lineHeight: "13px",
            color: "#3E3F41",
            textAlign: "left",
          }}
        >
          비밀번호
        </div>
        <div style={{ marginTop: 20 }}>
          <input
            id="login-pw"
            type="password"
            style={{ width: 335 }}
            placeholder="비밀번호를 입력하세요"
            onChange={() => fillInput("#login-pw")}
          />
          <span
            id="login-pw-need"
            style={{
              float: "left",
              fontSize: "12px",
              color: "#FF2E4C",
              display: "none",
            }}
          >
            비밀번호를 입력해주세요.
          </span>
        </div>

        <div style={{ marginTop: 20 }}>
          <span
            id="login-fail"
            style={{
              marginBottom: 10,
              float: "left",
              fontSize: "12px",
              color: "#FF2E4C",
              display: "none",
            }}
          >
            아이디 혹은 비밀번호가 잘못 입력되었습니다.
          </span>
          <button
            id="login-button"
            className="grey-button"
            style={{ width: 335, cursor: "pointer" }}
            onClick={() => onFinish()}
          >
            로그인 하기
          </button>
        </div>
        <div
          className="row"
          style={{ marginTop: 20, justifyContent: "center" }}
        >
          <a
            href="/StoreSignUp"
            style={{
              marginTop: 2,
              textDecoration: "none",
              fontSize: "13px",
              lineHeight: "15px",
              color: "#3E3F41",
            }}
          >
            가입하기
          </a>
          &nbsp;/&nbsp;
          <div
            onClick={() => setFindModal(true)}
            style={{
              marginTop: 2,
              textDecoration: "none",
              fontSize: "13px",
              lineHeight: "15px",
              color: "#3E3F41",
              cursor: "pointer",
            }}
          >
            아이디 & 비밀번호 찾기
          </div>
        </div>
      </div>

      <Modal
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            width: "550px",
          },
        }}
        isOpen={findModal}
        onRequestClose={() => setFindModal(false)}
        ariaHideApp={false}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <div
              style={{
                width: 22,
                height: 22,
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: 5,
                cursor: "pointer",
                font: "Spoqa Han Sans Neo",
                fontWeight: "bold",
                fontSize: "20px",
                color: "#2D2D2D",
              }}
              onClick={() => setFindModal(false)}
            >
              X
            </div>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: "20px",
              color: "#ff2e4c",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            - NewOpen 매니저 -
          </div>
          <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: 50 }}>
            이준(Jun.lee@tierjay.com 010-5755-2801)
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            최석현(SukHyun.choi@tierjay.com 010-2258-1675)
          </div>
          <div style={{ fontSize: "18px", marginTop: 50 }}>
            해당 이메일 & 번호로 아이디를 문의 주시면
            <br />
            비밀번호를 최대한빠른시간내에 찾아드리겠습니다.
          </div>
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                width: 175,
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: 15,
                paddingBottom: 15,
                backgroundColor: "#2F80ED",
                borderRadius: 5,
                cursor: "pointer",
                font: "Spoqa Han Sans Neo",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#FFFFFF",
              }}
              onClick={() => setFindModal(false)}
            >
              닫기
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
