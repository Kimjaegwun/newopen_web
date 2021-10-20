import React from 'react';
import $ from "jquery";

import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import { setUserToken } from '../../utils/utils';

import Header from '../components/Header';
import { Link } from 'react-router-dom';

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

	const onFinish = async () => {
		const loginId = $('#login-id');
		const loginPw = $('#login-pw');
		const loginFail = $('#login-fail');

		loginFail.css("display","none");

		if(loginId.val() == ''){
			emptyInput('#login-id');
		}
		if(loginPw.val() == ''){
			emptyInput('#login-pw');
		}

		const login_id = loginId.val();
		const login_pw = loginPw.val() 

		if(login_id == '' || login_pw== ''){
			return;
		}

		const { data: SignUpNewOpen } = await signUpNewOpen({ variables: { login_id, login_pw }});
		const result = SignUpNewOpen.SignUpNewOpen;

		if (!result.ok) {
			loginFail.css("display","block");

			onFinishFailed(result.error);
			return;
		}

		setUserToken(result.token);
		
		window.location.href = '/InputForm';
	};

	const emptyInput = (id) => {
		const input = $(id);
		const needSpan = $(id + '-need');
		input.css("border", "1px solid #FF2E4C");
		needSpan.css("display","block");
	}

	const fillInput = (id) => {
		const input = $(id);
		const needSpan = $(id + '-need');
		input.css("border", "1px solid #D1D1D1");
		needSpan.css("display","none");

	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<div style={{backgroundColor:'#F6F6F6', paddingTop:70}}>
			<Header/>
			<div style={{width:335, marginLeft:'auto', marginRight:'auto'}}>
				<div style={{marginTop:60, marginBottom:40, fontWeight:'bold', fontSize:"20px", lineHeight:"31px", letterSpacing:-1, color:'#042045', backgroundColor:'#F6F6F6'}}>
					회원가입
				</div>

				<div style={{fontWeight:'bold', fontSize:"13px", lineHeight:"13px", color:'#3E3F41', textAlign:'left'}}>
					아이디
				</div>
				<div style={{marginTop:20}}>
					<input id="login-id" style={{width:335}} placeholder="아이디를 입력하세요" onChange={() =>fillInput('#login-id')}/>
					<span id='login-id-need' style={{float:'left', fontSize:'12px', color:'#FF2E4C', display:'none'}}>
						아이디를 입력해주세요.
					</span>
				</div>
				<div style={{marginTop:25, fontWeight:'bold', fontSize:"13px", lineHeight:"13px", color:'#3E3F41', textAlign:'left'}}>
					비밀번호
				</div>
				<div style={{marginTop:20}}>
					<input id="login-pw" type="password" style={{width:335}} placeholder="비밀번호를 입력하세요" onChange={() =>fillInput('#login-pw')}/>
					<span id='login-pw-need' style={{float:'left', fontSize:'12px', color:'#FF2E4C', display:'none'}}>
						비밀번호를 입력해주세요.
					</span>
				</div>

				<div style={{marginTop:20}}>
					<span id='login-fail' style={{marginBottom:10, float:'left', fontSize:'12px', color:'#FF2E4C', display:'none'}}>
						아이디가 중복 되었습니다.
					</span>
					<button className="grey-button" style={{width:335, cursor:'pointer'}} onClick={() => onFinish()}>가입하기</button>
				</div>
				<div style={{marginTop:20}}>
					<a href="/StoreLogin" style={{textDecoration:'none', fontSize:"13px", lineHeight:"15px", color:'#3E3F41',}}>로그인 하기</a>
					&nbsp;/&nbsp;  
					<a href="/Test" style={{textDecoration:'none', fontSize:"13px", lineHeight:"15px", color:'#3E3F41',}} >아이디 & 비밀번호 찾기</a>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
