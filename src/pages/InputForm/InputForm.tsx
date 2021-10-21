import { useState } from 'react';
import $ from "jquery";
import { useMutation, useQuery } from '@apollo/client';

import {GET_NEW_OPEN, NEW_OPEN_ID_CHECK, UPDATE_NEW_OPEN, ADD_NEW_OPEN} from "./mutation.gql";

import Header from '../components/Header'
import DatePickerComponent from '../components/DatePickerComponent';
import PostCodePopup from '../components/PostCodePopup';

import produce from "immer";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3RefxDfDrGzTSsLo4ImBctzq47cLCe-k",
  authDomain: "new-open-35265.firebaseapp.com",
  projectId: "new-open-35265",
  storageBucket: "new-open-35265.appspot.com",
  messagingSenderId: "30351952784",
  appId: "1:30351952784:web:4b607e70fc7bc726198115",
  measurementId: "G-LQ51CYZDVV"
};


const InputForm = () => {
	const [newOpen, setNewOpen] = useState({} as any);

	const [flag, set_flag] = useState(false);
	const flag_change = () => {
	  set_flag(!flag);
	};

	//영업시간 드롭다운
	const [operation_visible, set_operation_visible] = useState(false);

	// 메뉴 사진 모달
	const [menu_modal, set_menu_modal] = useState(false);
	const close_menu_modal = () => {
		set_menu_modal(false);
		flag_change()
	};

	// 쿠폰 모달
	const [coupon_modal, set_coupon_modal] = useState(false);
	const close_coupon_modal = () => {
		set_coupon_modal(false);
		flag_change()
	};

  // New Open 정보 가져오기
  const { refetch } = useQuery(GET_NEW_OPEN, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
		const newOpenData = data.GetNewOpen.new_open;
		setNewOpen(newOpenData);

		const business_hours = newOpenData.business_hours;
		if(business_hours){
			setBusinessHours(business_hours);
		}

		const menu = newOpenData.menu;
		if(menu){
			setMenuList(menu);
		}

		const newOpenEvent = newOpenData.new_open_event;
		if(newOpenEvent){
			setEventList(newOpenEvent);
		}
    },
  });

	// 주소 팝업창
    const [postCodePopup, setPostCodePopup] = useState(false)
    const modalClose = () => {
        setPostCodePopup(false);
    }
	const postCodeSuccess = (data) => {
		setNewOpen(
			produce((draft: any) => {
				draft.address = data;
			})
		);
        setPostCodePopup(false);
	}

	// 가게 전화번호
    const [storeNumber, setStoreNumber] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

	// 영업 시간
	const [businessHours, setBusinessHours] = useState([
		{ number:1, day:'월', start_hour:'00:00', end_hour:'00:00', closed:true},
		{ number:2, day:'화', start_hour:'00:00', end_hour:'00:00', closed:true},
		{ number:3, day:'수', start_hour:'00:00', end_hour:'00:00', closed:true},
		{ number:4, day:'목', start_hour:'00:00', end_hour:'00:00', closed:true},
		{ number:5, day:'금', start_hour:'00:00', end_hour:'00:00', closed:true},
		{ number:6, day:'토', start_hour:'00:00', end_hour:'00:00', closed:true},
		{ number:0, day:'일', start_hour:'00:00', end_hour:'00:00', closed:true},
	]);

	// 메뉴 정보
	const [menuList, setMenuList] = useState([] as any);
	const [newMenuPhoto, setNewMenuPhoto] = useState([] as any);

	// 혜택 정보
	const [evnetList, setEventList] = useState([] as any);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	//DataPicker Callback 함수
	const setEventStartDate = (data, idx) => {
		setEventList(
		  produce((draft: any) => {
			draft[idx].start_date = data;
		  })
		);
	}

	const setEventEndDate = (data, idx) => {
		setEventList(
		  produce((draft: any) => {
			draft[idx].end_date =data;
		  })
		);
	}

	const setOpenDate = (data) => {
		setNewOpen(
			produce((draft: any) => {
			  draft.open_date = data;
			})
		);
	}


	// firebase 사진 올리기
	const uploadPhotoToFB = (image: any, filesName: any, place: any, index?: any, index_detail?: any) => {
		if (!firebase.apps?.length) {
			firebase.initializeApp(firebaseConfig);
		}else{
			firebase.app(); // if already initialized, use that one
		}
	    const storage = firebase.storage();
	    const uploadTask = storage.ref(`/${newOpen.login_id}/${filesName}`).put(image);
	    if (place === "logo") {
		  uploadTask.on("state_changed", console.log, console.error, () => {
			uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
			  setNewOpen(
				produce((draft: any) => {
					draft.logo = url;
				})
			  );
			});
		  });
		}else if (place === "photo_in_mall") {
			uploadTask.on("state_changed", console.log, console.error, () => {
			  uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
				  if(!newOpen.photo_in_mall){
					setNewOpen(
						produce((draft: any) => {
						  draft.photo_in_mall =[url];
						})
					  );	  
				  }else{
					setNewOpen(
						produce((draft: any) => {
						  draft.photo_in_mall.push(url);
						})
					  );	  
				  }
			  });
			});
		}else if (place === "menu_photo") {
			uploadTask.on("state_changed", console.log, console.error, () => {
				uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
					const newMenuPhoto = {url: url, fileName: filesName.replace('MenuPhoto/','')}
					setMenuList(
						produce((draft: any) => {
							draft[index].photo.push(newMenuPhoto);
						})
					);
				});
			});
		}else if (place === "newMenu_photo") {
			uploadTask.on("state_changed", console.log, console.error, () => {
				uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
					const newMenuPhoto = {image:image, url: url, fileName: filesName.replace('MenuPhoto/','')}
					setNewMenuPhoto(
						produce((draft: any) => {
							draft.push(newMenuPhoto);
						})
				);
				});
			});
		}
	};

	
	const [newOpenIdCheck] = useMutation(NEW_OPEN_ID_CHECK);
	const [updateNewOpen] = useMutation(UPDATE_NEW_OPEN);

	const checkValue = (id) => {
		const component = $("#"+id);
		const componentVal = component.val();
		if(id == "business-type"){
			const detail = $("#business-type-detail");
			if(componentVal == "기타" && !detail.val() ){
				detail.focus();
			}
		}
		if(!component.val()){
			component.focus();
			return false;
		}
		return true;
	}

	const submitUpdateNewOpen = async () =>{
		if(!newOpen?.logo){
			$('html, body').animate({scrollTop : 100}, 100);
			return;
		}

		const idList = ["business-type", "brand-name", "address", "address-detail", "phone-number"];
		for(let i=0; i< idList.length; i++){
			if(!checkValue(idList[i])){
				return;
			}
		}
		
		if(!newOpen.photo_in_mall || newOpen.photo_in_mall.length == 0){
			$('html, body').animate({scrollTop : 300}, 100);
			return;
		}

		const { data: UpdateNewOpen } =
			await updateNewOpen({
				variables:{
					updateNewOpenData: {
						logo: newOpen.logo,
						business_type: newOpen.business_type,
						business_type_detail: newOpen.business_type_detail,
						brand_name: newOpen.brand_name,
						address: newOpen.address,
						address_detail: newOpen.address_detail,
						description: newOpen.description,
						store_number: newOpen.store_number,
						business_hours: businessHours,
						photo_in_mall: newOpen.photo_in_mall,
						menu: menuList,
						newOpenEvent: evnetList,
						open_date: newOpen.open_date,
						phone_number: newOpen.phone_number,
					}
				}
			})
		const result = UpdateNewOpen.UpdateNewOpen;

		if (!result.ok) {
			console.log(result)
			return;
		}
	}

	return (
		<div style={{backgroundColor:'#F6F6F6', paddingTop:70}}>
			<Header/>
			<div style={{width:1024, marginLeft:'auto', marginRight:'auto', marginTop:30, marginBottom:5, fontWeight:'bold', fontSize:"16px", lineHeight:"24px", textAlign:'left'}}>미리보기</div>

			{/* 입력폼 */}
			<div style={{ width:1024, marginTop:30, marginLeft:'auto', marginRight:'auto', border:"1px solid #E2E2E2", boxSizing:'border-box', borderRadius:10, backgroundColor:'#FFFFFF',
				paddingTop:50,
				paddingBottom:50,
				paddingLeft:82,
				paddingRight:82,
				display: "flex",
				alignItems: "flex-start",
				marginBottom: 10,
				whiteSpace:'nowrap',}}>
				<div style={{width:380, textAlign:'left', marginRight:100}}>
					{/* 로고 */}
					<div className={'input-title'}>
						1. 로고(필수, 1장)
					</div>
					<div id="logo-div" style={{marginTop:7}} tabIndex={0}>
						{!newOpen?.logo ?(
							<label style={{cursor:'pointer'}}>
								<input
								style={{ display:'none' }}
								type="file"
								onChange={(e: any) => {
									uploadPhotoToFB(e.target.files[0], "LogoImage/" +e.target.files[0].name, "logo");
								}}
								accept="image/png, image/jpeg"
								/>
								<img src={'../../../asset/button_image_add.png'} style={{width:65, height:65, borderRadius:35, overflow:'hidden'}}></img>
							</label>
						): (
							<div style={{
								display: "flex",
								alignItems: "flex-start",
								whiteSpace:'nowrap',
								}}>
								<a
								href={newOpen?.logo?.url}
								target="_blank"
								rel="noreferrer"
								style={{width:65, height:65, borderRadius:65, overflow:'hidden', border:'1px solid black'}}
								>
									<img
										className="image"
										src={newOpen?.logo}
										style={{width:65, height:65 }}
										alt="썸네일"
									/>
								</a>
								<div>
								<button className="image-delete-button" style={{marginLeft:-10, marginTop:-10, backgroundImage:"url('/asset/button_image_delete.png')"}}
									onClick={() => {
										setNewOpen(
										  produce((draft: any) => {
											draft.logo = null;
										  })
										);
									}}/>
								</div>
							</div>
						)}
					</div>

					{/* 업종 */}
					<div className={'input-title'}>
						2.업종 (필수)
					</div>
					<div>
						<select id="business-type" placeholder="선택하세요" style={{width:'100%', height:40, marginTop:10}} value={!newOpen?.business_type ? '' : newOpen?.business_type}
							onChange={(data) => {
								const businessType = data.target.value;
								if(businessType == '기타'){
									$('#business-type-detail-div').css('display','block')
									setNewOpen(
										produce((draft: any) => {
											draft.business_type = '';
										})
									);
								}else{
									$('#business-type-detail-div').css('display','none')
									setNewOpen(
										produce((draft: any) => {
											draft.business_type = businessType;
										})
									);
								}
							}}>
							<option key="">선택</option>
							<option key="밥집">밥집</option>
							<option key="술집">술집</option>
							<option key="카페">카페</option>
							<option key="네일&속눈썹">네일&속눈썹</option>
							<option key="헤어샵">헤어샵</option>
							<option key="기타">기타</option>
						</select>
						<div id="business-type-detail-div" style={{display:'none'}}>
							<input id="business-type-detail" placeholder="업종을 알려주세요" style={{width:'100%', marginTop:7}}
								onChange={(e) => {
									setNewOpen(
										produce((draft: any) => {
											draft.business_type_detail = e.target.value;
										})
									);	
								}}/>
						</div>
					</div>

					{/* 상호명 */}
					<div className={'input-title'}>
						3. 상호명(필수)
					</div>
					<div>
						<input id="brand-name" placeholder="상호명을 입력하세요" style={{width:'100%', marginTop:7}} value={ !newOpen?.brand_name ? '' : newOpen.brand_name}
							onChange={ (e) => {
								setNewOpen(
									produce((draft: any) => {
										draft.brand_name = e.target.value;
									})
								);
							}}/>
					</div>

					{/* 사업장 주소 */}
					<div className={'input-title'}>
						4. 사업장 주소(필수)
					</div>
					<div style={{marginTop:5}}>
						<span className="span-info" >고객이 지도에서 검색할 수 있는 정확한 위치를 입력해주세요</span>
					</div>
					<div style={{marginTop:7}}>
						<input id="address" placeholder="사업장 주소를 입력하세요" style={{width:'100%', marginTop:7}} readOnly value={ !newOpen?.address ? '' : newOpen?.address}/>
						<button className="primary-button" style={{marginLeft:-58, paddingTop:8, paddingBottom:8, paddingLeft:15, paddingRight:15}}
							onClick= {() => {
								setPostCodePopup(true);
							}}>
							검색
						</button>
						<div>
						<input id="address-detail"  placeholder="나머지 주소" style={{width:'100%', marginTop:7}} value={ !newOpen?.address_detail ? '' : newOpen?.address_detail}
							onChange={ (e) => {
								setNewOpen(
									produce((draft: any) => {
										draft.address_detail = e.target.value;
									})
								);
							}}/>
						</div>
					{postCodePopup === true ? <PostCodePopup postCodeSuccess={postCodeSuccess} modalClose={modalClose} /> : <div />}
					</div>

					{/* 가게 설명 */}
					<div className={'input-title'}>
						5. 가게 설명
					</div>
					<div>
						<textarea id="description" placeholder="고객에 어필할 수 있는 짧은 홍보글을 입력하세요" wrap="off" style={{resize:'none', width:360, height:80, border:"1px solid #D1D1D1", borderRadius:5, padding:10}}
							rows={3}
						 	value={ !newOpen?.description ? '' : newOpen?.description }
							onChange={ (e) => {
								const rows = e.target.rows;
								const numberOfLines = (e.target.value.match(/\n/g) || []).length + 1;
								if(numberOfLines > rows){
									return;
								}else{
									setNewOpen(
										produce((draft: any) => {
											draft.description = e.target.value;
										})
									);	
								}
							}}/>
					</div>

					{/* 가게 전화번호 */}
					<div className={'input-title'}>
						6. 가게 전화번호
					</div>
					<div>
						<input id="store_number" type='text' placeholder="000-0000-0000" style={{width:180, marginTop:7}}
							value={ !newOpen?.store_number ? '' : newOpen?.store_number}
							onChange={ (e) => {
								let storeNumber = e.target.value;
								const regex = /^[0-9\b-]{0,13}$/;
								if (regex.test(storeNumber)) {
									setNewOpen(
										produce((draft: any) => {
										draft.store_number = storeNumber;
										})
									);
								}
							}}/>
					</div>

					{/* 영업시간 */}
					<div className={'input-title'}>
						7. 영업시간 (필수)
					</div>
					<div style={{marginTop:7,
						display: "flex",
						alignItems: "flex-start",}}>
						{businessHours.map((item, idx) => {
							return (
								<div className={!item.closed ? 'select-button' : 'unselect-button' }
								onClick={() => {
									setBusinessHours(
										produce((draft: any) => {
											draft[idx].closed = !draft[idx].closed;
										})
									);
								}}
								key={idx}>{item.day}</div>
							)
						})}
					</div>
					<div>
						{businessHours.map((item, idx) => {
							if(item.closed == false){
								return (
									<div style={{position:'relative', display: "flex", alignItems: "flex-start", marginTop:10, padding:10, backgroundColor:'#FFFFFF', border: '1px solid #D1D1D1', borderRadius:5, width:360, height:20}}
									key={idx}>
										<div style={{position:'absolute', top:12, left:15, borderRightWidth:1, borderRightColor:'#D1D1D1', fontSize:'14px', color:'#3E3F41'}}>{item.day}요일</div>
										<div style={{position:'absolute', width:1, height:20, top:12, left:70, backgroundColor:'#D1D1D1'}}/>
										<input type='time' placeholder="00:00 ~ 00:00" style={{width:140, border:'none', height:20, marginLeft:60}}
											value={item.start_hour}
											onChange={ (e) => {
												const hour = e.target.value;
												setBusinessHours(
														produce((draft: any) => {
															draft[idx].start_hour = hour;
														})
													);
												}
											}/>
										<div>~</div>
										<input type='time' placeholder="00:00 ~ 00:00" style={{width:140, border:'none', height:20}}
											value={item.end_hour}
											onChange={ (e) => {
												const hour = e.target.value;
												setBusinessHours(
														produce((draft: any) => {
															draft[idx].end_hour = hour;
														})
													);
												}
											}/>
									</div>
								)
							}
						})}
					</div>
				</div>


				<div style={{width:380, textAlign:'left'}}>
					{/* 매장사진 */}
					<div className={'input-title'}>
						8. 매장사진(필수, 최대 10장)
					</div>
					<div style={{
						display: "flex",
						alignItems: "flex-start",
						width:'100%', height:120, marginTop:7, border:'1px solid #D1D1D1', boxSizing:'border-box', borderRadius:5, overflowX:'scroll', backgroundColor:'#FBFBFB'}}>

					{newOpen?.photo_in_mall?.length < 10 || !newOpen?.photo_in_mall ? (
						<label style={{cursor:'pointer', marginTop:37.5, marginRight:10}}>
							<input
							style={{ display:'none' }}
							type="file"
							onChange={(e: any) => {
								for (let i = 0; i < e.target.files.length; i++) {
									uploadPhotoToFB(e.target.files[i], "PhotoInMall/" + e.target.files[i].name, "photo_in_mall");
								}
							}}
							accept="image/png, image/jpeg"
							multiple
							/>
							<img src={'/asset/button_image_add.png'} style={{width:45, height:45}}></img>
						</label>
					):(
						<div/>
					)}
					{newOpen?.photo_in_mall?.map((item, idx) => {
						return(
							<div style={{
								display: "flex",
								alignItems: "flex-start",
								whiteSpace:'nowrap',
								}}
								key={idx}>
								<a
								href={item}
								target="_blank"
								rel="noreferrer"
								style={{width:80, height:80, marginTop:20, marginRight:20,}}
								>
									<img
										className="image"
										src={item}
										style={{width:80, height:80 }}
										alt="썸네일"
									/>
								</a>
								<div>
								<button className="image-delete-button" style={{marginLeft:-30, marginTop:10, backgroundImage:"url('/asset/button_image_delete.png')"}}
									onClick={() => {
										setNewOpen(
										  produce((draft: any) => {
											draft.photo_in_mall.splice(idx,1);
										  })
										);
									}}/>
								</div>
							</div>
						)
					})}
					</div>

					{/* 메뉴 등록 */}
					<div className={'input-title'}>
						9. 메뉴 등록 (필수, 등록 개수제한 없으며 메뉴당 사진 최대 3장)
					</div>
					<div style={{marginTop:5}}>
						<span className="span-info" >체크박스에 클릭 시 대표메뉴로 설정되어 메인에 노출됩니다 (1/3)</span>
					</div>
					<div style={{marginTop:7}}>
						{menuList?.map((item, idx) => {
							return(
								<div style={{ marginBottom:11}} key={idx}>
									<div style={{display: "flex", alignItems: "flex-start", width:'100%', height:40, marginBottom:5}}>
										<div style={{height:40, marginRight:6}}>
											<input type="checkbox"  style={{width:20, height:20, borderRadius:5, marginTop:10}} checked={item.main_menu}
												onChange={(e) => {
													setMenuList(
														produce((draft: any) => {
															draft[idx].main_menu = e.target.checked;
														})
													);
												}}/>
										</div>
										<div style={{ height:40}}>
											<input placeholder="메뉴명" style={{width:215, height:40, marginRight:5}} value={item.name}
												onChange={(data) => {
													setMenuList(
														produce((draft: any) => {
															draft[idx].name = data.target.value;
														})
													);
												}}
											/>
											<input type="number" placeholder="1,000" style={{width:80, height:40, marginRight:6}} value={item.price}
												onChange={(data) => {
													setMenuList(
														produce((draft: any) => {
															draft[idx].price = data.target.value;
														})
													);
												}}/>
											<button className="normal-button" style={{width:40, height:40}}
												onClick={() => {
													setMenuList(
														produce((draft: any) => {
															draft.splice(idx, 1);
														})
													);
												}}
											>X</button>
										</div>
									</div>
									<div style={{display: "flex", alignItems: "flex-start", border:'1px solid #D1D1D1', boxSizing:'border-box', borderRadius:5,
										 paddingTop:6,
										 paddingBottom:6,
										 paddingLeft:6,
										 paddingRight:6,}}>
										 <label style={{cursor:'pointer', marginRight:15}}>
											 <input
											 style={{ display:'none' }}
											 type="file"
											 onChange={(e: any) => {
												for (let i = 0; i < e.target.files.length; i++) {
													uploadPhotoToFB(e.target.files[i], "MenuPhoto/" +e.target.files[i].name, "menu_photo", idx);
												}
											 }}
											 accept="image/png, image/jpeg"
											 multiple
											 />
											 <img src={'/asset/button_photo_add.png'} style={{width:45, height:25}}></img>
										 </label>
										<div>
											{ item.photo?.map((photoItem, photoIdx) => {
												return(
													<div style={{
														display: "flex",
														alignItems: "flex-start",
														whiteSpace:'nowrap',
														height:25,
														marginTop:3
														}}
														key={photoIdx}>
															<a
															href={photoItem.url}
															target="_blank"
															rel="noreferrer"
															style={{width:270, height:25, verticalAlign:'middle', fontSize:'14px'}}
															key={idx}
															>
																{photoItem.fileName}
															</a>
														<div>
															<button className="image-delete-button" style={{backgroundImage:"url('/asset/button_image_delete.png')"}}
																onClick={() => {
																	setMenuList(
																	produce((draft: any) => {
																		draft[idx].photo.splice(photoIdx,1);
																	})
																	);
																}}/>
														</div>
													</div>
												)
											})}
										</div>
									</div>
								</div>
							)
						})}
						<div style={{display: "flex", alignItems: "flex-start", width:'100%', height:40, marginBottom:5 }}>
							<div style={{height:40, marginRight:6}}>
								<input  id="menu-main-menu"  type="checkbox"  style={{width:20, height:20, borderRadius:5, marginTop:10}}/>
							</div>
							<div style={{ height:40}}>
								<input id="menu-name" placeholder="메뉴명" style={{width:215, height:40, marginRight:5}}/>
								<input id="menu-price" type="number" placeholder="1,000" style={{width:80, height:40, marginRight:6 }}/>
								<button className="primary-button" style={{width:40, height:40}}
									onClick={() => {
										const menuName = $("#menu-name");
										const menuPrice = $("#menu-price");
										const menuMainMenu = $("#menu-main-menu");
										const childMenu = {name:menuName.val(), price:menuPrice.val(), photo:newMenuPhoto, temp_photo:newMenuPhoto, main_menu: menuMainMenu.is(":checked")};
										setMenuList(
										  produce((draft: any) => {
											draft.push(childMenu);
										  })
										);
										menuName.val('');
										menuPrice.val('');
										menuMainMenu.prop("checked", false);
										setNewMenuPhoto([]);
									}}
								>+</button>
							</div>
						</div>
						<div style={{display: "flex", alignItems: "flex-start", border:'1px solid #D1D1D1', boxSizing:'border-box', borderRadius:5,
								paddingTop:6,
								paddingBottom:6,
								paddingLeft:6,
								paddingRight:6,}}>
								<label style={{cursor:'pointer', marginRight:15}}>
									<input
									style={{ display:'none' }}
									type="file"
									onChange={(e: any) => {
									for (let i = 0; i < e.target.files.length; i++) {
										uploadPhotoToFB(e.target.files[i], "MenuPhoto/" +e.target.files[i].name, "newMenu_photo");
									}
									}}
									accept="image/png, image/jpeg"
									multiple
									/>
									<img src={'/asset/button_photo_add.png'} style={{width:45, height:25}}></img>
								</label>
							<div>
								{ newMenuPhoto?.map((item, idx) => {
									return(
										<div style={{
											display: "flex",
											alignItems: "flex-start",
											whiteSpace:'nowrap',
											height:25,
											marginTop:3
											}}>
												<a
												href={item.url}
												target="_blank"
												rel="noreferrer"
												style={{width:270, height:25, verticalAlign:'middle', fontSize:'14px'}}
												key={idx}
												>
													{item.fileName}
												</a>
											<div>
												<button className="image-delete-button" style={{backgroundImage:"url('/asset/button_image_delete.png')"}}
													onClick={() => {
														setNewMenuPhoto(
															produce((draft: any) => {
																draft.splice(idx,1);
															})
														);
													}}/>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>

					{/* 혜택 등록 */}
					<div className={'input-title'}>
						10. 혜택 등록 (옵션, 등록 개수제한 없음)
					</div>
					<div style={{marginTop:7}}>
						{evnetList?.map((item, idx) => {
							const eventCalendar = $("#event-calendar-" + idx);
							if(item.date_check){
								eventCalendar.css("display","flex");
							}
							return(
								<div style={{marginBottom:15}} key={idx}>
								<div style={{display: "flex", alignItems: "flex-start", width:'100%', }}>
									<textarea rows={10} placeholder="<예> 오픈이벤트로 500원 할인&#13;&#10;<예> 가오픈 기간 동안만 음료 1+1 증정" style={{resize:'none', width:297, height:"35px", border:"1px solid #D1D1D1", borderRadius:5, padding:10, marginRight:6}}
									  value={item.content}
									  onChange={(e) => {
										setEventList(
											produce((draft: any) => {
												draft[idx].content = e.target.value;
											})
										);
									  }}/>
									<button className="normal-button" style={{width:40, height:40, marginTop:10}}
										onClick={() => {
											const newEvent = {content:null, startDate:null, endDate:null,};
											setEventList(
												produce((draft: any) => {
													draft.splice(idx,1);
												})
											);
										}}
									>X</button>
								</div>
								<div style={{display: "flex", alignItems: "flex-start", marginTop:5,}}>
									<input id={'event-check-'+idx} type="checkbox"  style={{width:20, height:20, marginRight:5}} checked={item.date_check}
										onChange={(e) => {
											const eventCalendar = $("#event-calendar-" + idx);
											const eventCheck = $("#event-check-" + idx);
											if(e.target.checked){
												eventCalendar.css("display","flex");
											}else{
												eventCalendar.css("display","none");
											}
											setEventList(
												produce((draft: any) => {
													draft[idx].date_check = e.target.checked;
												})
											);
										}}/>
									<span style={{marginTop:4}}>혜택에 기간이 있는 경우</span>
								</div>
								<div id={'event-calendar-'+idx} style={{display: "none", alignItems: "flex-start", marginTop:10, padding:10, backgroundColor:'#FFFFFF', border: '1px solid #D1D1D1', borderRadius:5}}>
									<img src={'/asset/icon_calendar.png'} style={{width:20, height:20, marginRight:10}}></img>
									<div style={{width:1, height:20, backgroundColor:'#D1D1D1', marginRight:10}}/>
									<DatePickerComponent pStartDate={new Date(item.start_date)} pEndDate={new Date(item.end_date)}  setSearchDateString={(data) => setEventStartDate(data, idx)} setSelectedEndDateString={(data) => setEventEndDate(data, idx)} isRangeSearch={true}/>
								</div>
								</div>
							)
						})}
						<div style={{display: "flex", alignItems: "flex-start", width:'100%', }}>
							<textarea id="new-event-content" rows={10} placeholder="<예> 오픈이벤트로 500원 할인&#13;&#10;<예> 가오픈 기간 동안만 음료 1+1 증정" style={{resize:'none', width:297, height:"35px", border:"1px solid #D1D1D1", borderRadius:5, padding:10, marginRight:6}} />
							<button className="primary-button" style={{width:40, height:40, marginTop:10}}
								onClick={() => {
									const newEventContent = $("#new-event-content");
									const newEventhCheck = $("#new-event-check");
									const newEventCalendar = $("#new-event-calendar");
									const newEvent = {content:newEventContent.val(), date_check:newEventhCheck.is(":checked"), start_date:startDate, end_date:endDate,};
									setEventList(
										produce((draft: any) => {
											draft.push(newEvent);
										})
									);
									newEventContent.val('');
									newEventhCheck.prop("checked", false);
									newEventCalendar.css("display","none");
									setStartDate(new Date());
									setEndDate(new Date());
								}}
							>+</button>
						</div>
						<div style={{display: "flex", alignItems: "flex-start", marginTop:5,}}>
							<input id="new-event-check" type="checkbox"  style={{width:20, height:20, marginRight:5}}
								onChange={ (e) => {
									const newEventCalendar = $("#new-event-calendar");
									if(e.target.checked){
										newEventCalendar.css("display","flex");
									}else{
										newEventCalendar.css("display","none");
									}
								}}/>
							<span style={{marginTop:4}}>혜택에 기간이 있는 경우</span>
						</div>
						<div id="new-event-calendar" style={{display: "none", alignItems: "flex-start", marginTop:10, padding:10, backgroundColor:'#FFFFFF', border: '1px solid #D1D1D1', borderRadius:5}}>
							<img src={'/asset/icon_calendar.png'} style={{width:20, height:20, marginRight:10}}></img>
							<div style={{width:1, height:20, backgroundColor:'#D1D1D1', marginRight:10}}/>
							<DatePickerComponent pStartDate={new Date()} pEndDate={new Date()} setSearchDateString={(data) => setStartDate(data)} setSelectedEndDateString={(data) => setEndDate(data)} isRangeSearch={true}/>
						</div>
					</div>

					<div className={'input-title'}>
						11. 정식 오픈일(옵션)
					</div>
					<div style={{display: "flex", alignItems: "flex-start", marginTop:10, padding:10, backgroundColor:'#FFFFFF', border: '1px solid #D1D1D1', borderRadius:5, width:170, height:20}}>
						<img src={'/asset/icon_calendar.png'} style={{width:20, height:20, marginRight:10}}></img>
						<div style={{width:1, height:20, backgroundColor:'#D1D1D1', marginRight:10}}/>
						{newOpen?.open_date ? (
							<div>
								<div></div>
								<DatePickerComponent pStartDate={new Date(newOpen.open_date)} pEndDate={null}  setSearchDateString={(data) => setOpenDate(data)} setSelectedEndDateString={(data) => {}} isRangeSearch={false} isClearable={true}/>
							</div>
						) : (
							<div>
								<DatePickerComponent pStartDate={ null} pEndDate={null}  setSearchDateString={(data) => setOpenDate(data)} setSelectedEndDateString={(data) => {}} isRangeSearch={false} isClearable={true}/>
							</div>
						)}
					</div>
					<div className={'input-title'}>
						12. 담당자 전화번호(필수)
					</div>
					<div>
						<input id="phone-number" type='text' placeholder="000-0000-0000" style={{width:180, marginTop:7}} 
							value={ !newOpen?.phone_number ? '' : newOpen?.phone_number}
							onChange={ (e) => {
								const phoneNumber = e.target.value;
								const regex = /^[0-9\b -]{0,13}$/;
								if (regex.test(phoneNumber)) {
									setNewOpen(
										produce((draft: any) => {
										draft.phone_number = phoneNumber;
										})
									);
								}
							}}/>
					</div>
				</div>
			</div>

			{/* 입점 신청하기 */}
			<div style={{paddingTop:40, paddingBottom:40}}>
				<div id="duplicate-id" style={{display:"none", fontSize:'14px', color:'#FF2E4C'}}>
					ID가 중복되었습니다. ID를 변경해주세요.
				</div>
				<button className="primary-button" style={{marginTop:5, paddingTop:14, paddingBottom:14, paddingLeft:45, paddingRight:45}}
					onClick= {() => submitUpdateNewOpen()}>
					입점 신청하기
				</button>	
				<div style={{marginTop:13, marginBottom:60, fontSize:"13px", lineHeight:"16px", color:'#D1D1D1'}}>
				최대한 빠르게 내부 검토 후 게시가 시작됩니다.<br/>만일 수정사항이 있는 경우 담당자 번호로 연락 드리겠습니다.
				</div>
			</div>
		</div>
	);
};

export default InputForm;
