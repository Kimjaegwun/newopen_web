import { useEffect, useState, useRef } from "react";
import $ from "jquery";
import { useMutation, useQuery } from "@apollo/client";
import { Dropdown, Input } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GET_All_NEW_OPEN, UPDATE_COUPON_TOUCH } from "./mutation.gql";
import { numb } from "../utils/utils";
import Modal from "react-modal";
import HorizontalCarousel from "./components_mobile/HorizontalCarousel";
import styled from "styled-components";
import "../index.css";
import domtoimage from 'dom-to-image';
import HeaderMobile from "./components_mobile/HeaderMobile";
import FooterMobile from "./components_mobile/FooterMobile";
Modal.setAppElement();

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const MainMobile = () => {
  // 모바일 크기 계산
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 카테고리
  const category_list = ["전체", "밥집", "술집", "카페", "네일&속눈썹", "헤어샵", "기타"];
  const [select_category, set_select_category] = useState("전체");

  //전국 리스트
  const location_list = ["전국", "동대문", "강남", "강북", "문래"];
  const [select_loaction, set_select_location] = useState("전국");
  const [open_location, set_open_location] = useState(false);
  
  //브랜드 정렬
  const [select_sort, set_select_sort] = useState("인기순");

  // 시간 모달
  const [operation_visible, set_operation_visible] = useState(false);

  // 가게 안 flag
  const [flag, set_flag] = useState(false);
  const flag_change = () => {
    set_flag(!flag);
  };

  // 메뉴 사진 모달
  const [menu_modal, set_menu_modal] = useState(false);
  const close_menu_modal = () => {
    set_menu_modal(false);
    flag_change();
  };

  // 가게들 가져오기
  const [stores, set_stores] = useState([] as any);
  useQuery(GET_All_NEW_OPEN, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const sortStore = data.GetAllNewOpen.new_open?.slice().sort(function (a, b) {
        return b.coupon_touch - a.coupon_touch;
      });
      set_stores(sortStore);
    },
  });

  // 쿠폰 모달
  const [coupon_modal, set_coupon_modal] = useState(false);
  const close_coupon_modal = () => {
    set_coupon_modal(false);
    flag_change();
  };
  const [updateCouponTouch] = useMutation(UPDATE_COUPON_TOUCH);

  const [scan_modal, set_scan_modal] = useState(false);
  const close_scan_modal = () => {
    set_scan_modal(false);
  };
  const [select_coupon, set_select_coupon] = useState({} as any);

  // 선택한 가게
  const [select_store, set_select_store] = useState({} as any);
  const [select_menu, set_select_menu] = useState("");
  const [select_menu_photo, set_select_menu_photo] = useState(0);

  // 캐러셀 ref
  const carousel_ref = useRef<Carousel>(null);
  const handle_previous = () => {
    carousel_ref.current?.moveTo(0);
  };

  const couponSrc =  ["../../asset/image_coupone_blue.png", "../../asset/image_coupone_brown.png", "../../asset/image_coupone_green.png", "../../asset/image_coupone_purple.png", "../../asset/image_coupone_blue.png"];

  return (
    <>
      <Styled>
        <HeaderMobile/>

        {/* 배너 캐러셀 */}
        {/* <Carousel
          showThumbs={false}
          showStatus={false}
          axis={"horizontal"}
          interval={100000}
          autoPlay={false}
          autoFocus={false}
          width={windowDimensions.width}
          showArrows={false}
          emulateTouch={true}
          infiniteLoop
          showIndicators={!flag}
        > */}
        <div
          style={{
            height: 300,
            backgroundImage: "url(../../asset/image_mainbanner_mobile.png)",
            backgroundSize:'cover',
            backgroundRepeat:'no-repeat',
            zIndex:2,
          }}
          >
          <div className="center-div"
              style={{position:'relative', width:230, paddingTop:5, paddingBottom:5, marginTop:220, textAlign:'center', backgroundColor:'#FFFFFF',  border:'3px solid #2F80ED', borderRadius:5,
                      fontFamily:"Apple SD Gothic Neo", fontWeight:'bold', fontSize:"23px", cursor:'pointer'}}
                onClick={() => {
                  set_open_location(!open_location);
                }}             
              >
                {select_loaction}
                <img
                  className="arrow-image"
                  style={{top:11}}
                  src= {open_location ? "../../asset/arrow-up.png" : "../../asset/arrow-down.png"}
                  alt="time"
                  />
              </div>
              {location_list.map((cate, cate_index) => {
                return(
                  <div
                    className="center-div"
                    style={{display: open_location ? 'block' : 'none', width:230, paddingTop:10, paddingBottom:10, backgroundColor:"#FFFFFF", borderLeft:'0.5px solid grey', borderRight:'0.5px solid grey',
                      cursor:'pointer', borderBottom: cate_index == location_list.length-1 ? '0.5px solid grey' : 'none'}}
                    onClick= {() => {
                      set_select_location(cate);
                      set_open_location(false);
                    }}
                    key={cate}>
                      {cate}
                  </div>
                )
              })}
          </div>

        <div
          className="category"
          style={{
            width: windowDimensions.width,
          }}
        >
          <div
            className="category-container"
            style={{
              width: 96 * category_list.length,
            }}>
            {category_list.map((cate, cate_idx) => {
              if (cate === select_category) {
                return (
                  <div
                    className="category-select-button"
                    key={cate_idx}
                    onClick={() => {
                      set_select_category(cate);
                    }}
                  >
                    {cate}
                  </div>
                );
              } else {
               return (
                 <div
                   className="category-button"
                   key={cate_idx}
                   onClick={() => {
                     set_select_category(cate);
                   }}
                 >
                    {cate}
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="sort-list" style={{paddingRight:20}}>
          <div className="right"  style={select_sort=="최신순" ? { fontWeight:'bold', color:"#2D2D2D", cursor:'pointer'} : {fontWeight:'normal', color:'#BABABA', cursor:'pointer'}}
            onClick={() => {
              const sortStores = stores.slice().sort(function (a, b) {
                return b.createdAt - a.createdAt;
              });
              set_stores(sortStores);
              set_select_sort("최신순")}}>
            최신순
          </div>
          <div className="right" style={select_sort=="인기순" ? {fontWeight:'bold', color:"#2D2D2D", marginRight:10, cursor:'pointer'} : {fontWeight:'normal', color:'#BABABA', marginRight:10, cursor:'pointer'}}
            onClick={() => {
                const sortStores = stores.slice().sort(function (a, b) {
                  return b.coupon_touch - a.coupon_touch;
                });
                set_stores(sortStores);
                set_select_sort("인기순")}}>
            인기순
          </div>
        </div>
        
        {stores
          ?.filter((item: any) => {
            if (select_category === "전체") {
              return item;
            } else {
              return item?.business_type === select_category;
            }
          })?.filter((item:any) => {
            if(select_loaction ==="전국"){
              return item;
            }else{
              return item.address.includes(select_loaction);
            }
          })
          .map((store: any, str_idx) => {
            const {
              logo,
              business_type,
              brand_name,
              address,
              description,
              photo_in_mall,
              coupon_touch,
              business_hours,
              store_number,
              location,
            } = store;

            const find_day = business_hours?.find((item: any) => {
              return Number(item?.number) === new Date().getDay();
            });

            return (
              <div className="brand-container" key={str_idx}>
                <div
                  className="brand-category"
                  style={{ width: windowDimensions.width }}
                >
                  <div className="brand-select-cate">#{business_type}</div>
                  <div className="brand-coupon-down">
                    <span style={{ marginRight: "5px" }}>👀 </span>
                    {coupon_touch || 0}명이 혜택을 받았네요!
                  </div>
                </div>

                <div className="brand-category">
                  <img alt="logo" className="brand-logo" src={logo} />
                  <div className="column" style={{ alignItems: "flex-start" }}>
                    <div className="brand-name">{brand_name}</div>
                    <a
                      href={`https://m.map.naver.com/search2/search.naver?query=${encodeURI(
                        location
                      )}&sm=hty&style=v5#/map`}
                      target="blank"
                      title="지도"
                    >
                      <div className="brand-location">
                        {address}&gt;
                      </div>
                    </a>
                  </div>
                </div>

                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 5 }}
                  disabled
                  defaultValue={description}
                  style={{
                    width: windowDimensions.width - 40,
                    height: "auto",
                    background: "#FFFFFF",
                    color: "#6C757D",
                    fontSize: "14px",
                    padding: "20px",
                    borderWidth: "0px",
                    marginBottom: "10px",
                  }}
                />

                <div className="operation-time-container">
                  <img
                  alt="icon-time"
                    src="../../asset/a-icon-time-normal.png"
                    style={{ height: "18px", width: "18px" }}
                  />
                  <div className="text-gray-font">Time</div>
                  <div className="operation-detail">
                    {" "}
                    {find_day?.closed
                      ? "휴일 : 00:00 ~ 00:00"
                      : "영업중 : " + find_day?.hour}
                  </div>

                  <Dropdown
                    trigger={["click"]}
                    onVisibleChange={(e) => {
                      set_operation_visible(e);
                    }}
                    visible={operation_visible}
                    destroyPopupOnHide={true}
                    arrow={false}
                    overlay={
                      <div>
                        {business_hours?.map((hour, hour_idx) => {
                          return (
                            <div key={hour_idx}>
                              {hour?.day}요일:{" "}
                              {hour?.closed ? "휴무" : hour?.hour}
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
                      style={{
                        height: "25px",
                        width: "25px",
                        marginLeft: "8px",
                      }}
                      src="../../asset/button_more_info_arrow.png"
                      alt="time"
                    />
                  </Dropdown>
                </div>

                <div className="operation-tel-container">
                  <img
                    alt="phone"
                    src="../../asset/a-icon-phone-normal.png"
                    style={{ height: "18px", width: "18px" }}
                  />
                  <div className="text-gray-font">Tel</div>
                  <a
                    href={`tel:${store_number}`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <div
                      className="operation-detail"
                      style={{
                        marginLeft: "30px",
                        textDecorationLine: "underline",
                      }}
                    >
                      {store_number}
                    </div>
                  </a>
                </div>

                {/* 가게 안 이미지들 */}
                <div style={{}}>
                <HorizontalCarousel
                  photo={photo_in_mall}
                  flag_change={flag_change}
                  flag={flag}
                />
                </div>

                <div className="menu-coupon-container">
                  <div
                    className="menu-styles"
                    onClick={() => {
                      set_menu_modal(true);
                      flag_change();
                      set_select_store(store);
                      set_select_menu(store?.menu[0]?.name);
                    }}
                  >
                    <div className="menu-font">메뉴 더보기</div>
                  </div>
                  <div
                    className="menu-styles"
                    style={{ padding: "10px 20px 10px 5px" }}
                    onClick={() => {
                      set_coupon_modal(true);
                      flag_change();
                      set_select_store(store);
                    }}
                  >
                    <div className="coupon-font">
                      <img
                        alt="reply"
                        src="../../asset/a-icon-reply-normal.png"
                        style={{ width: "18px", height: "18px" }}
                      />
                      방문 혜택 보기
                    </div>
                  </div>
                </div>
                {store.menu?.filter(x => x.main_menu == true)?.length > 0 ?(
                  <div>
                    <div className="main-menu">
                      <img
                        className="main-menu-image"
                        src="../../asset/rectangle.png"
                        alt="main-menu"
                      />
                      대표메뉴 
                    </div>
                    <div className="row main-menu-container" style={{}}>
                      {store.menu?.filter(x => x.main_menu == true).map((menu_item, menu_idx) => {
                          return (
                            <div className="menu-container"
                            onClick={() => {
                              set_menu_modal(true);
                              flag_change();
                              set_select_store(store);
                              set_select_menu(menu_item?.name);
                            }}
                          key={menu_idx}>
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
                        })}
                    </div>
                  </div>
                ) : null}
                <div style={{ height: "10px", backgroundColor: "#F6F6F6" }} />
              </div>
            );
          })}

        <div
          style={{
            backgroundColor: "#EAFAFF",
            width: windowDimensions.width,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontFamily: "yg-jalnan",
              marginTop: "78px",
            }}
          >
            이제 막 오픈한 내 가게!
          </div>
          <div
            style={{
              fontSize: "30px",
              fontFamily: "yg-jalnan",
            }}
          >
            어디에 처음 홍보해야
          </div>
          <div
            style={{
              fontSize: "30px",
              fontFamily: "yg-jalnan",
              marginBottom: "30px",
            }}
          >
            할 지 막막하신가요?
          </div>

          <a href="/StoreLogin" title="login">
            <div
              style={{
                width: "218px",
                height: "52px",
                backgroundColor: "#2F80ED",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "17px",
                fontWeight: "bold",
                marginBottom: "51px",
                borderRadius: "33px",
              }}
            >
              무료로 홍보하기
            </div>
          </a>
        </div>
        <FooterMobile />
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
            width: windowDimensions.width - 100,
            maxHeight: '90%',
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
            style={{ marginLeft: windowDimensions.width - 130 }}
          />

          <div className="brand-menu-detail">
            {select_store?.brand_name}의 메뉴
          </div>
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
            width={windowDimensions.width - 100}
            showArrows={true}
            emulateTouch={true}
            infiniteLoop
            showIndicators={false}
            onChange={(e) => {
              set_select_menu_photo(e);
            }}
            ref={carousel_ref}
          >
            {select_store?.menu
              ?.find((menu) => {
                return menu?.name === select_menu;
              })
              ?.photo?.map((photo, photo_idx) => {
                return (
                  <img
                    alt="photo_url"
                    src={photo?.url}
                    style={{
                      width: windowDimensions.width - 100,
                      height: windowDimensions.width - 100,
                      borderRadius: "10px",
                    }}
                    key={photo_idx}
                  />
                );
              })}
          </Carousel>

          <img
            style={{width:'100%', height:80, opacity:0.6, marginTop:-80, borderBottomLeftRadius:10, borderBottomRightRadius:10}}
            src="../../asset/image_dimmed.png"
          />

          {/* 사진 속 글 */}
          <div
            className="column"
            style={{
              width: windowDimensions.width - 100,
              position: "absolute",
              marginTop: windowDimensions.width - 70,
              color: "#FFFFFF",
            }}
          >
            <div className="menu-name">
              {" "}
              {
                select_store?.menu?.find((menu) => {
                  return menu?.name === select_menu;
                })?.name
              }
            </div>
            <div className="menu-detail">
              <div style={{ flex: 1 }}>
                {" "}
                {numb(
                  select_store?.menu?.find((menu) => {
                    return menu?.name === select_menu;
                  })?.price
                )}
                원
              </div>
              <div>
                {" "}
                {select_menu_photo + 1}/
                {
                  select_store?.menu?.find((menu) => {
                    return menu?.name === select_menu;
                  })?.photo?.length
                }
              </div>
            </div>
          </div>

          {/* 메뉴 상세 */}
          <div className="column" style={{ margin: "10px" }}>
            {select_store?.menu?.map((menu, menu_idx) => {
              return (
                <div
                  className="brand-menu-container"
                  style={{
                    width: windowDimensions.width - 100,
                    margin: "5px 0px",
                  }}
                  key={menu_idx}
                >
                  <div className="menu-font" style={{ marginRight: "4px" }}>
                    {menu?.name}
                  </div>
                  {menu?.photo.length > 0 ? (
                    <img
                      alt="photo_button"
                      src="../../asset/button_photo_line.png"
                      style={{ width: "25px", height: "25px" }}
                      onClick={() => {
                        set_select_menu(menu?.name);
                        set_select_menu_photo(0);
                        handle_previous();
                      }}
                    />
                  ) : null}
                  <div className="menu-bar" />
                  <div className="menu-price">{numb(menu?.price)}원</div>
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
            width: windowDimensions.width - 100,
            maxHeight: '90%',
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
            style={{ marginLeft: windowDimensions.width - 130 }}
          />

          <div className="brand-menu-detail">
            {select_store?.brand_name} 방문 혜택
          </div>
          {select_store?.new_open_event?.map((event, event_idx) => {
            return (
              <div id={"coupon-div-" + event_idx}
                style={{width:"100%", height:'auto', backgroundImage:`url(${couponSrc[event_idx]})`, backgroundRepeat:'no-repeat', backgroundSize:'cover',
                    borderRadius:"10px", padding:10, marginBottom:10}}
                key={event_idx}>
                <div className="column">
                  <div className="coupon-number">
                    <div className="coupon-content" style={{ flex: 1 }}>
                      혜택{event_idx + 1}
                    </div>
                    <div className="coupon-content">
                      {select_store?.brand_name}
                    </div>
                  </div>
                  <div className="coupon-detail">{event?.content}</div>
                  <div className="coupon-date">
                    {event?.start_date}일 ~ {event?.end_date}일 까지
                  </div>
                  <div className="center-div coupon-down"
                  onClick={() => {
                    updateCouponTouch({variables:{id: select_store.id}});

                    const couponDiv = $("#coupon-div-" + event_idx);
                    domtoimage.toPng(couponDiv[0])
                    .then(function (dataUrl) {
                      const link = document.createElement("a");
                      link.download = select_store.brand_name + "_coupon_" + event_idx + ".png";
                      link.href = dataUrl;
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
                  }}>
                    쿠폰 다운로드
                  </div>
                </div>
              </div>
            );
          })}
        </StyledModal>
      </Modal>

      <Modal
        style={{
          content: {
            top: "-1%",
            left: "-1%",
            bottom: "0%",
            marginRight: "0%",
            transform: "translate(0%, 0%)",
            borderRadius: "10px",
            width: windowDimensions.width,
            background: "rgb(0,0,0,0.9)",
          },
        }}
        isOpen={scan_modal}
        onRequestClose={close_scan_modal}
        ariaHideApp={false}
      >
        <StyledModal>
          <div
            style={{
              width: windowDimensions.width,
              height: windowDimensions.height,
              alignItems: "center",
              display: "flex",
            }}
            onClick={() => {
              set_scan_modal(false);
            }}
          >
            <section
              className="coupon-list"
              style={{
                backgroundImage: "url(../../asset/image_coupone_blue.png)",
                width: windowDimensions.width - 50,
                backgroundSize: "cover",
                borderRadius: "10px",
                marginLeft: "1%",
              }}
            >
              <div className="column">
                <div className="coupon-number" style={{ marginTop: "10px" }}>
                  <div className="coupon-content" style={{ flex: 1 }}>
                    혜택
                  </div>
                  <div className="coupon-content">
                    {select_store?.brand_name}
                  </div>
                </div>
                <div className="coupon-detail">{select_coupon?.content}</div>
                <div className="coupon-date" style={{ marginBottom: "40px" }}>
                  {select_coupon?.start_date} ~ {select_coupon?.end_date}
                </div>
              </div>
            </section>
          </div>
        </StyledModal>
      </Modal>
    </>
  );
};

export default MainMobile;

const Styled = styled.div`
  display: flex;
  flex-direction: column;

  .column {
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
    align-items: flex-start;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .logo {
    width: 160px;
    height: 48px;
  }

  .banner {
    background-color: #d8d2d2;
  }

  .category {
    margin-top: 10px;
    overflow: hidden;
    overflow-x: scroll;
    margin-bottom: 20px;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .category-container {
    display: flex;
    flex-direction: row;
    overflow-x: "scroll";
    padding: 0px 10px;
  }

  .category-list {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    margin: 10px 0px;
  }

  .category-button {
    width: 120px;
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
    -webkit-tap-highlight-color: transparent;
  }

  .category-select-button {
    width: 120px;
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
    -webkit-tap-highlight-color: transparent;
  }

  .sort-list{
    font-family: 'Apple SD Gothic Neo';
    font-size: 14px;
    line-height: 17px;
  }

  .brand-container {
    display: flex;
    flex-direction: column;
  }

  .brand-category {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 0px;
  }

  .brand-select-cate {
    flex: 1;
    color: #2f80ed;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: flex-start;
    padding-left: 20px;
  }

  .brand-coupon-down {
    font-size: 14px;
    color: #ff2e4c;
    padding-right: 20px;
  }

  .brand-logo {
    width: 45px;
    height: 45px;
    background-color: #c4c4c4;
    border-radius: 25px;
    margin: 0px 15px 0px 20px;
  }

  .brand-name {
    font-size: 16px;
    line-height: 30px;
    letter-spacing: -1px;
    font-weight: bold;
  }

  .brand-location {
    font-size: 12px;
    line-height: 24px;
    letter-spacing: -1px;
    color: #6c757d;
    text-decoration: underline;
  }

  .brand-detail {
    margin: 17px 20px 15px;
    display: flex;
    text-align: left;
    color: #6c757d;
    font-size: 14px;
  }

  .operation-time-container {
    display: flex;
    flex-direction: row;
    margin: 0px 20px;
    align-items: center;
  }

  .text-gray-font {
    font-size: 14px;
    color: #6c757d;
    font-weight: bold;
    font-family: "Nanum Myeongjo";
    margin-left: 7px;
  }

  .operation-detail {
    font-size: 14px;
    font-weight: bold;
    color: #6c757d;
    margin-left: 17px;
  }

  .operation-tel-container {
    display: flex;
    flex-direction: row;
    margin: 5px 20px 10px;
    align-items: center;
  }

  .menu-coupon-container {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .menu-styles {
    flex: 1;
    padding: 10px 5px 10px 20px;
  }

  .menu-font {
    border: 1px solid #e2e2e2;
    color: #6c757d;
    border-radius: 5px;
    padding: 10px 0px;
    font-size: 14px;
  }

  .coupon-font {
    border: 1px solid #e2e2e2;
    color: #ff2e4c;
    border-radius: 5px;
    padding: 10px 0px;
    font-size: 14px;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .main-menu {
    display: flex;
    margin-left: 20px;
    margin-top: 5px;
    color: #2f80ed;
    align-items: center;
    font-family: "NanumMyeongjo";
    font-size: 12px;
    line-height: 15px;
    letter-spacing: -1;
  }

  .main-menu-image {
    width: 15px;
    height: 7px;
    margin-right: 5px;
  }

  .main-menu-container {
    width:100%;
    overflow: hidden;
    overflow-x: scroll;
    margin-top: 10px;
    margin-bottom: 20px;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .menu-container {
    display: flex;
    flex-direction: row;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    height: 47px;
    margin-right: 8px;
  }

  .menu-image {
    width: 50px;
    height: 47px;
    background-size: cover;
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
    font-size: 14px;
    width: 70px;
    color: #6c757d;
  }
`;

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 90%;
  padding-bottom: 40px;

  .column {
    display: flex;
    flex-direction: column;
  }

  .brand-menu-detail {
    font-size: 22px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
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

  .close {
    position: absolute;
    width: 24px;
  }

  .menu-name {
    font-size: 16px;
    margin-left: 20px;
    font-weight: bold;
  }

  .menu-detail {
    display: flex;
    flex-direction: row;
    margin: 0px 20px;
    font-size: 14px;
  }

  .brand-menu-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .menu-price {
    color: #6c757d;
    font-size: 14px;
  }

  .menu-font {
    color: #6c757d;
    font-size: 14px;
  }

  .menu-bar {
    background-color: #6c757d;
    height: 0.5px;
    flex: 1;
    margin: 0px 5px;
  }

  .coupon-number {
    display: flex;
    flex-direction: row;
    padding: 25px 25px 13px 25px;
  }

  .coupon-content {
    font-size: 13px;
    font-weight: bold;
    color: #ffffff;
    z-index: 999;
  }

  .coupon-detail {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    z-index: 999;
    padding: 0px 25px;
    margin-bottom: 8px;
  }

  .coupon-date {
    font-size: 14px;
    color: #bababa;
    z-index: 999;
    padding: 0px 25px;
    margin-bottom: 25px;
  }

  .coupon-down{
    z-index: 999;
    width: 170px;
    background-color: #2D2D2D;
    color: #ffffff;
    font-family: "Spoqa Han Sans Neo";
    font-size:"14px";
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
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
    margin-bottom: 20px;
  }
`;
