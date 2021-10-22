import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { useMutation, useQuery } from "@apollo/client";
import { Dropdown } from "antd";

import { GET_NEW_OPEN, UPDATE_NEW_OPEN } from "./mutation.gql";
import { numb } from "../../utils/utils";

import Modal from "react-modal";
import { Carousel } from "react-responsive-carousel";

import HorizontalCarousel from "../components/HorizontalCarousel";
import Header from "../components/Header";
import DatePickerComponent from "../components/DatePickerComponent";
import PostCodePopup from "../components/PostCodePopup";

import produce from "immer";
import styled from "styled-components";

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
  measurementId: "G-LQ51CYZDVV",
};

const InputForm = () => {
  const [newOpen, setNewOpen] = useState({} as any);

  const [diffDay, setDiffDay] = useState(null as any);
  const [findDay, setFindDay] = useState(null as any);

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
    flag_change();
  };

  // 쿠폰 모달
  const [coupon_modal, set_coupon_modal] = useState(false);
  const close_coupon_modal = () => {
    set_coupon_modal(false);
    flag_change();
  };

  // 저장 모달
  const [saveModal, setSaveModal] = useState(false);

  // New Open 정보 가져오기
  const { data } = useQuery(GET_NEW_OPEN, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const newOpenData = data.GetNewOpen.new_open;
      setNewOpen(newOpenData);

      const business_hours = newOpenData.business_hours;
      if (business_hours) {
        setBusinessHours(business_hours);
      }

      const menu = newOpenData.menu;
      if (menu) {
        setMenuList(menu);
      }

      const newOpenEvent = newOpenData.new_open_event;
      if (newOpenEvent) {
        setEventList(newOpenEvent);
      }
    },
  });

  // 영업 시간
  const [businessHours, setBusinessHours] = useState([
    {
      number: 1,
      day: "월",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
    {
      number: 2,
      day: "화",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
    {
      number: 3,
      day: "수",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
    {
      number: 4,
      day: "목",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
    {
      number: 5,
      day: "금",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
    {
      number: 6,
      day: "토",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
    {
      number: 0,
      day: "일",
      start_hour: "00:00",
      end_hour: "00:00",
      closed: true,
    },
  ]);

  //오픈일 계산
  useEffect(() => {
		if(newOpen.open_date){
			const now = new Date().getTime();
			const date_split = String(newOpen.open_date).split("-");
			setDiffDay(
				Math.floor(
					(new Date(
						Number(date_split[0]),
						Number(date_split[1]) - 1,
						Number(date_split[2]),
						0,
						0,
						0
					).getTime() -
						now) /
						(1000 * 3600 * 24)
				)
			);
		}
  }, [newOpen.open_date]);

  //오프시간 계산
  useEffect(() => {
		setFindDay(
			businessHours?.find((item: any) => {
				return Number(item?.number) === new Date().getDay();
			})
		);
  }, [businessHours]);

  // 주소 팝업창
  const [postCodePopup, setPostCodePopup] = useState(false);
  const modalClose = () => {
    setPostCodePopup(false);
  };
  const postCodeSuccess = (data, location) => {
    setNewOpen(
      produce((draft: any) => {
        draft.address = data;
        draft.location = location;
      })
    );
    setPostCodePopup(false);
  };

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
  };

  const setEventEndDate = (data, idx) => {
    setEventList(
      produce((draft: any) => {
        draft[idx].end_date = data;
      })
    );
  };

  const setOpenDate = (data) => {
    setNewOpen(
      produce((draft: any) => {
        draft.open_date = data;
      })
    );
  };

  // firebase 사진 올리기
  const uploadPhotoToFB = (
    image: any,
    filesName: any,
    place: any,
    index?: any,
    index_detail?: any
  ) => {
    if (!firebase.apps?.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    const storage = firebase.storage();
    const uploadTask = storage
      .ref(`/${newOpen.login_id}/${filesName}`)
      .put(image);
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
    } else if (place === "photo_in_mall") {
      uploadTask.on("state_changed", console.log, console.error, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
          if (!newOpen.photo_in_mall) {
            setNewOpen(
              produce((draft: any) => {
                draft.photo_in_mall = [url];
              })
            );
          } else {
            setNewOpen(
              produce((draft: any) => {
                draft.photo_in_mall.push(url);
              })
            );
          }
        });
      });
    } else if (place === "menu_photo") {
      uploadTask.on("state_changed", console.log, console.error, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
          const newMenuPhoto = {
            url: url,
            fileName: filesName.replace("MenuPhoto/", ""),
          };
          setMenuList(
            produce((draft: any) => {
              draft[index].photo.push(newMenuPhoto);
            })
          );
        });
      });
    } else if (place === "newMenu_photo") {
      uploadTask.on("state_changed", console.log, console.error, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url: any) => {
          const newMenuPhoto = {
            image: image,
            url: url,
            fileName: filesName.replace("MenuPhoto/", ""),
          };
          setNewMenuPhoto(
            produce((draft: any) => {
              draft.push(newMenuPhoto);
            })
          );
        });
      });
    }
  };

  const [updateNewOpen] = useMutation(UPDATE_NEW_OPEN);

  const checkValue = (id) => {
    const component = $("#" + id);
    const componentVal = component.val();
    if (id === "business-type") {
      const detail = $("#business-type-detail");
      if (componentVal === "기타" && !detail.val()) {
        detail.focus();
      }
    }
    if (!component.val()) {
      component.focus();
      return false;
    }
    return true;
  };

  const submitUpdateNewOpen = async () => {
    if (!newOpen?.logo) {
      $("html, body").animate({ scrollTop: 100 }, 100);
      return;
    }

    const idList = [
      "business-type",
      "brand-name",
      "address",
      "address-detail",
      "phone-number",
    ];
    for (let i = 0; i < idList.length; i++) {
      if (!checkValue(idList[i])) {
        return;
      }
    }

    if (!newOpen.photo_in_mall || newOpen.photo_in_mall.length === 0) {
      $("html, body").animate({ scrollTop: 300 }, 100);
      return;
    }

    const { data: UpdateNewOpen } = await updateNewOpen({
      variables: {
        updateNewOpenData: {
          logo: newOpen.logo,
          business_type: newOpen.business_type,
          business_type_detail: newOpen.business_type_detail,
          brand_name: newOpen.brand_name,
          address: newOpen.address,
          address_detail: newOpen.address_detail,
          location: newOpen.location,
          description: newOpen.description,
          store_number: newOpen.store_number,
          business_hours: businessHours,
          photo_in_mall: newOpen.photo_in_mall,
          menu: menuList,
          newOpenEvent: evnetList,
          open_date: newOpen.open_date,
          phone_number: newOpen.phone_number,
        },
      },
    });
    const result = UpdateNewOpen.UpdateNewOpen;

    if (!result.ok) {
      console.log(result);
      return;
    }else{
			setSaveModal(true);
		}
  };

  // 캐러셀 ref
  const carousel_ref = useRef<Carousel>(null);
  const handle_previous = () => {
    carousel_ref.current?.moveTo(0);
  };

  // 선택한 가게
  const [select_menu, set_select_menu] = useState("");
  const [select_menu_photo, set_select_menu_photo] = useState(0);

  return (
    <div style={{ backgroundColor: "#F6F6F6", paddingTop: 70 }}>
      <Header logout={true} />

      {/* 미리보기 */}
      <div
        style={{
          width: 1024,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 30,
          marginBottom: 5,
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "left",
        }}
      >
        미리보기
      </div>

      <Styled>
        {/* 브랜드 컨테이너 */}
        <div className="new-open-container">
          <div className="column">
						{newOpen?.logo ? (
							<img className="logo" src={newOpen?.logo} alt="logo" />
						) : (
							<div className="logo"></div>
						)}
            <div className="remain-open">정식오픈</div>
            <div
              className="remain-open"
              style={{
                marginTop: "-1px",
                fontSize: "24px",
                fontFamily: "NanumMyeongjo",
                display: diffDay <= 0 ? "none" : "flex",
                justifyContent: "center",
              }}
            >
              D-{diffDay}
            </div>
          </div>
          <div className="content-container">
            <div className="category-container">
              <div className="category-name">#{newOpen?.business_type ? newOpen?.business_type : "업종"}</div>
              <div className="like-numb">
                👀
                <span style={{ marginLeft: "10px" }}>
                  {newOpen?.coupon_touch || 0}명이 혜택을 받았네요!
                </span>
              </div>
            </div>

            <div className="brand-container">
              <div className="brand-contents">
								<div
									className="brand-name"
									style={{ textAlign: "left" }}
								>
									{newOpen?.brand_name ? newOpen?.brand_name : "가게명"}
								</div>
								<a
									href={`https://map.naver.com/v5/search/${encodeURI(
									newOpen?.location
									)}`}
									target="blank"
									title="지도"
								>
									<div className="brand-position">
										{newOpen?.address ? newOpen?.address+newOpen?.address_detail : "가게주소"}
									</div>
								</a>
                <div
                  className="brand-description"
                  style={{ width: "320px", height: "auto" }}
                >
                  {newOpen?.description ? newOpen?.description?.split("\n").map((line, idx) => {
                    return <div key={idx}>{line}</div>;
                  }) : "가게 설명"}
                </div>

                <div className="brand-time-tel">
                  <div className="brand-time">
                    <div className="brand-time-name">
                      <img
                        className="time-image"
                        src="../../asset/a-icon-time-normal.png"
                        alt="time"
                      />
                      Time
                    </div>
                    <div className="operation-time">
											{findDay ? (
												<div>
													{findDay?.closed
														? "휴일 : 00:00 ~ 00:00"
														: "영업중 : " +
															findDay?.start_hour +
															"~" +
															findDay?.end_hour}
													</div>
											) : (
												"휴일 or 영업중 : 00:00 ~ 00:00"
											)}
                      <Dropdown
                        trigger={["hover"]}
                        onVisibleChange={(e) => {
                          set_operation_visible(e);
                        }}
                        visible={operation_visible}
                        destroyPopupOnHide={true}
                        arrow={false}
                        overlay={
                          <div>
                            {businessHours?.map((hour, hour_idx) => {
                              return (
                                <div key={hour_idx}>
                                  {hour?.day}요일:{" "}
                                  {hour?.closed
                                    ? "휴무"
                                    : hour.start_hour + "~" + hour.end_hour}
                                </div>
                              );
                            })}
                          </div>
                        }
                        overlayStyle={{
                          position: "absolute",
                          backgroundColor: "rgba(0, 0, 0, 0.85)",
                          padding: "14px",
                          fontSize: "14px",
                          lineHeight: "19px",
                          color: "#FFFFFF",
                          borderRadius: "5px",
                          display: operation_visible ? "flex" : "none",
                        }}
                      >
                        <img
                          className="time-image"
                          style={{ marginLeft: "5px" }}
                          src="../../asset/button_more_info_arrow.png"
                          alt="time"
                        />
                      </Dropdown>
                    </div>
                  </div>
                  <div className="brand-tel">
                    <div className="brand-time-name">
                      <img
                        className="time-image"
                        src="../../asset/a-icon-phone-normal.png"
                        alt="tel"
                      />
                      Tel
                    </div>
                    <div
                      className="operation-time"
                      style={{ textDecoration: "underline" }}
                    >
                      {newOpen?.phone_number}
                    </div>
                  </div>
                </div>
              </div>

              <div className="brand-mall-image">
                {/* 가게 안 이미지들 */}
                <HorizontalCarousel
                  photo={newOpen?.photo_in_mall}
                  flag_change={flag_change}
                  flag={flag}
                />

                <div className="row">
                  <div className="menu-coupon">
                    <div
                      className="menu"
                      onClick={() => {
                        set_menu_modal(true);
                        flag_change();
                        set_select_menu(menuList[0]?.name);
                      }}
                    >
                      메뉴 더보기
                    </div>
                    <div
                      className="coupon"
                      onClick={() => {
                        set_coupon_modal(true);
                        flag_change();
                      }}
                    >
                      <img
                        className="coupon-image"
                        src="../../asset/a-icon-reply-normal.png"
                        alt="main-menu"
                      />
                      방문 혜택 보기
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-menu">
              <img
                className="main-menu-image"
                src="../../asset/rectangle.png"
                alt="main-menu"
              />
              대표메뉴
            </div>

            <div className="row">
              {menuList?.map((menu_item, menu_idx) => {
                if (menu_item?.main_menu) {
                  return (
                    <div className="menu-container" key={menu_idx}>
                      <img
                        className="menu-image"
                        src={menu_item?.photo[0]?.url}
                        alt="menu"
                      />
                      <div className="menu-name">
                        <div className="menu-name-detail">
                          {menu_item?.name}
                        </div>
                        <div className="menu-price">
                          {numb(menu_item?.price)}원
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
      </Styled>

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
            height: "90%",
          },
        }}
        isOpen={menu_modal}
        onRequestClose={close_menu_modal}
        ariaHideApp={false}
      >
        <StyledModal>
          <img
            className="close"
            src="../../asset/a-icon-cancle-normal.png"
            alt="close"
            onClick={() => {
              set_menu_modal(false);
              flag_change();
            }}
          />

          <div className="brand-menu-detail">{newOpen?.brand_name}의 메뉴</div>
          <div className="brand-menu-description">
            어머, 이건 꼭 먹어봐야해!
          </div>

          <Carousel
            showThumbs={false}
            showStatus={false}
            axis={"horizontal"}
            interval={100000}
            autoPlay={false}
            autoFocus={false}
            width={"500px"}
            showArrows={true}
            emulateTouch={true}
            infiniteLoop
            showIndicators={false}
            onChange={(e) => {
              set_select_menu_photo(e);
            }}
            ref={carousel_ref}
          >
            {newOpen?.menu
              ?.find((menu) => {
                return menu?.name === select_menu;
              })
              ?.photo?.map((photo_item, photo_idx) => {
                return (
                  <img
                    src={photo_item?.url}
                    style={{
                      width: "500px",
                      height: "500px",
                      borderRadius: "10px",
                    }}
                    key={photo_idx}
                    alt="photo_item"
                  />
                );
              })}
          </Carousel>

          <div className="menu-name" style={{ color: "#FFFFFF" }}>
            {
              menuList?.find((menu) => {
                return menu?.name === select_menu;
              })?.name
            }
          </div>

          <div className="menu-detail">
            <div style={{ flex: 1 }}>
              {numb(
                menuList?.find((menu) => {
                  return menu?.name === select_menu;
                })?.price
              )}
              원
            </div>
            <div>
              {select_menu_photo + 1}/
              {
                menuList?.find((menu) => {
                  return menu?.name === select_menu;
                })?.photo?.length
              }
            </div>
          </div>

          <div className="column" style={{ margin: "27px" }}>
            {menuList?.map((menu, menu_idx) => {
              return (
                <div className="menu-row" key={menu_idx}>
                  <div className="menu-font">{menu?.name}</div>
                  <img
                    className="camera"
                    src="../../asset/button_photo_line.png"
                    alt="camera"
                    onClick={() => {
                      set_select_menu(menu?.name);
                      set_select_menu_photo(0);
                      handle_previous();
                    }}
                  />
                  <div className="bar"></div>
                  <div className="menu-font">{numb(menu?.price)}원</div>
                </div>
              );
            })}
          </div>
        </StyledModal>
      </Modal>

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
        isOpen={coupon_modal}
        onRequestClose={close_coupon_modal}
        ariaHideApp={false}
      >
        <StyledModal>
          <img
            className="close"
            src="../../asset/a-icon-cancle-normal.png"
            alt="close"
            onClick={() => {
              set_coupon_modal(false);
              flag_change();
            }}
          />

          <div className="brand-menu-detail" style={{ marginBottom: "30px" }}>
            선유기지 방문 혜택
          </div>

          {evnetList.map((event, event_idx) => {
            return (
              <div className="coupon-list" key={event_idx}>
                <img
                  src="../../asset/image_coupone_blue.png"
                  style={{
                    width: "444px",
                    position: "absolute",
                  }}
                  alt="coupon"
                />
                <div className="column">
                  <div className="coupon-number">
                    <div className="coupon-content" style={{ flex: 1 }}>
                      혜택1
                    </div>
                    <div className="coupon-content">선유기지</div>
                  </div>
                  <div className="coupon-detail">{event?.content}</div>
                  <div className="coupon-date">
                    {event?.start_date} ~ {event?.end_date}
                  </div>
                </div>
              </div>
            );
          })}
        </StyledModal>
      </Modal>

      {/* 입력폼 */}
      <div
        style={{
          width: 1024,
          marginTop: 30,
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid #E2E2E2",
          boxSizing: "border-box",
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          paddingTop: 50,
          paddingBottom: 50,
          paddingLeft: 82,
          paddingRight: 82,
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 10,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ width: 380, textAlign: "left", marginRight: 100 }}>
          {/* 로고 */}
          <div className={"input-title"}>1. 로고(필수, 1장)</div>
          <div id="logo-div" style={{ marginTop: 7 }} tabIndex={0}>
            {!newOpen?.logo ? (
              <label style={{ cursor: "pointer" }}>
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e: any) => {
                    uploadPhotoToFB(
                      e.target.files[0],
                      "LogoImage/" + e.target.files[0].name,
                      "logo"
                    );
                  }}
                  accept="image/png, image/jpeg"
                />
                <img
                  alt="button"
                  src={"../../../asset/button_image_add.png"}
                  style={{
                    width: 65,
                    height: 65,
                    borderRadius: 35,
                    overflow: "hidden",
                  }}
                ></img>
              </label>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  whiteSpace: "nowrap",
                }}
              >
                <a
                  href={newOpen?.logo?.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 65,
                    height: 65,
                    borderRadius: 65,
                    overflow: "hidden",
                    border: "1px solid #c4c4c4",
                  }}
                >
                  <img
                    className="image"
                    src={newOpen?.logo}
                    style={{ width: 65, height: 65 }}
                    alt="썸네일"
                  />
                </a>
                <div>
                  <button
                    className="image-delete-button"
                    style={{
                      marginLeft: -10,
                      marginTop: -10,
                      backgroundImage: "url('/asset/button_image_delete.png')",
                    }}
                    onClick={() => {
                      setNewOpen(
                        produce((draft: any) => {
                          draft.logo = null;
                        })
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 업종 */}
          <div className={"input-title"}>2.업종 (필수)</div>
          <div>
            <select
              id="business-type"
              placeholder="선택하세요"
              style={{ width: "100%", height: 40, marginTop: 10 }}
              value={!newOpen?.business_type ? "" : newOpen?.business_type}
              onChange={(data) => {
                const businessType = data.target.value;
                if (businessType === "기타") {
                  $("#business-type-detail-div").css("display", "block");
                  setNewOpen(
                    produce((draft: any) => {
                      draft.business_type = "";
                    })
                  );
                } else {
                  $("#business-type-detail-div").css("display", "none");
                  setNewOpen(
                    produce((draft: any) => {
                      draft.business_type = businessType;
                    })
                  );
                }
              }}
            >
              <option key="">선택</option>
              <option key="밥집">밥집</option>
              <option key="술집">술집</option>
              <option key="카페">카페</option>
              <option key="네일&속눈썹">네일&속눈썹</option>
              <option key="헤어샵">헤어샵</option>
              <option key="기타">기타</option>
            </select>
            <div id="business-type-detail-div" style={{ display: "none" }}>
              <input
                id="business-type-detail"
                placeholder="업종을 알려주세요"
                style={{ width: "100%", marginTop: 7 }}
                onChange={(e) => {
                  setNewOpen(
                    produce((draft: any) => {
                      draft.business_type_detail = e.target.value;
                    })
                  );
                }}
              />
            </div>
          </div>

          {/* 상호명 */}
          <div className={"input-title"}>3. 상호명(필수)</div>
          <div>
            <input
              id="brand-name"
              placeholder="상호명을 입력하세요"
              style={{ width: "100%", marginTop: 7 }}
              value={!newOpen?.brand_name ? "" : newOpen.brand_name}
              onChange={(e) => {
                setNewOpen(
                  produce((draft: any) => {
                    draft.brand_name = e.target.value;
                  })
                );
              }}
            />
          </div>

          {/* 사업장 주소 */}
          <div className={"input-title"}>4. 사업장 주소(필수)</div>
          <div style={{ marginTop: 5 }}>
            <span className="span-info">
              고객이 지도에서 검색할 수 있는 정확한 위치를 입력해주세요
            </span>
          </div>
          <div style={{ marginTop: 7 }}>
            <input
              id="address"
              placeholder="사업장 주소를 입력하세요"
              style={{ width: "100%", marginTop: 7 }}
              readOnly
              value={!newOpen?.address ? "" : newOpen?.address}
            />
            <button
              className="primary-button"
              style={{
                marginLeft: -58,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 15,
                paddingRight: 15,
              }}
              onClick={() => {
                setPostCodePopup(true);
              }}
            >
              검색
            </button>
            <div>
              <input
                id="address-detail"
                placeholder="나머지 주소"
                style={{ width: "100%", marginTop: 7 }}
                value={!newOpen?.address_detail ? "" : newOpen?.address_detail}
                onChange={(e) => {
                  setNewOpen(
                    produce((draft: any) => {
                      draft.address_detail = e.target.value;
                    })
                  );
                }}
              />
            </div>
            {postCodePopup === true ? (
              <PostCodePopup
                postCodeSuccess={postCodeSuccess}
                modalClose={modalClose}
              />
            ) : (
              <div />
            )}
          </div>

          {/* 가게 설명 */}
          <div className={"input-title"}>5. 가게 설명</div>
          <div>
            <textarea
              id="description"
              placeholder="고객에 어필할 수 있는 짧은 홍보글을 입력하세요"
              wrap="off"
              style={{
                resize: "none",
                width: 360,
                height: 80,
                border: "1px solid #D1D1D1",
                borderRadius: 5,
                padding: 10,
              }}
              rows={3}
              value={!newOpen?.description ? "" : newOpen?.description}
              onChange={(e) => {
                const rows = e.target.rows;
                const numberOfLines =
                  (e.target.value.match(/\n/g) || []).length + 1;
                if (numberOfLines > rows) {
                  return;
                } else {
                  setNewOpen(
                    produce((draft: any) => {
                      draft.description = e.target.value;
                    })
                  );
                }
              }}
            />
          </div>

          {/* 가게 전화번호 */}
          <div className={"input-title"}>6. 가게 전화번호</div>
          <div>
            <input
              id="store_number"
              type="text"
              placeholder="000-0000-0000"
              style={{ width: 180, marginTop: 7 }}
              value={!newOpen?.store_number ? "" : newOpen?.store_number}
              onChange={(e) => {
                let storeNumber = e.target.value;
                const regex = /^[0-9\b-]{0,13}$/;
                if (regex.test(storeNumber)) {
                  setNewOpen(
                    produce((draft: any) => {
                      draft.store_number = storeNumber;
                    })
                  );
                }
              }}
            />
          </div>

				{/* 영업시간 */}
				<div className={"input-title"}>7. 영업시간 (필수)</div>
					<span className="span-info">
						요일별 영업시간을 입력해주세요, 입력하지 않은 요일은 ‘휴무'로 노출됩니다
					</span>
          <div
            style={{ marginTop: 7, display: "flex", alignItems: "flex-start" }}
          >
            {businessHours.map((item, idx) => {
              return (
                <div
                  className={!item.closed ? "select-button" : "unselect-button"}
                  onClick={() => {
                    setBusinessHours(
                      produce((draft: any) => {
                        draft[idx].closed = !draft[idx].closed;
                      })
                    );
                  }}
                  key={idx}
                >
                  {item.day}
                </div>
              );
            })}
          </div>
          <div>
            {businessHours.map((item, idx) => {
              if (item.closed === false) {
                return (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-start",
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D1D1D1",
                      borderRadius: 5,
                      width: 360,
                      height: 20,
                    }}
                    key={idx}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 15,
                        borderRightWidth: 1,
                        borderRightColor: "#D1D1D1",
                        fontSize: "14px",
                        color: "#3E3F41",
                      }}
                    >
                      {item.day}요일
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 20,
                        top: 12,
                        left: 70,
                        backgroundColor: "#D1D1D1",
                      }}
                    />
                    <input
                      type="time"
                      placeholder="00:00 ~ 00:00"
                      style={{
                        width: 140,
                        border: "none",
                        height: 20,
                        marginLeft: 60,
                      }}
                      value={item.start_hour}
                      onChange={(e) => {
                        const hour = e.target.value;
                        setBusinessHours(
                          produce((draft: any) => {
                            draft[idx].start_hour = hour;
                          })
                        );
                      }}
                    />
                    <div>~</div>
                    <input
                      type="time"
                      placeholder="00:00 ~ 00:00"
                      style={{ width: 140, border: "none", height: 20 }}
                      value={item.end_hour}
                      onChange={(e) => {
                        const hour = e.target.value;
                        setBusinessHours(
                          produce((draft: any) => {
                            draft[idx].end_hour = hour;
                          })
                        );
                      }}
                    />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>

        <div style={{ width: 380, textAlign: "left" }}>
          {/* 매장사진 */}
          <div className={"input-title"}>8. 매장사진(필수, 최대 10장)</div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              height: 120,
              marginTop: 7,
              border: "1px solid #D1D1D1",
              boxSizing: "border-box",
              borderRadius: 5,
              overflowX: "scroll",
              backgroundColor: "#FBFBFB",
            }}
          >
            {newOpen?.photo_in_mall?.length < 10 || !newOpen?.photo_in_mall ? (
              <label
                style={{ cursor: "pointer", marginTop: 37.5, marginRight: 10 }}
              >
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e: any) => {
                    for (let i = 0; i < e.target.files.length; i++) {
                      uploadPhotoToFB(
                        e.target.files[i],
                        "PhotoInMall/" + e.target.files[i].name,
                        "photo_in_mall"
                      );
                    }
                  }}
                  accept="image/png, image/jpeg"
                  multiple
                />
                <img
                  src={"/asset/button_image_add.png"}
                  style={{ width: 45, height: 45 }}
                  alt="button"
                ></img>
              </label>
            ) : (
              <div />
            )}
            {newOpen?.photo_in_mall?.map((item, idx) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    whiteSpace: "nowrap",
                  }}
                  key={idx}
                >
                  <a
                    href={item}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: 80,
                      height: 80,
                      marginTop: 20,
                      marginRight: 20,
                    }}
                  >
                    <img
                      className="image"
                      src={item}
                      style={{ width: 80, height: 80 }}
                      alt="썸네일"
                    />
                  </a>
                  <div>
                    <button
                      className="image-delete-button"
                      style={{
                        marginLeft: -30,
                        marginTop: 10,
                        backgroundImage:
                          "url('/asset/button_image_delete.png')",
                      }}
                      onClick={() => {
                        setNewOpen(
                          produce((draft: any) => {
                            draft.photo_in_mall.splice(idx, 1);
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 메뉴 등록 */}
          <div className={"input-title"}>
            9. 메뉴 등록 (필수, 등록 개수제한 없으며 메뉴당 사진 최대 3장)
          </div>
          <div style={{ marginTop: 5 }}>
            <span className="span-info">
              체크박스에 클릭 시 대표메뉴로 설정되어 메인에 노출됩니다 (1/3)
            </span>
          </div>
          <div style={{ marginTop: 7 }}>
            {menuList?.map((item, idx) => {
              return (
                <div style={{ marginBottom: 11 }} key={idx}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                      height: 40,
                      marginBottom: 5,
                    }}
                  >
                    <div style={{ height: 40, marginRight: 6 }}>
                      <input
                        type="checkbox"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          marginTop: 10,
                        }}
                        checked={item.main_menu}
                        onChange={(e) => {
                          setMenuList(
                            produce((draft: any) => {
                              draft[idx].main_menu = e.target.checked;
                            })
                          );
                        }}
                      />
                    </div>
                    <div style={{ height: 40 }}>
                      <input
                        placeholder="메뉴명"
                        style={{ width: 215, height: 40, marginRight: 5 }}
                        value={item.name}
                        onChange={(data) => {
                          setMenuList(
                            produce((draft: any) => {
                              draft[idx].name = data.target.value;
                            })
                          );
                        }}
                      />
                      <input
                        type="number"
                        placeholder="1,000"
                        style={{ width: 80, height: 40, marginRight: 6 }}
                        value={item.price}
                        onChange={(data) => {
                          setMenuList(
                            produce((draft: any) => {
                              draft[idx].price = data.target.value;
                            })
                          );
                        }}
                      />
                      <button
                        className="normal-button"
                        style={{ width: 40, height: 40 }}
                        onClick={() => {
                          setMenuList(
                            produce((draft: any) => {
                              draft.splice(idx, 1);
                            })
                          );
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      border: "1px solid #D1D1D1",
                      boxSizing: "border-box",
                      borderRadius: 5,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 6,
                      paddingRight: 6,
                    }}
                  >
                    <label style={{ cursor: "pointer", marginRight: 15 }}>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        onChange={(e: any) => {
                          for (let i = 0; i < e.target.files.length; i++) {
                            uploadPhotoToFB(
                              e.target.files[i],
                              "MenuPhoto/" + e.target.files[i].name,
                              "menu_photo",
                              idx
                            );
                          }
                        }}
                        accept="image/png, image/jpeg"
                        multiple
                      />
                      <img
                        alt="button_add"
                        src={"/asset/button_photo_add.png"}
                        style={{ width: 45, height: 25 }}
                      ></img>
                    </label>
                    <div>
                      {item.photo?.map((photoItem, photoIdx) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              whiteSpace: "nowrap",
                              height: 25,
                              marginTop: 3,
                            }}
                            key={photoIdx}
                          >
                            <a
                              href={photoItem.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                width: 270,
                                height: 25,
                                verticalAlign: "middle",
                                fontSize: "14px",
                              }}
                              key={idx}
                            >
                              {photoItem.fileName}
                            </a>
                            <div>
                              <button
                                className="image-delete-button"
                                style={{
                                  backgroundImage:
                                    "url('/asset/button_image_delete.png')",
                                }}
                                onClick={() => {
                                  setMenuList(
                                    produce((draft: any) => {
                                      draft[idx].photo.splice(photoIdx, 1);
                                    })
                                  );
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                height: 40,
                marginBottom: 5,
              }}
            >
              <div style={{ height: 40, marginRight: 6 }}>
                <input
                  id="menu-main-menu"
                  type="checkbox"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                />
              </div>
              <div style={{ height: 40 }}>
                <input
                  id="menu-name"
                  placeholder="메뉴명"
                  style={{ width: 215, height: 40, marginRight: 5 }}
                />
                <input
                  id="menu-price"
                  type="number"
                  placeholder="1,000"
                  style={{ width: 80, height: 40, marginRight: 6 }}
                />
                <button
                  className="primary-button"
                  style={{ width: 40, height: 40 }}
                  onClick={() => {
                    const menuName = $("#menu-name");
                    const menuPrice = $("#menu-price");
                    const menuMainMenu = $("#menu-main-menu");
                    const childMenu = {
                      name: menuName.val(),
                      price: menuPrice.val(),
                      photo: newMenuPhoto,
                      temp_photo: newMenuPhoto,
                      main_menu: menuMainMenu.is(":checked"),
                    };
                    setMenuList(
                      produce((draft: any) => {
                        draft.push(childMenu);
                      })
                    );
                    menuName.val("");
                    menuPrice.val("");
                    menuMainMenu.prop("checked", false);
                    setNewMenuPhoto([]);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                border: "1px solid #D1D1D1",
                boxSizing: "border-box",
                borderRadius: 5,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 6,
                paddingRight: 6,
              }}
            >
              <label style={{ cursor: "pointer", marginRight: 15 }}>
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e: any) => {
                    for (let i = 0; i < e.target.files.length; i++) {
                      uploadPhotoToFB(
                        e.target.files[i],
                        "MenuPhoto/" + e.target.files[i].name,
                        "newMenu_photo"
                      );
                    }
                  }}
                  accept="image/png, image/jpeg"
                  multiple
                />
                <img
                  alt="button_add"
                  src={"/asset/button_photo_add.png"}
                  style={{ width: 45, height: 25 }}
                ></img>
              </label>
              <div>
                {newMenuPhoto?.map((item, idx) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        whiteSpace: "nowrap",
                        height: 25,
                        marginTop: 3,
                      }}
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 270,
                          height: 25,
                          verticalAlign: "middle",
                          fontSize: "14px",
                        }}
                        key={idx}
                      >
                        {item.fileName}
                      </a>
                      <div>
                        <button
                          className="image-delete-button"
                          style={{
                            backgroundImage:
                              "url('/asset/button_image_delete.png')",
                          }}
                          onClick={() => {
                            setNewMenuPhoto(
                              produce((draft: any) => {
                                draft.splice(idx, 1);
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 혜택 등록 */}
          <div className={"input-title"}>
            10. 혜택 등록 (옵션, 등록 개수제한 없음)
          </div>
          <div style={{ marginTop: 7 }}>
            {evnetList?.map((item, idx) => {
              const eventCalendar = $("#event-calendar-" + idx);
              if (item.date_check) {
                eventCalendar.css("display", "flex");
              }
              return (
                <div style={{ marginBottom: 15 }} key={idx}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <textarea
                      rows={10}
                      placeholder="<예> 오픈이벤트로 500원 할인&#13;&#10;<예> 가오픈 기간 동안만 음료 1+1 증정"
                      style={{
                        resize: "none",
                        width: 297,
                        height: "35px",
                        border: "1px solid #D1D1D1",
                        borderRadius: 5,
                        padding: 10,
                        marginRight: 6,
                      }}
                      value={item.content}
                      onChange={(e) => {
                        setEventList(
                          produce((draft: any) => {
                            draft[idx].content = e.target.value;
                          })
                        );
                      }}
                    />
                    <button
                      className="normal-button"
                      style={{ width: 40, height: 40, marginTop: 10 }}
                      onClick={() => {
                        setEventList(
                          produce((draft: any) => {
                            draft.splice(idx, 1);
                          })
                        );
                      }}
                    >
                      X
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginTop: 5,
                    }}
                  >
                    <input
                      id={"event-check-" + idx}
                      type="checkbox"
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      checked={item.date_check}
                      onChange={(e) => {
                        const eventCalendar = $("#event-calendar-" + idx);

                        if (e.target.checked) {
                          eventCalendar.css("display", "flex");
                        } else {
                          eventCalendar.css("display", "none");
                        }

                        setEventList(
                          produce((draft: any) => {
                            draft[idx].date_check = e.target.checked;
                          })
                        );
                      }}
                    />
                    <span style={{ marginTop: 4 }}>
                      혜택에 기간이 있는 경우
                    </span>
                  </div>
                  <div
                    id={"event-calendar-" + idx}
                    style={{
                      display: "none",
                      alignItems: "flex-start",
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D1D1D1",
                      borderRadius: 5,
                    }}
                  >
                    <img
                      alt="calendar"
                      src={"/asset/icon_calendar.png"}
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    ></img>
                    <div
                      style={{
                        width: 1,
                        height: 20,
                        backgroundColor: "#D1D1D1",
                        marginRight: 10,
                      }}
                    />
                    <DatePickerComponent
                      pStartDate={new Date(item.start_date)}
                      pEndDate={new Date(item.end_date)}
                      setSearchDateString={(data) =>
                        setEventStartDate(data, idx)
                      }
                      setSelectedEndDateString={(data) =>
                        setEventEndDate(data, idx)
                      }
                      isRangeSearch={true}
                    />
                  </div>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <textarea
                id="new-event-content"
                rows={10}
                placeholder="<예> 오픈이벤트로 500원 할인&#13;&#10;<예> 가오픈 기간 동안만 음료 1+1 증정"
                style={{
                  resize: "none",
                  width: 297,
                  height: "35px",
                  border: "1px solid #D1D1D1",
                  borderRadius: 5,
                  padding: 10,
                  marginRight: 6,
                }}
              />
              <button
                className="primary-button"
                style={{ width: 40, height: 40, marginTop: 10 }}
                onClick={() => {
                  const newEventContent = $("#new-event-content");
                  const newEventhCheck = $("#new-event-check");
                  const newEventCalendar = $("#new-event-calendar");
                  const newEvent = {
                    content: newEventContent.val(),
                    date_check: newEventhCheck.is(":checked"),
                    start_date: startDate,
                    end_date: endDate,
                  };
                  setEventList(
                    produce((draft: any) => {
                      draft.push(newEvent);
                    })
                  );
                  newEventContent.val("");
                  newEventhCheck.prop("checked", false);
                  newEventCalendar.css("display", "none");
                  setStartDate(new Date());
                  setEndDate(new Date());
                }}
              >
                +
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginTop: 5,
              }}
            >
              <input
                id="new-event-check"
                type="checkbox"
                style={{ width: 20, height: 20, marginRight: 5 }}
                onChange={(e) => {
                  const newEventCalendar = $("#new-event-calendar");
                  if (e.target.checked) {
                    newEventCalendar.css("display", "flex");
                  } else {
                    newEventCalendar.css("display", "none");
                  }
                }}
              />
              <span style={{ marginTop: 4 }}>혜택에 기간이 있는 경우</span>
            </div>
            <div
              id="new-event-calendar"
              style={{
                display: "none",
                alignItems: "flex-start",
                marginTop: 10,
                padding: 10,
                backgroundColor: "#FFFFFF",
                border: "1px solid #D1D1D1",
                borderRadius: 5,
              }}
            >
              <img
                alt="calendar"
                src={"/asset/icon_calendar.png"}
                style={{ width: 20, height: 20, marginRight: 10 }}
              ></img>
              <div
                style={{
                  width: 1,
                  height: 20,
                  backgroundColor: "#D1D1D1",
                  marginRight: 10,
                }}
              />
              <DatePickerComponent
                pStartDate={new Date()}
                pEndDate={new Date()}
                setSearchDateString={(data) => setStartDate(data)}
                setSelectedEndDateString={(data) => setEndDate(data)}
                isRangeSearch={true}
              />
            </div>
          </div>

          <div className={"input-title"}>11. 정식 오픈일(옵션)</div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginTop: 10,
              padding: 10,
              backgroundColor: "#FFFFFF",
              border: "1px solid #D1D1D1",
              borderRadius: 5,
              width: 170,
              height: 20,
            }}
          >
            <img
              alt="calendar"
              src={"/asset/icon_calendar.png"}
              style={{ width: 20, height: 20, marginRight: 10 }}
            ></img>
            <div
              style={{
                width: 1,
                height: 20,
                backgroundColor: "#D1D1D1",
                marginRight: 10,
              }}
            />
            {newOpen?.open_date ? (
              <div>
                <div></div>
                <DatePickerComponent
                  pStartDate={new Date(newOpen.open_date)}
                  pEndDate={null}
                  setSearchDateString={(data) => setOpenDate(data)}
                  setSelectedEndDateString={(data) => {}}
                  isRangeSearch={false}
                  isClearable={true}
                />
              </div>
            ) : (
              <div>
                <DatePickerComponent
                  pStartDate={null}
                  pEndDate={null}
                  setSearchDateString={(data) => setOpenDate(data)}
                  setSelectedEndDateString={(data) => {}}
                  isRangeSearch={false}
                  isClearable={true}
                />
              </div>
            )}
          </div>
          <div className={"input-title"}>12. 담당자 전화번호(필수)</div>
          <div>
            <input
              id="phone-number"
              type="text"
              placeholder="000-0000-0000"
              style={{ width: 180, marginTop: 7 }}
              value={!newOpen?.phone_number ? "" : newOpen?.phone_number}
              onChange={(e) => {
                const phoneNumber = e.target.value;
                const regex = /^[0-9\b -]{0,13}$/;
                if (regex.test(phoneNumber)) {
                  setNewOpen(
                    produce((draft: any) => {
                      draft.phone_number = phoneNumber;
                    })
                  );
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 입점 신청하기 */}
      <div style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div
          id="duplicate-id"
          style={{ display: "none", fontSize: "14px", color: "#FF2E4C" }}
        >
          ID가 중복되었습니다. ID를 변경해주세요.
        </div>
        <button
          className="primary-button"
          style={{
            marginTop: 5,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 45,
            paddingRight: 45,
          }}
          onClick={() => submitUpdateNewOpen()}
        >
          {newOpen?.approved ? "수정하기" : "입점 신청하기"}
        </button>
        <div
          style={{
            marginTop: 13,
            marginBottom: 60,
            fontSize: "13px",
            lineHeight: "16px",
            color: "#D1D1D1",
          }}
        >
          최대한 빠르게 내부 검토 후 게시가 시작됩니다.
          <br />
          만일 수정사항이 있는 경우 담당자 번호로 연락 드리겠습니다.
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
          },
        }}
					isOpen={saveModal}
					onRequestClose={() => setSaveModal(false)}
					ariaHideApp={false}
				>
					<div style={{ textAlign: "center", padding: 20, justifyContent:'center' }}>
						<img
							style={{width:185, height:185}}
							src="../../asset/image_save_success.png"
							alt="success"
						/>
						<div style={{font:"Roboto", fontWeight:'bold', fontSize:"25px", color:"#3E3F41", marginTop:40}}>
							{newOpen?.approved ? "저장이 완료되었습니다." : "입점신청이 완료되었습니다!"} 
						</div>
						{newOpen?.approved ? (
							<div style={{font:"Spoqa Han Sans Neo", fontSize:"17px", color:"#3E3F41", marginTop:25}}>
								만일 수정사항이 있는 경우 담당자 번호로 연락 드리겠습니다.
							</div>	
						): (
							<div style={{font:"Spoqa Han Sans Neo", fontSize:"17px", color:"#3E3F41", marginTop:25}}>
								최대한 빠르게 내부 검토 후 게시가 시작됩니다.<br/>
								만일 수정사항이 있는 경우 담당자 번호로 연락 드리겠습니다.
							</div>	
						)}
						<div style={{marginTop:45,}}>
							<div style={{width:175, marginLeft:'auto', marginRight:'auto', paddingTop:15, paddingBottom:15, backgroundColor:"#2F80ED", borderRadius:5, cursor:'pointer',
						font:'Spoqa Han Sans Neo', fontWeight:'bold', fontSize:"14px", color:'#FFFFFF' }}
							onClick={() => setSaveModal(false)}>
								확인
							</div>
						</div>

					</div>
				</Modal>
      </div>
    </div>
  );
};

