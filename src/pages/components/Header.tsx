import { useEffect, useState } from 'react';
import { deleteUserToken, getUserToken } from "../../utils/utils";


const Header = () => {
	const [authToken, setAuthToken] = useState("");
  
	useEffect(() => {
	  const token: any = getUserToken();
	  if (token) {
		setAuthToken(token);
	  }
	}, []);

	return (
		<header style={{ position:'fixed', zIndex:99, top:0, left:0, width:'100%', height:70, backgroundColor:'#FFFFFF', border:'1px solid #EFEAE5', boxSizing:'border-box', boxShadow:'0px 2px 20px rgba(0, 0, 0, 0.05)'}}>
			<div style={{position:'relative', width:1024, height:70, marginLeft:'auto', marginRight:'auto'}}>
				<a href="" style={{float:"left", marginTop:10}}>
					<img style={{ width: 145, height:40,}} src="../../asset/logo_newopen_white.png"/>
				</a>    
				{authToken ? (
					<div style={{float:'right', width:70, marginTop:22.5}}>
						<a
							style={{font:"Roboto", fontWeight:'bold', fontSize:"15px", color:'#3E3F41', cursor:'pointer'}}
						onClick={(e) => {
							e.preventDefault();
							deleteUserToken();
							window.location.href = "/StoreLogin";
						}}>로그아웃</a>
					</div>
				) : (
					<div/>
				)}
			</div>
		</header>
	);
};

export default Header;
