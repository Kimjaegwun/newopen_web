import { useEffect, useState } from "react";
// import { gql, useMutation } from "@apollo/client";
import { Dropdown, Tabs } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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

  return (
    <>
      <Styled>
        <div className="title">
          <img src="../../asset/logo_newopen_white.png" className="logo" />
        </div>

        {/* 배너 캐러셀 */}
        <Carousel
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
        >
          <div
            className="banner"
            style={{
              height: windowDimensions.width * 0.7,
              width: windowDimensions.width,
            }}
          />
          <div
            style={{
              height: windowDimensions.width * 0.7,
              width: windowDimensions.width,
              backgroundColor: "lightgreen",
            }}
          />
        </Carousel>

        <Tabs
          style={{
            marginTop: "10px",
            width: windowDimensions.width,
            overflow: "hidden",
            overflowX: "scroll",
            marginBottom: "20px",
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
        </Tabs>

        <div className="brand-container">
          <div
            className="brand-category"
            style={{ width: windowDimensions.width }}
          >
            <div className="brand-select-cate">#카페</div>
            <div className="brand-coupon-down">👀 123명이 혜택을 받았네요!</div>
          </div>

          <div className="brand-category">
            <div className="brand-logo"></div>
            <div className="column" style={{ alignItems: "flex-start" }}>
              <div className="brand-name">선유기지</div>
              <div className="brand-location">
                서울 영등포구 선유로51길 1 {">"}
              </div>
            </div>
          </div>

          <div className="brand-detail">
            ‘도시 틈 속에서 낭만을 추구하는 우리만의 비밀기지’라는 콘셉트로
            꾸며진 카페 선유기지입니다.
          </div>

          <div className="operation-time-container">
            <img
              src="../../asset/a-icon-time-normal.png"
              style={{ height: "18px", width: "18px" }}
            />
            <div className="text-gray-font">Time</div>
            <div className="operation-detail">영업중 : 12:00 ~ 22:00</div>
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
                  <div>월요일: 09:00 ~ 20:00</div>
                  <div>화요일: 09:00 ~ 20:00</div>
                  <div>일요일: 휴무</div>
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
                style={{ height: "25px", width: "25px", marginLeft: "8px" }}
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
            <div
              className="operation-detail"
              style={{ marginLeft: "30px", textDecorationLine: "underline" }}
            >
              02-820-1258
            </div>
          </div>

          {/* 가게 안 이미지들 */}
          <HorizontalCarousel flag_change={flag_change} flag={flag} />

          <div className="">
          </div>
        </div>
      </Styled>
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
`;
