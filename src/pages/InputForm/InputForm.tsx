import React, { useState } from 'react';
import $ from "jquery";
import { Form, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import { deleteUserToken, getUserToken } from "../../utils/utils";

import {NEW_OPEN_ID_CHECK, ADD_NEW_OPEN} from "./mutation.gql";

import Header from '../components/Header'
import DatePickerComponent from '../components/DatePickerComponent';
import PostCodePopup from '../components/PostCodePopup';

import produce from "immer";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import Item from 'antd/lib/list/Item';
import { url } from 'inspector';
import { formatTimeStr } from 'antd/lib/statistic/utils';

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
	const [newOpen, setNewOpen] = useState({
		logo: {image: null, url: null} as any,
		photo_in_mall: [] as any,
	});

	const [uploadNewOpen, setUploadNewOpen] = useState({
		logo: {image: null, url: null} as any,
		photo_in_mall: [] as any,
	});

	// 주소 팝업창
    const [postCodePopup, setPostCodePopup] = useState(false)
    const modalClose = () => {
        setPostCodePopup(false);
    }
	const postCodeSuccess = (data) => {
		$("#address").val(data);
        setPostCodePopup(false);
	}

	// 가게 전화번호
    const [storeNumber, setStoreNumber] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

	// 영업 시간
	const [businessHours, setBusinessHours] = useState([
		{ day:'월', hour:'00:00 ~ 00:00', closed:true},
		{ day:'화', hour:'00:00 ~ 00:00', closed:true},
		{ day:'수', hour:'00:00 ~ 00:00', closed:true},
		{ day:'목', hour:'00:00 ~ 00:00', closed:true},
		{ day:'금', hour:'00:00 ~ 00:00', closed:true},
		{ day:'토', hour:'00:00 ~ 00:00', closed:true},
		{ day:'일', hour:'00:00 ~ 00:00', closed:true},
	]);

	// 메뉴 정보
	const [menuList, setMenuList] = useState([] as any);
	const [newMenuPhoto, setNewMenuPhoto] = useState([] as any);

	// 혜택 정보
	const [evnetList, setEventList] = useState([] as any);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const setEventStartDate = (data, idx) => {
		setEventList(
		  produce((draft: any) => {
			draft[idx].startDate = data;
		  })
		);
	}

	const setEventEndDate = (data, idx) => {
		setEventList(
		  produce((draft: any) => {
			draft[idx].endDate =data;
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
	    const uploadTask = storage.ref(`/${filesName}`).put(image);
	    if (place === "logo") {
		  uploadTask.on("state_changed", console.log, console.error, () => {
			uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
			  setNewOpen(
				produce((draft: any) => {
					draft.logo.image = image;
					draft.logo.url = url;
				})
			  );
			});
		  });
		}else if (place === "photo_in_mall") {
			uploadTask.on("state_changed", console.log, console.error, () => {
			  uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
				setNewOpen(
				  produce((draft: any) => {
					draft.photo_in_mall.push({image:image, url:url});
				  })
				);
			  });
			});
		}else if (place === "menu_photo") {
			uploadTask.on("state_changed", console.log, console.error, () => {
				uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
					const newMenuPhoto = {image:image, url: url, name: filesName.replace('MenuPhoto/','')}
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
					const newMenuPhoto = {image:image, url: url, name: filesName.replace('MenuPhoto/','')}
					setNewMenuPhoto(
						produce((draft: any) => {
							draft.push(newMenuPhoto);
						})
				);
				});
			});
		}else if (place === "logo_upload") {
			uploadTask.on("state_changed", console.log, console.error, () => {
				uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
					const newMenuPhoto = {url: url, name: filesName}
					setUploadNewOpen(
						produce((draft: any) => {
							draft.logo = url;
						})
				);
				});
			});
		}else if (place === "photo_in_mall_upload") {
			uploadTask.on("state_changed", console.log, console.error, () => {
				uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
					setUploadNewOpen(
						produce((draft: any) => {
							draft.photo_in_mall.push(url);
						})
					);
				});
			});
		}else if (place === "menu_photo_upload") {
			uploadTask.on("state_changed", console.log, console.error, () => {
				uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
					setMenuList(
						produce((draft: any) => {
							draft[index].photo[index_detail] = url;
						})
					)
				});
			});
		}
	};

	
	const [newOpenIdCheck] = useMutation(NEW_OPEN_ID_CHECK);
	const [addNewOpen] = useMutation(ADD_NEW_OPEN);

	const checkValue = (id) => {
		const component = $("#"+id);
		const componentVal = component.val();
		if(id == "business-type"){
			const detail = $("#business-type-detail");
			if(componentVal == "기타" && !detail.val() ){
				console.log("B");
				detail.focus();
			}
		}
		if(!component.val()){
			component.focus();
			return false;
		}
		return true;
	}

	const submitAddNewOpen = async () =>{

		if(!newOpen.logo.image){
			$('html, body').animate({scrollTop : 300}, 100);
			return;
		}

		const idList = ["login-id", "login-pw", "business-type", "brand-name", "address", "address_detail"];
		for(let i=0; i< idList.length; i++){
			if(!checkValue(idList[i])){
				return;
			}
		}
		
		if(newOpen.photo_in_mall.length == 0){
			$('html, body').animate({scrollTop : 300}, 100);
			return;
		}

		const login_id = $("#login-id").val();
		const login_pw = $("#login-pw").val();
		const business_type = $('#business-type').val();
		const business_type_detail = $('#business-type-detail').val();
		const brand_name = $('#brand-name').val();
		const address = $('#address').val();
		const address_detail = $('#address-detail').val();
		const description = $("#description").val();
		const store_number = $("#store_number").val();
		const open_date = $("#open_date").val();
		const phone_number = $("#phone_number").val();

		const {data: NewOpenIdCheck} = await newOpenIdCheck({variables: {login_id}})
		if(!NewOpenIdCheck.NewOpenIdCheck.ok){
			$("#duplicate-id").css('display', 'block');
			return;
		}
		$("#duplicate-id").css('display', 'none');

		uploadPhotoToFB(newOpen.logo.image, login_id + "/logo.png", "logo_upload");
		for(let i=0; i < newOpen.photo_in_mall.length; i++){
			uploadPhotoToFB(newOpen.photo_in_mall[i].image, login_id + "/PhotoInMall/photo_in_mall" + i + ".png", "photo_in_mall_upload");
		}

		for(let i=0; i< menuList.length; i++){
			for(let j=0; j< menuList[i].photo.length; j++){
				uploadPhotoToFB(menuList[i].photo[j].image, login_id + "/MenuPhoto/menu_photo" + i +  "_" + j + ".png", "menu_photo_upload", i, j);
			}
		}

		setTimeout(async function() {
			const { data: AddNewOpen } =
				await addNewOpen({
					variables:{
						newOpenData: {
							login_id,
							login_pw,
							logo: uploadNewOpen.logo,
							business_type,
							business_type_detail,
							brand_name,
							address,
							address_detail,
							description,
							store_number,
							business_hours: businessHours,
							photo_in_mall: uploadNewOpen.photo_in_mall,
							menu: menuList,
							newOpenEvent: evnetList,
							open_date,
							phone_number
						}
					}
				})
			const result = AddNewOpen.AddNewOpen;

			if (!result.ok) {
				console.log(result)
				return;
			}
		  }, 10000);
		  

	}

	return (
		<div style={{backgroundColor:'#F6F6F6', paddingTop:70}}>
			<Header/>
			<div>미리보기</div>
			<div style={{ width:1024, marginLeft:'auto', marginRight:'auto', border:"1px solid #E2E2E2", boxSizing:'border-box', borderRadius:10, backgroundColor:'#FFFFFF'}}>
				<div style={{
					display: "flex",
					alignItems: "flex-start",
					marginBottom: 10,
					whiteSpace:'nowrap',}}>
					{/* 로고 */}
					<div style={{ width:100, paddingTop:15, textAlign:'center'}}>
						<div style={{width:65, height:65, overflow:'hidden', marginLeft:'auto', marginRight:'auto', borderRadius:60, backgroundColor:'#C4C4C4', border:'1px solid #C4C4C4'}}>
						<img
							src={newOpen.logo?.url}
							style={{ width:65, height:65,}}
							alt="상품소개"
							/>
						</div>
						<div style={{marginTop:13, fontFamily:'Spoqa Han Sans Neo', fontWeight:'bold', fontSize:"14px", lineHeight:"18px", letterSpacing:-1, textAlign:'center', color:'#2F80ED'}}>
							정식오픈
						</div>
						<div style={{fontFamily:'NanumMyeongjo', fontWeight:800, fontSize:"24px", lineHeight:"30px", letterSpacing:-1, textAlign:'center', color:'#2F80ED'}}>
							D-Day
						</div>
					</div>
					{/* 가게정보 */}
					<div>
						<div>
							{/* #{newOpen.business_type} */}
						</div>
						<div>
							{/* {newOpen.brand_name} */}
							{/* <a style={{marginLeft:15}}>{newOpen.address}</a> */}
						</div>
						<div>
							{/* {newOpen.description} */}
						</div>
						<div style={{
					display: "flex",
					alignItems: "flex-start",}}>
							<div>
								a
							</div>
							<div>
								b
							</div>
						</div>
					</div>
					{/* 매장사진 */}
					<div>
						사진
					</div>
				</div>
				<div style={{height:50}}>
					<div style={{float:'right'}}>
					<button>메뉴 더보기</button>
					<button>메뉴 더보기</button>
					</div>
				</div>
				<div>
					대표메뉴

				</div>
			</div>

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
						{!newOpen.logo.url ? (
							<label style={{cursor:'pointer'}}>
								<input
								style={{ display:'none' }}
								type="file"
								onChange={(e: any) => {
									uploadPhotoToFB(e.target.files[0], "LogoImage/" +e.target.files[0].name, "logo");
								}}
								accept="image/png, image/jpeg"
								/>
								<img src={'../../assets/img/button_image_add.png'} style={{width:45, height:45}}></img>
							</label>
						): (
							<div style={{
								display: "flex",
								alignItems: "flex-start",
								whiteSpace:'nowrap',
								}}>
								<a
								href={newOpen.logo.url}
								target="_blank"
								rel="noreferrer"
								style={{width:65, height:65}}
								>
									<img
										className="image"
										src={newOpen.logo.url}
										style={{width:65, height:65 }}
										alt="썸네일"
									/>
								</a>
								<div>
								<button className="image-delete-button" style={{marginLeft:-10, marginTop:-10, backgroundImage:"url('/assets/img/button_image_delete.png')"}}
									onClick={() => {
										setNewOpen(
										  produce((draft: any) => {
											draft.logo.image = null;
											draft.logo.url = null;
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
						<select id="business-type" placeholder="선택하세요" style={{width:'100%', height:40, marginTop:10}}
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
							<option key="밥집">밥집</option>
							<option key="술집">술집</option>
							<option key="카페">카페</option>
							<option key="네일&속눈썹">네일&속눈썹</option>
							<option key="헤어샵">헤어샵</option>
							<option key="기타">기타</option>
						</select>
						<div id="business-type-detail-div" style={{display:'none'}}>
							<input id="business-type-detail" placeholder="업종을 알려주세요" style={{width:'100%', marginTop:7}}/>
						</div>
					</div>

					{/* 상호명 */}
					<div className={'input-title'}>
						3. 상호명(필수)
					</div>
					<div>
						<input id="brand-name"  placeholder="상호명을 입력하세요" style={{width:'100%', marginTop:7}}
							onChange={ (data) => {
								const brandName = data.target.value;
								setNewOpen(
									produce((draft: any) => {
										draft.brand_name = brandName;
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
						<input id="address" placeholder="사업장 주소를 입력하세요" style={{width:'100%', marginTop:7}} readOnly/>
						<button className="primary-button" style={{marginLeft:-58, paddingTop:8, paddingBottom:8, paddingLeft:15, paddingRight:15}}
							onClick= {() => {
								setPostCodePopup(true);
							}}
						>
							검색
						</button>
						<div>
						<input id="address_detail" placeholder="나머지 주소" style={{width:'100%', marginTop:7}}/>
						</div>
					{postCodePopup === true ? <PostCodePopup postCodeSuccess={postCodeSuccess} modalClose={modalClose} /> : <div />}
					</div>

					{/* 가게 설명 */}
					<div className={'input-title'}>
						5. 가게 설명
					</div>
					<div>
						<textarea id="description" placeholder="고객에 어필할 수 있는 짧은 홍보글을 입력하세요" style={{resize:'none', width:360, height:80, border:"1px solid #D1D1D1", borderRadius:5, padding:10}}/>
					</div>

					{/* 가게 전화번호 */}
					<div className={'input-title'}>
						6. 가게 전화번호
					</div>
					<div>
						<input id="store_number" type='text' placeholder="000-0000-0000" style={{width:180, marginTop:7}} value={storeNumber}
							onChange={ (e) => {
								const storeNumber = e.target.value;
								const regex = /^[0-9\b -]{0,13}$/;
								if (regex.test(storeNumber)) {
									setStoreNumber(storeNumber);
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
								}}>{item.day}</div>
							)
						})}
					</div>
					<div>
						{businessHours.map((item, idx) => {
							if(item.closed == false){
								return (
									<div style={{position:'relative'}}>
										<input type='text' placeholder="00:00 ~ 00:00" style={{width:'100%', marginTop:7, paddingLeft:100}}
											onChange={ (e) => {
												const hour = e.target.value;
												setBusinessHours(
														produce((draft: any) => {
															draft[idx].hour = hour;
														})
													);
												}
											}/>
											<div style={{position:'absolute', top:18, left:15, borderRightWidth:1, borderRightColor:'#D1D1D1', fontSize:'14px', color:'#3E3F41'}}>{item.day}요일</div>
											<div style={{position:'absolute', width:1, height:20, top:18, left:70, backgroundColor:'#D1D1D1'}}/>
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

					{newOpen.photo_in_mall?.length < 10 ? (
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
							<img src={'/assets/img/button_image_add.png'} style={{width:45, height:45}}></img>
						</label>
					):(
						<div/>
					)}
					{newOpen.photo_in_mall?.map((item, idx) => {
						return(
							<div style={{
								display: "flex",
								alignItems: "flex-start",
								whiteSpace:'nowrap',
								}}>
								<a
								href={item.url}
								target="_blank"
								rel="noreferrer"
								style={{width:80, height:80, marginTop:20, marginRight:20,}}
								key={idx}
								>
									<img
										className="image"
										src={item.url}
										style={{width:80, height:80 }}
										alt="썸네일"
									/>
								</a>
								<div>
								<button className="image-delete-button" style={{marginLeft:-30, marginTop:10, backgroundImage:"url('/assets/img/button_image_delete.png')"}}
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
											<input placeholder="1,000" style={{width:80, height:40, marginRight:6}} value={item.price}
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
											 <img src={'/assets/img/button_photo_add.png'} style={{width:45, height:25}}></img>
										 </label>
										<div>
											{ item.temp_photo?.map((photoItem, photoIdx) => {
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
																{photoItem.name}
															</a>
														<div>
															<button className="image-delete-button" style={{backgroundImage:"url('/assets/img/button_image_delete.png')"}}
																onClick={() => {
																	setMenuList(
																	produce((draft: any) => {
																		draft[idx].temp_photo.splice(photoIdx,1);
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
									<img src={'/assets/img/button_photo_add.png'} style={{width:45, height:25}}></img>
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
													{item.name}
												</a>
											<div>
												<button className="image-delete-button" style={{backgroundImage:"url('/assets/img/button_image_delete.png')"}}
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
							if(item.check){
								eventCalendar.css("display","flex");
							}
							return(
								<div style={{marginBottom:15}}>
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
												draft.push(newEvent);
												})
											);
										}}
									>X</button>
								</div>
								<div style={{display: "flex", alignItems: "flex-start", marginTop:5,}}>
									<input type="checkbox"  style={{width:20, height:20, marginRight:5}} checked={item.check}
										onChange={(e) => {
											const eventCalendar = $("#event-calendar-" + idx);
											if(e.target.checked){
												eventCalendar.css("display","flex");
											}else{
												eventCalendar.css("display","none");
											}
										}}/>
									<span style={{marginTop:4}}>혜택에 기간이 있는 경우</span>
								</div>
								<div id={'event-calendar-'+idx} style={{display: "none", alignItems: "flex-start", marginTop:10, padding:10, backgroundColor:'#FFFFFF', border: '1px solid #D1D1D1', borderRadius:5}}>
									<img src={'/assets/img/icon_calendar.png'} style={{width:20, height:20, marginRight:10}}></img>
									<div style={{width:1, height:20, backgroundColor:'#D1D1D1', marginRight:10}}/>
									<DatePickerComponent pStartDate={item.startDate} pEndDate={item.endDate}  setSearchDateString={(data) => setEventStartDate(data, idx)} setSelectedEndDateString={(data) => setEventEndDate(data, idx)} isRangeSearch={true}/>
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
									const newEvent = {content:newEventContent.val(), check:newEventhCheck.is(":checked"), startDate:startDate, endDate:endDate,};
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
									console.log("A");
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
							<img src={'/assets/img/icon_calendar.png'} style={{width:20, height:20, marginRight:10}}></img>
							<div style={{width:1, height:20, backgroundColor:'#D1D1D1', marginRight:10}}/>
							<DatePickerComponent pStartDate={startDate} pEndDate={endDate} setSearchDateString={(data) => setStartDate(data)} setSelectedEndDateString={(data) => setEndDate(data)} isRangeSearch={true}/>
						</div>
					</div>

					<div className={'input-title'}>
						11. 정식 오픈일(옵션)
					</div>
					<div style={{display: "flex", alignItems: "flex-start", marginTop:10, padding:10, backgroundColor:'#FFFFFF', border: '1px solid #D1D1D1', borderRadius:5, width:160}}>
						<img src={'/assets/img/icon_calendar.png'} style={{width:20, height:20, marginRight:10}}></img>
						<div style={{width:1, height:20, backgroundColor:'#D1D1D1', marginRight:10}}/>
						<DatePickerComponent pStartDate={new Date()} pEndDate={new Date()}  setSearchDateString={(data) => setOpenDate(data)} setSelectedEndDateString={(data) => {}} isRangeSearch={false}/>
					</div>
					<div className={'input-title'}>
						12. 담당자 전화번호(필수)
					</div>
					<div>
						<input id="phone_number" type='text' placeholder="000-0000-0000" style={{width:180, marginTop:7}} value={phoneNumber}
							onChange={ (e) => {
								const phoneNumber = e.target.value;
								const regex = /^[0-9\b -]{0,13}$/;
								if (regex.test(phoneNumber)) {
									setPhoneNumber(phoneNumber);
								}
							}}/>
					</div>
				</div>
			</div>

			<div style={{fontSize:"13px", lineHeight:"15px", marginTop:25}}>
				정보를 나중에도 관리할 수 있도록 아이디와 비밀번호를 설정해주세요
			</div>

			{/* 로그인 */}
			<div style={{
					width:408,
					marginLeft:'auto',
					marginRight:'auto',
					display: "flex",
					alignItems: "flex-start",
					whiteSpace:'nowrap',}}>
				{/* 아이디 */}
				<div style={{textAlign:'left', marginRight:8, width:200}}>
					<div className={'input-title'}>
						아이디 (필수)
					</div>
					<div>
						<input id="login-id" placeholder="아이디 입력하세요" style={{width:'100%', marginTop:7}}/>
					</div>
				</div>
				{/* 비밀번호 */}
				<div style={{textAlign:'left', width:200}}>
					<div className={'input-title'}>
					비밀번호 (필수)
					</div>
					<div>
						<input id="login-pw" type="password" placeholder="비밀번호를 입력하세요" style={{width:'100%', marginTop:7}}/>
					</div>
				</div>
			</div>

			{/* 입점 신청하기 */}
			<div style={{marginTop:40}}>
				<div id="duplicate-id" style={{display:"none", fontSize:'14px', color:'#FF2E4C'}}>
					ID가 중복되었습니다. ID를 변경해주세요.
				</div>
				<button className="primary-button" style={{marginTop:5, paddingTop:14, paddingBottom:14, paddingLeft:45, paddingRight:45}}
					onClick= {() => submitAddNewOpen()}>
					입점 신청하기
				</button>	
				<div style={{marginTop:13, marginBottom:60, fontSize:"13px", lineHeight:"16px", color:'#D1D1D1'}}>
				최대한 빠르게 내부 검토 후 게시가 시작됩니다.<br/>만일 수정사항이 있는 경우 담당자 번호로 연락 드리겠습니다.
				</div>
			</div>



			{/* <Button
			onClick={(e) => {
				e.preventDefault();
				deleteUserToken();
				window.location.href = "/";
			}}>로그아웃</Button> */}
		</div>
	);
};

export default InputForm;