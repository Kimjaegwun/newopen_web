import React from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';


const Header = () => {

	return (
		<header style={{position:'fixed', zIndex:999, top:0, left:0, width:'100%', height:70, backgroundColor:'#FFFFFF', border:'1px solid #EFEAE5', boxSizing:'border-box', boxShadow:'0px 2px 20px rgba(0, 0, 0, 0.05)'}}>
			<div style={{position:'relative', height:70, paddingLeft:50, paddingRight:50}}>
				<a href="" style={{float:"left", marginTop:10}}>
					<img style={{ width: 145, height:40,}} src="../../asset/logo_newopen_white.png"/>
				</a>    
			</div>
		</header>
	);
};

export default Header;
