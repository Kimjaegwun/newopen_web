import $ from "jquery";
import { gql, useMutation } from "@apollo/client";
import { setUserToken } from "../../utils/utils";
import Modal from "react-modal";
import { useState } from "react";
import Header from "../components/Header";

const SISGN_UP_NEW_OPEN = gql`
  mutation SignUpNewOpen($login_id: String!, $login_pw: String!) {
    SignUpNewOpen(login_id: $login_id, login_pw: $login_pw) {
      ok
      error
      token
    }
  }
`;

const SignUp = () => {
  const [signUpNewOpen] = useMutation(SISGN_UP_NEW_OPEN);

  //아이디 비밀번호 찾기 모달
  const [findModal, setFindModal] = useState(false);

  const onFinish = async () => {
    const loginId = $("#login-id");
    const loginPw = $("#login-pw");
    const loginPwConf = $("#login-pw-conf");

    const loginFail = $("#login-fail");

    loginFail.css("display", "none");

    if (loginId.val() === "") {
      emptyInput("#login-id");
      return;
    }
    if (loginPw.val() === "") {
      emptyInput("#login-pw");
      return;
    }

    if (loginPwConf.val() === "") {
      $("#login-pw-conf-need").text("비밀번호 확인을 입력해주세요.");
      emptyInput("#login-pw-conf");
      return;
    }

    if (loginPw.val() !== loginPwConf.val()) {
      $("#login-pw-conf-need").text(
        "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
      emptyInput("#login-pw-conf");
      return;
    }

    const login_id = loginId.val();
    const login_pw = loginPw.val();

    if (login_id === "" || login_pw === "") {
      return;
    }

    const { data: SignUpNewOpen } = await signUpNewOpen({
      variables: { login_id, login_pw },
    });
    const result = SignUpNewOpen.SignUpNewOpen;

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
    const loginPwConf = $("#login-pw-conf").val();

	if( loginId != '' && loginPw != '' && loginPwConf != ''){
		$("#login-button").css('background-color','#2F80ED');
		$("#login-button").css('color','#FFFFFF');
	}else{
		$("#login-button").css('background-color','#D1D1D1');
		$("#login-button").css('color','#3E3F41');
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
            marginTop: 50,
            marginBottom: 20,
            fontWeight: "bold",
            fontSize: "20px",
            lineHeight: "31px",
            letterSpacing: -1,
            color: "#042045",
            backgroundColor: "#F6F6F6",
          }}
        >
          회원가입
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
          비밀번호 확인
        </div>
        <div style={{ marginTop: 20 }}>
          <input
            id="login-pw-conf"
            type="password"
            style={{ width: 335 }}
            placeholder="비밀번호를 입력하세요"
            onChange={() => fillInput("#login-pw-conf")}
          />
          <span
            id="login-pw-conf-need"
            style={{
              float: "left",
              fontSize: "12px",
              color: "#FF2E4C",
              display: "none",
            }}
          >
            비밀번호 확인을 입력해주세요.
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
            아이디가 중복 되었습니다.
          </span>
          <button
		  	id="login-button"
            className="grey-button"
            style={{ width: 335, cursor: "pointer" }}
            onClick={() => onFinish()}
          >
            가입하기
          </button>
        </div>
        <div className="row" style={{ marginTop: 20, justifyContent:'center' }}>
          <a
            href="/StoreLogin"
            style={{
			  marginTop:2,
              textDecoration: "none",
              fontSize: "13px",
              lineHeight: "15px",
              color: "#3E3F41",
            }}
          >
            로그인 하기
          </a>
          &nbsp;/&nbsp;
          <div
            onClick={() => setFindModal(true)}
            style={{
			  marginTop:2,
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
        <div style={{ textAlign: "center", padding: 20 }}>
          <div
            style={{
              fontSize: "20px",
              color: "#ff2e4c",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            - NewOpen 매니저 -
          </div>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
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
          <div style={{ fontSize: "20px" }}>
            해당 이메일 & 번호로 아이디를 문의 주시면 비밀번호를 최대한
            빠른시간내에 찾아드리겠습니다.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SignUp;
