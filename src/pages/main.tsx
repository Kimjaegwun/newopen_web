import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Dropdown, Menu } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import HorizontalCarousel from "./components/HorizontalCarousel";
import styled from "styled-components";
import "../index.css";

const Main = () => {
  const category_list = ["전체", "카페", "밥집", "술집"];
  const [select_category, set_select_category] = useState("전체");

  const menu = (
    <Menu>
      <Menu.Item disabled>
          1st menu item
      </Menu.Item>
      <Menu.Item disabled>
          3rd menu item
      </Menu.Item>
      <Menu.Item disabled>a danger item</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Styled>
        <div className="column" style={{ marginBottom: "-45px" }}>
          <div className="title-container">
            <div className="title">
              NewOpen
              <img className="love" src="../../asset/love.png" alt="love" />
            </div>
          </div>

          {/* 배너 캐러셀 */}
          <Carousel
            showStatus={false}
            axis={"horizontal"}
            interval={100000}
            autoPlay={false}
            autoFocus={false}
            width={"1440px"}
            showArrows={false}
            emulateTouch={true}
            infiniteLoop
          >
            <div className="banner" />
            <div className="banner" style={{ backgroundColor: "lightgreen" }} />
          </Carousel>
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

        {/* 브랜드 컨테이너 */}
        <div className="new-open-container">
          <div className="column">
            <div className="logo">로고</div>
            <div className="remain-open">정식오픈</div>
            <div
              className="remain-open"
              style={{
                marginTop: "-1px",
                fontSize: "24px",
                fontFamily: "NanumMyeongjo",
              }}
            >
              D-7
            </div>
          </div>
          <div className="content-container">
            <div className="category-container">
              <div className="category-name">#카페</div>
              <div className="like-numb">
                👀
                <span style={{ marginLeft: "10px" }}>
                  123명이 혜택을 받았네요!
                </span>
              </div>
            </div>

            <div className="brand-container">
              <div className="brand-contents">
                <div className="brand-name-position">
                  <div className="brand-name">선유기지</div>
                  <div className="brand-position">
                    서울 영등포구 선유로51길1
                  </div>
                </div>
                <div className="brand-description">
                  ‘도시 틈 속에서 낭만을 추구하는 우리만의 비밀기지’라는
                  콘셉트로 꾸며진 카페 선유기지입니다.
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
                      영업중 : 12:00 ~ 22:00
                      <Dropdown overlay={menu} overlayStyle={{position: "absolute"}}>
                      <a href='!#' onClick={e => e.preventDefault()}>
                      <img
                        className="time-image"
                        style={{ marginLeft: "5px" }}
                        src="../../asset/button_more_info_arrow.png"
                        alt="time"
                      />
                      </a>
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
                      02-820-1258
                    </div>
                  </div>
                </div>
              </div>

              <div className="brand-mall-image">
                {/* 가게 안 이미지들 */}
                <HorizontalCarousel />

                <div className="row">
                  <div className="menu-coupon">
                    <div className="menu">메뉴 더보기</div>
                    <div className="coupon">
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
              <div className="menu-container">
                <img
                  className="menu-image"
                  src="../../asset/screen_shot.png"
                  alt="menu"
                />
                <div className="menu-name">
                  <div className="menu-name-detail">아메리카노</div>
                  <div className="menu-price">3,500원</div>
                </div>
              </div>

              <div className="menu-container">
                <img
                  className="menu-image"
                  src="../../asset/screen_shot.png"
                  alt="menu"
                />
                <div className="menu-name">
                  <div className="menu-name-detail">아메리카노</div>
                  <div className="menu-price">3,500원</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="new-open-container">
          <div className="column">
            <div className="logo">로고</div>
            <div className="remain-open">정식오픈</div>
            <div
              className="remain-open"
              style={{
                marginTop: "-1px",
                fontSize: "24px",
                fontFamily: "NanumMyeongjo",
              }}
            >
              D-7
            </div>
          </div>
          <div className="content-container">
            <div className="category-container">
              <div className="category-name">#카페</div>
              <div className="like-numb">
                👀
                <span style={{ marginLeft: "10px" }}>
                  123명이 혜택을 받았네요!
                </span>
              </div>
            </div>

            <div className="brand-container">
              <div className="brand-contents">
                <div className="brand-name-position">
                  <div className="brand-name">선유기지</div>
                  <div className="brand-position">
                    서울 영등포구 선유로51길1
                  </div>
                </div>
                <div className="brand-description">
                  ‘도시 틈 속에서 낭만을 추구하는 우리만의 비밀기지’라는
                  콘셉트로 꾸며진 카페 선유기지입니다.
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
                      영업중 : 12:00 ~ 22:00
                      <Dropdown overlay={menu} overlayStyle={{position: "absolute", backgroundColor: 'black'}}>
                      <a href='!#' onClick={e => e.preventDefault()}>
                      <img
                        className="time-image"
                        style={{ marginLeft: "5px" }}
                        src="../../asset/button_more_info_arrow.png"
                        alt="time"
                      />
                      </a>
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
                      02-820-1258
                    </div>
                  </div>
                </div>
              </div>

              <div className="brand-mall-image">
                {/* 가게 안 이미지들 */}
                <HorizontalCarousel />

                <div className="row">
                  <div className="menu-coupon">
                    <div className="menu">메뉴 더보기</div>
                    <div className="coupon">
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
              <div className="menu-container">
                <img
                  className="menu-image"
                  src="../../asset/screen_shot.png"
                  alt="menu"
                />
                <div className="menu-name">
                  <div className="menu-name-detail">아메리카노</div>
                  <div className="menu-price">3,500원</div>
                </div>
              </div>

              <div className="menu-container">
                <img
                  className="menu-image"
                  src="../../asset/screen_shot.png"
                  alt="menu"
                />
                <div className="menu-name">
                  <div className="menu-name-detail">아메리카노</div>
                  <div className="menu-price">3,500원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Styled>
    </>
  );
};

export default Main;

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 1440px;
  padding-bottom: 200px;

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
    max-height: 153px;
  }

  .brand-name-position {
    flex-direction: row;
    display: flex;
  }

  .brand-name {
    font-size: 21px;
    font-weight: bold;
    margin-right: 21px;
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
    display: flex;
    text-align: left;
    padding: 15px 0px;
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
  }

  .coupon {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    padding: 5px 20px;
    font-size: 14px;
    color: #ff2e4c;
    display: flex;
    align-items: center;
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
