import { useState, useRef, useEffect } from "react";
import $ from "jquery";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Input } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GET_All_NEW_OPEN, UPDATE_COUPON_TOUCH } from "./mutation.gql";
import { numb } from "../utils/utils";
import Modal from "react-modal";
import HorizontalCarousel from "./components/HorizontalCarousel";
import styled from "styled-components";
import Footer from "./components/Footer";
import proj4 from "proj4";
import "../index.css";
import Header from "./components/Header";
import domtoimage from "dom-to-image";

Modal.setAppElement();

proj4.defs(
  "WGS84",
  "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"
);

const Main = () => {
  const [flag, set_flag] = useState(false);
  const flag_change = () => {
    set_flag(!flag);
  };

  // 가게들 가져오기
  const [stores, set_stores] = useState([] as any);
  useQuery(GET_All_NEW_OPEN, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const sortStore = data.GetAllNewOpen.new_open
        ?.slice()
        .sort(function (a, b) {
          return b.coupon_touch - a.coupon_touch;
        });
      set_stores(sortStore);
    },
  });

  const category_list = [
    "전체",
    "밥집",
    "술집",
    "카페",
    "네일&속눈썹",
    "헤어샵",
    "기타",
  ];
  const [select_category, set_select_category] = useState("전체");

  //전국 리스트
  const location_list = ["전국", "동대문", "강남", "강북", "문래"];
  const [select_loaction, set_select_location] = useState("전국");
  const [open_location, set_open_location] = useState(false);

  //브랜드 정렬
  const [select_sort, set_select_sort] = useState("인기순");

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
  const [updateCouponTouch] = useMutation(UPDATE_COUPON_TOUCH);

  // 선택한 가게
  const [select_store, set_select_store] = useState({} as any);
  const [select_menu, set_select_menu] = useState("");
  const [select_menu_photo, set_select_menu_photo] = useState(0);

  // 캐러셀 ref
  const carousel_ref = useRef<Carousel>(null);
  const handle_previous = () => {
    carousel_ref.current?.moveTo(0);
  };

  const couponSrc = [
    "../../asset/image_coupone_blue.png",
    "../../asset/image_coupone_brown.png",
    "../../asset/image_coupone_green.png",
    "../../asset/image_coupone_purple.png",
    "../../asset/image_coupone_blue.png",
  ];

  useEffect(() => {
    window.onscroll = () => {
      if (
        window.pageYOffset > 550 &&
        window.pageYOffset < document.body.offsetHeight - 1450
      ) {
        $("#right-banner").css("top", window.pageYOffset + 120);
      }
    };
  }, []);

  return (
    <>
      <Styled>
        <Header logout={false} />

        <a
          href="/StoreLogin"
          id="right-banner"
          style={{
            position: "absolute",
            width: 100,
            height: 340,
            color: "#2d2d",
            top: 680,
            right: 50,
            backgroundImage: "url(../../asset/image_rightbanner_pc.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          {""}
        </a>
        <div className="column" style={{ marginTop: 69 }}>
          {/* 배너 캐러셀 */}
          {/* <Carousel
            showThumbs={false}
            showStatus={false}
            axis={"horizontal"}
            interval={100000}
            autoPlay={false}
            autoFocus={false}
            width={"1440px"}
            showArrows={false}
            emulateTouch={true}
            infiniteLoop
            showIndicators={!flag}
          > */}
          <div
            style={{
              backgroundImage: "url(../../asset/image_mainbanner_pc.png)",
              backgroundSize: "contain",
              width: "1440px",
              height: "500px",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <div
              className="center-div"
              style={{
                position: "relative",
                width: 230,
                paddingTop: 15,
                paddingBottom: 15,
                marginTop: 340,
                textAlign: "center",
                backgroundColor: "#FFFFFF",
                border: "3px solid #2F80ED",
                borderRadius: 5,
                fontFamily: "Apple SD Gothic Neo",
                fontWeight: "bold",
                fontSize: "28px",
                cursor: "pointer",
              }}
              onClick={() => {
                set_open_location(!open_location);
              }}
            >
              {select_loaction}
              <img
                className="arrow-image"
                style={{ top: 22 }}
                src={
                  open_location
                    ? "../../asset/arrow-up.png"
                    : "../../asset/arrow-down.png"
                }
                alt="time"
              />
            </div>
            {location_list.map((cate, cate_index) => {
              return (
                <div
                  className="center-div"
                  style={{
                    display: open_location ? "block" : "none",
                    width: 230,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: "#FFFFFF",
                    borderLeft: "0.5px solid grey",
                    borderRight: "0.5px solid grey",
                    cursor: "pointer",
                    borderBottom:
                      cate_index === location_list.length - 1
                        ? "0.5px solid grey"
                        : "none",
                  }}
                  onClick={() => {
                    set_select_location(cate);
                    set_open_location(false);
                  }}
                  key={cate}
                >
                  {cate}
                </div>
              );
            })}
          </div>
        </div>

        <div className="category-list">
          {category_list.map((cate, cate_index) => {
            if (select_category === cate) {
              return (
                <Button
                  className="category-select-button"
                  key={cate_index}
                  onClick={() => {
                    set_select_category(cate);
                  }}
                >
                  {cate}
                </Button>
              );
            } else {
              return (
                <Button
                  className="category-button"
                  key={cate_index}
                  onClick={() => {
                    set_select_category(cate);
                  }}
                >
                  {cate}
                </Button>
              );
            }
          })}
        </div>

        <div className="sort-list">
          <div
            className="right"
            style={
              select_sort === "최신순"
                ? { fontWeight: "bold", color: "#2D2D2D", cursor: "pointer" }
                : { fontWeight: "normal", color: "#BABABA", cursor: "pointer" }
            }
            onClick={() => {
              const sortStores = stores.slice().sort(function (a, b) {
                return b.createdAt - a.createdAt;
              });
              set_stores(sortStores);
              set_select_sort("최신순");
            }}
          >
            최신순
          </div>
          <div
            className="right"
            style={
              select_sort === "인기순"
                ? {
                    fontWeight: "bold",
                    color: "#2D2D2D",
                    marginRight: 10,
                    cursor: "pointer",
                  }
                : {
                    fontWeight: "normal",
                    color: "#BABABA",
                    marginRight: 10,
                    cursor: "pointer",
                  }
            }
            onClick={() => {
              const sortStores = stores.slice().sort(function (a, b) {
                return b.coupon_touch - a.coupon_touch;
              });
              set_stores(sortStores);
              set_select_sort("인기순");
            }}
          >
            인기순
          </div>
        </div>
        {/* 브랜드 컨테이너 */}
        {stores
          ?.filter((item: any) => {
            if (select_category === "전체") {
              return item;
            } else {
              return item?.business_type === select_category;
            }
          })
          ?.filter((item: any) => {
            if (select_loaction === "전국") {
              return item;
            } else {
              return item.address.includes(select_loaction);
            }
          })
          .map((store: any, str_idx) => {
            const {
              logo,
              business_type,
              open_date,
              brand_name,
              address,
              address_detail,
              description,
              photo_in_mall,
              coupon_touch,
              business_hours,
              store_number,
              menu,
              location,
            } = store;

            // 오픈 날짜 계산
            const now = new Date().getTime();
            const date_split = String(open_date).split("-");
            const diff_day = Math.floor(
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
            );

            const find_day = business_hours?.find((item: any) => {
              return Number(item?.number) === new Date().getDay();
            });

            return (
              <div className="new-open-container" key={str_idx}>
                <div className="column">
                  <img className="logo" src={logo} alt="logo" />
                  <div className="remain-open">정식오픈</div>
                  <div
                    className="remain-open"
                    style={{
                      marginTop: "-1px",
                      fontSize: "24px",
                      fontFamily: "NanumMyeongjo",
                      display: diff_day <= 0 || !diff_day ? "none" : "flex",
                      justifyContent: "center",
                    }}
                  >
                    D-{diff_day}
                  </div>
                </div>
                <div className="content-container">
                  <div className="category-container">
                    <div className="category-name">#{business_type}</div>
                    <div className="like-numb">
                      👀
                      <span style={{ marginLeft: "10px" }}>
                        {coupon_touch || 0}명이 혜택을 받았네요!
                      </span>
                    </div>
                  </div>

                  <div className="brand-container">
                    <div className="brand-contents">
                      <div className="brand-name" style={{ textAlign: "left" }}>
                        {brand_name}
                      </div>
                      <a
                        href={`https://map.naver.com/v5/search/${encodeURI(
                          location
                        )}`}
                        target="blank"
                        title="지도"
                      >
                        <div className="brand-position">
                          {address} {address_detail}
                        </div>
                      </a>

                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 5 }}
                        className="brand-description"
                        disabled
                        defaultValue={description}
                        style={{ width: "320px", height: "auto" }}
                      />

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
                            {find_day?.closed
                              ? "휴일 : 00:00 ~ 00:00"
                              : "영업중 : " + find_day?.hour}
                            <div style={{ position: "relative" }}>
                              <img
                                className="time-image"
                                style={{ marginLeft: "5px" }}
                                src="../../asset/button_more_info_arrow.png"
                                alt="time"
                                onMouseEnter={() => {
                                  $("#business-hours-dropdown-" + str_idx).css(
                                    "display",
                                    "flex"
                                  );
                                }}
                                onMouseOut={() => {
                                  $("#business-hours-dropdown-" + str_idx).css(
                                    "display",
                                    "none"
                                  );
                                }}
                              />
                              <div
                                id={"business-hours-dropdown-" + str_idx}
                                style={{
                                  textAlign: "center",
                                  fontWeight: "normal",
                                  position: "absolute",
                                  width:
                                    business_hours.filter(
                                      (x) => x.closed === false
                                    ).length > 0
                                      ? 150
                                      : 80,
                                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                                  padding: "14px",
                                  fontSize: "14px",
                                  lineHeight: "19px",
                                  color: "#FFFFFF",
                                  borderRadius: "5px",
                                  display: "none",
                                }}
                              >
                                <div
                                  style={{ width: "100%", textAlign: "center" }}
                                >
                                  {business_hours?.map((hour, hour_idx) => {
                                    return (
                                      <div key={hour_idx}>
                                        {hour?.day}요일:{" "}
                                        {hour?.closed ? "휴무" : hour?.hour}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            {/* <Dropdown
                              trigger={["hover"]}
                              onVisibleChange={(e) => {
                                console.log("A");
                                set_operation_visible(e);
                              }}
                              visible={operation_visible}
                              destroyPopupOnHide={true}
                              arrow={false}
                              overlay={
                                <div id={"business-hours-dropdown-"+str_idx}>
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
                            </Dropdown> */}
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
                            {store_number}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="brand-mall-image">
                      {/* 가게 안 이미지들 */}
                      <HorizontalCarousel
                        brand_name={brand_name}
                        photo={photo_in_mall}
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
                              set_select_store(store);
                              set_select_menu(store?.menu[0]?.name);
                            }}
                          >
                            메뉴 더보기
                          </div>
                          <div
                            className="coupon"
                            onClick={() => {
                              set_coupon_modal(true);
                              flag_change();
                              set_select_store(store);
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
                    {menu?.map((menu_item, menu_idx) => {
                      if (menu_item?.main_menu) {
                        return (
                          <div
                            className="menu-container"
                            onClick={() => {
                              set_menu_modal(true);
                              flag_change();
                              set_select_store(store);
                              set_select_menu(menu_item?.name);
                            }}
                            key={menu_idx}
                          >
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
            );
          })}

        <div
          style={{
            backgroundColor: "#EAFAFF",
            width: "1440px",
            marginTop: "200px",
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
              marginBottom: "30px",
            }}
          >
            어디에 처음 홍보해야 할지 막막하신가요?
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
        <Footer />
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
            maxHeight: "600px",
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
                      width: "500px",
                      height: "500px",
                      borderRadius: "10px",
                    }}
                    key={photo_idx}
                  />
                );
              })}
          </Carousel>

          <div className="menu-name" style={{ color: "#FFFFFF" }}>
            {
              select_store?.menu?.find((menu) => {
                return menu?.name === select_menu;
              })?.name
            }
          </div>

          <div className="menu-detail">
            <div style={{ flex: 1 }}>
              {numb(
                select_store?.menu?.find((menu) => {
                  return menu?.name === select_menu;
                })?.price
              )}
              원
            </div>
            <div>
              {select_menu_photo + 1}/
              {
                select_store?.menu?.find((menu) => {
                  return menu?.name === select_menu;
                })?.photo?.length
              }
            </div>
          </div>

          <div className="column" style={{ margin: "27px" }}>
            {select_store?.menu?.map((menu, menu_idx) => {
              return (
                <div className="menu-row" key={menu_idx}>
                  <div className="menu-font">{menu?.name}</div>
                  {menu.photo?.length > 0 ? (
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
                  ) : null}
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
            maxHeight: "600px",
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

          <div className="brand-menu-detail">
            {select_store?.brand_name} 방문 혜택
          </div>
          {select_store?.new_open_event?.map((event, event_idx) => {
            return (
              <div
                id={"coupon-div-" + event_idx}
                className="coupon-list"
                style={{
                  backgroundImage: `url(${couponSrc[event_idx]})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
                key={event_idx}
              >
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
                  <div
                    className="center-div coupon-down"
                    onClick={() => {
                      updateCouponTouch({ variables: { id: select_store.id } });

                      const couponDiv = $("#coupon-div-" + event_idx);
                      domtoimage
                        .toPng(couponDiv[0])
                        .then(function (dataUrl) {
                          const link = document.createElement("a");
                          link.download =
                            select_store.brand_name +
                            "_coupon_" +
                            event_idx +
                            ".png";
                          link.href = dataUrl;
                          document.body.appendChild(link);
                          link.click();
                        })
                        .catch(function (error) {
                          console.error("oops, something went wrong!", error);
                        });
                    }}
                  >
                    쿠폰 다운로드
                  </div>
                </div>
              </div>
            );
          })}
        </StyledModal>
      </Modal>
    </>
  );
};

export default Main;

const Styled = styled.div`
  position: relative;
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
    margin-top: 20px;
  }

  .category-button {
    width: 110px;
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
    width: 110px;
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

  .sort-list {
    margin-top: 10px;
    width: 1024px;
    height: 20px;
    font-family: "Apple SD Gothic Neo";
    font-size: 16px;
    line-height: 20px;
  }

  .new-open-container {
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    padding: 17px 23px;
    width: 1000px;
    margin-top: 15px;
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

  .card {
    width: 156px;
    height: 156px;
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
    margin-bottom: 10px;
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

  .coupon-down {
    z-index: 999;
    width: 170px;
    background-color: #2d2d2d;
    color: #ffffff;
    font-family: "Spoqa Han Sans Neo";
    font-size: "14px";
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
  }

  .column {
    display: flex;
    flex-direction: column;
  }
`;