export default InputForm;

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 1440px;

  .row {
    display: flex;
    flex-direction: row;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .title-container {
    display: flex;
    flex-direction: row;
    padding-top: 25px;
    padding-bottom: 20px;
    padding-left: 32px;
  }

  .title {
    font-size: 25px;
    font-weight: 700;
    font-family: "yg-jalnan";
  }

  .love {
    width: 19px;
    height: 39px;
    margin-left: 10px;
  }

  .banner {
    width: 1440px;
    height: 500px;
    background-color: #fff9c1;
  }

  .category-list {
    display: flex;
    flex-direction: row;
    margin-top: 60px;
  }

  .category-button {
    width: 96px;
    height: 45px;
    border: 0px solid black;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    font-family: "apple";
    background-color: #ffffff;
    cursor: pointer;
  }

  .category-select-button {
    width: 96px;
    height: 45px;
    border: 0px solid black;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    font-family: "apple";
    background-color: #2d2d2d;
    cursor: pointer;
    color: #ffffff;
    border-radius: 47px;
  }

  .new-open-container {
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    padding: 17px 23px;
    width: 1000px;
    margin-top: 15px;
    background-color: #ffffff;
  }

  .remain-open {
    width: 65px;
    margin-top: 10px;
    color: #2f80ed;
    font-size: 14px;
    font-weight: bold;
  }

  .logo {
    border: 1px solid #c4c4c4;
    border-radius: 100px;
    width: 65px;
    height: 65px;
    align-items: center;
    justify-content: center;
    display: flex;
    margin-right: 23px;
  }

  .content-container {
    flex: 1;
  }

  .category-container {
    flex-direction: row;
    display: flex;
    height: 25px;
  }

  .category-name {
    font-size: 14px;
    font-weight: bold;
    color: #2f80ed;
    display: flex;
    flex: 1;
  }

  .like-numb {
    font-size: 14px;
    color: #ff2e4c;
    align-items: flex-end;
    display: flex;
    padding-right: 10px;
  }

  .brand-container {
    display: flex;
    flex-direction: row;
    margin-top: 8px;
  }

  .brand-contents {
    display: flex;
    flex-direction: column;
    max-width: 380px;
  }

  .brand-name {
    font-size: 21px;
    font-weight: bold;
    margin-right: 21px;
		margin-bottom: 5px;
  }

  .brand-position {
    display: flex;
    align-items: center;
    color: #6c757d;
    font-size: 12px;
    text-decoration: underline;
  }

  .brand-description {
    font-size: 16px;
    color: #6c757d;
    text-align: left;
    padding: 15px 0px;
    background-color: #ffffff;
    border-width: 0px;
    resize: none;
  }

  .brand-time {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-right: 30px;
  }

  .brand-tel {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }

  .brand-time-tel {
    flex-direction: row;
    display: flex;
  }

  .brand-time-name {
    color: #6c757d;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .time-image {
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }

  .operation-time {
    color: #6c757d;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 5px;
  }

  .brand-mall-image {
    display: flex;
    flex-direction: column;
    margin-left: 70px;
  }

  .mall-images {
    width: 153px;
    height: 153px;
    border: 1px solid #c4c4c4;
    border-radius: 10px;
    margin-right: 10px;
  }

  .menu-coupon {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    margin-top: 12px;
    padding-right: 10px;
  }

  .menu {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    padding: 5px 20px;
    font-size: 14px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .coupon {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    padding: 5px 20px;
    font-size: 14px;
    color: #ff2e4c;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .main-menu {
    display: flex;
    margin-top: 5px;
    color: #2f80ed;
    align-items: center;
    font-family: "NanumMyeongjo";
  }

  .main-menu-image {
    width: 15px;
    height: 7px;
    margin-right: 5px;
  }

  .menu-container {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    height: 47px;
    margin-right: 8px;
  }

  .menu-image {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .menu-name {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .menu-name-detail {
    padding: 11px;
    font-size: 14px;
    color: #6c757d;
    font-weight: bold;
  }

  .menu-price {
    padding: 11px;
    color: #6c757d;
    padding-right: 20px;
    font-size: 14px;
  }

  .coupon-image {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
`;

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .brand-menu-detail {
    font-size: 25px;
    font-weight: bold;
    margin-top: 10px;
  }

  .brand-menu-description {
    font-size: 14px;
    color: #6c757d;
    line-height: 24px;
    margin-bottom: 20px;
  }

  .banner {
    width: 500px;
    height: 500px;
    background-color: #fff9c1;
    border-radius: 5px;
  }

  .menu-row {
    display: flex;
    flex-direction: row;
    width: 500px;
    align-items: center;
    margin-bottom: 10px;
  }

  .menu-font {
    color: #6c757d;
    font-size: 16px;
    line-height: 24px;
  }

  .camera {
    width: 25px;
    height: 25px;
    margin-left: 8px;
    margin-right: 8px;
    cursor: pointer;
  }

  .bar {
    background-color: #e2e2e2;
    height: 1px;
    margin-right: 8px;
    flex: 1;
  }

  .menu-name {
    z-index: 999;
    color: black;
    position: absolute;
    top: 530px;
    width: 450px;
    padding-left: 10px;
    font-size: 19px;
    line-height: 24px;
    font-weight: bold;
  }

  .menu-detail {
    z-index: 999;
    color: #ffffff;
    position: absolute;
    top: 560px;
    width: 450px;
    padding-left: 10px;
    font-size: 14px;
    line-height: 24px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
  }

  .close {
    width: 24px;
    height: 24px;
    position: absolute;
    margin-left: 480px;
    margin-top: 10px;
    cursor: pointer;
  }

  .coupon-list {
    width: 444px;
    height: 212px;
    border-radius: 5px;
    margin-bottom: 12px;
  }

  .coupon-number {
    display: flex;
    flex-direction: row;
    padding: 25px 25px 13px 25px;
  }

  .coupon-content {
    font-size: 17px;
    font-weight: bold;
    color: #ffffff;
    z-index: 999;
    margin-bottom: 24px;
  }

  .coupon-detail {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    z-index: 999;
    padding: 0px 25px;
    margin-bottom: 12px;
  }

  .coupon-date {
    font-size: 16px;
    color: #bababa;
    z-index: 999;
    padding: 0px 25px;
    margin-bottom: 25px;
  }

  .coupon-container {
    z-index: 999;
    justify-content: center;
    display: flex;
  }

  .coupon-button {
    padding: 8px 25px;
    border-radius: 5px;
    background-color: #2d2d2d;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .column {
    display: flex;
    flex-direction: column;
  }
`;
