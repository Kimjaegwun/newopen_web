import { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Dropdown, Input } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GET_All_NEW_OPEN } from "./mutation.gql";
import { numb } from "../utils/utils";
import Modal from "react-modal";
import HorizontalCarousel from "./components_mobile/HorizontalCarousel";
import styled from "styled-components";
import "../index.css";

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
  const category_list = ["전체", "카페", "밥집", "술집", "미용실"];
  const [select_category, set_select_category] = useState("전체");

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
  const [stores, set_stores] = useState([]);
  useQuery(GET_All_NEW_OPEN, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      set_stores(data.GetAllNewOpen.new_open);
    },
  });

  // 쿠폰 모달
  const [coupon_modal, set_coupon_modal] = useState(false);
  const close_coupon_modal = () => {
    set_coupon_modal(false);
    flag_change();
  };

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

  return (
    <>
      <Styled>
        <div className="title">
          <img src="../../asset/logo_newopen_white.png" className="logo" />
        </div>

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
        <img
          style={{
            height: windowDimensions.width * 0.83,
            width: windowDimensions.width,
          }}
          src={"../../asset/image_mainbanner_mobile.png"}
        />
        {/* </Carousel> */}

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
            }}
          >
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

        {stores
          ?.filter((item: any) => {
            if (select_category === "전체") {
              return item;
            } else {
              return item?.business_type === select_category;
            }
          })
          .map((store: any, str_idx) => {
            const {
              logo,
              business_type,
              open_date,
              brand_name,
              address,
              description,
              photo_in_mall,
              coupon_touch,
              business_hours,
              menu,
              phone_number,
              location,
            } = store;

            // 오픈 날짜 계산
            const now = new Date().getTime();

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
                  <img className="brand-logo" src={logo} />
                  <div className="column" style={{ alignItems: "flex-start" }}>
                    <div className="brand-name">{brand_name}</div>
                    <a
                      href={`https://m.map.naver.com/search2/search.naver?query=${encodeURI(
                        location
                      )}&sm=hty&style=v5#/map`}
                      target="_blank"
                      title="지도"
                    >
                      <div className="brand-location">
                        {address} {">"}
                      </div>
                    </a>
                  </div>
                </div>

                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 5 }}
                  disabled
                  defaultValue={description}
                  style={{
                    width: windowDimensions.width - 40,
                    height: "auto",
                    background: "#FFFFFF",
                    color: "#6C757D",
                    fontSize: "14px",
                    paddingLeft: "20px",
                    borderWidth: "0px",
                    marginBottom: "10px",
                  }}
                />

                <div className="operation-time-container">
                  <img
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
                    src="../../asset/a-icon-phone-normal.png"
                    style={{ height: "18px", width: "18px" }}
                  />
                  <div className="text-gray-font">Tel</div>
                  <a
                    href={`tel:${phone_number}`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <div
                      className="operation-detail"
                      style={{
                        marginLeft: "30px",
                        textDecorationLine: "underline",
                      }}
                    >
                      {phone_number}
                    </div>
                  </a>
                </div>

                {/* 가게 안 이미지들 */}
                <HorizontalCarousel
                  photo={photo_in_mall}
                  flag_change={flag_change}
                  flag={flag}
                />

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
                        src="../../asset/a-icon-reply-normal.png"
                        style={{ width: "18px", height: "18px" }}
                      />
                      방문 혜택 보기
                    </div>
                  </div>
                </div>

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
            width: windowDimensions.width - 100,
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
                    src={photo?.url}
                    style={{
                      width: windowDimensions.width - 100,
                      borderRadius: "10px",
                    }}
                    key={photo_idx}
                  />
                );
              })}
          </Carousel>

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
                  <img
                    src="../../asset/button_photo_line.png"
                    style={{ width: "25px", height: "25px" }}
                    onClick={() => {
                      set_select_menu(menu?.name);
                      set_select_menu_photo(0);
                      handle_previous();
                    }}
                  />
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

          <div className="brand-menu-detail" style={{ marginBottom: "30px" }}>
            {select_store?.brand_name} 방문 혜택
          </div>

          {select_store?.new_open_event?.map((event, event_idx) => {
            return (
              <section
                className="coupon-list"
                style={{
                  backgroundImage: "url(../../asset/image_coupone_blue.png)",
                  width: "100%",
                  height: "auto",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px",
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
                    {event?.start_date} ~ {event?.end_date}
                  </div>

                  <div
                    className="coupon-container"
                    onClick={() => {
                      set_scan_modal(true);
                      set_select_coupon(event);
                    }}
                  >
                    <div className="coupon-button">쿠폰 발급받기</div>
                  </div>
                </div>
              </section>
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
    border-radius: 100px;
    margin: 0px 15px 0px 20px;
  }

  .brand-name {
    font-size: 16px;
    font-weight: bold;
  }

  .brand-location {
    font-size: 12px;
    color: #6c757d;
    margin-top: 3px;
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
`;

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;

  .column {
    display: flex;
    flex-direction: column;
  }

  .brand-menu-detail {
    font-size: 22px;
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
    margin-bottom: 20px;
  }
`;
