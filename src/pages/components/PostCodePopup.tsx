import DaumPostcode from 'react-daum-postcode';

const PostCodePopup = ({postCodeSuccess, modalClose} : any) => {

	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100vh',
			backgroundColor: 'rgba(0,0,0,0.4)',
			zIndex: 1,
			}}
			onClick={() => {
				modalClose();
			}}
			>
			<div style={{
				width:'400px',
				height: '80vh',
				marginLeft:'auto',
				marginRight:'auto',
				marginTop:50,
				backgroundColor:'#FFFFFF'
			}}>
				<DaumPostcode
					style={{height:'100%'}}
					onComplete={(data) => {

						let fullAddress = data.address;
						let extraAddress = ''; 
						
						if (data.addressType === 'R') {
						if (data.bname !== '') {
							extraAddress += data.bname;
						}
						if (data.buildingName !== '') {
							extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
						}
						fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
						}

						postCodeSuccess(fullAddress);
					}}
				>
				</DaumPostcode>
			</div>
		</div>
	);
};

export default PostCodePopup;
