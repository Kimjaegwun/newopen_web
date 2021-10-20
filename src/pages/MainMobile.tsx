import { useEffect, useState } from "react";
// import { gql, useMutation } from "@apollo/client";
import { Dropdown, Tabs } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from "react-modal";
import HorizontalCarousel from "./components/HorizontalCarousel";
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

const { TabPane } = Tabs;

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
  const category_list = [
    "전체",
    "카페",
    "밥집",
    "술집",
    "미용실",
  ];
  const [select_category, set_select_category] = useState("전체");

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
          showIndicators={true}
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
            overflowX: "scroll"
          }}
        >
          <div style={{display: "flex", flexDirection: "row", overflowX: "scroll", width: "450px"}}>
          {category_list.map((cate, cate_idx) => {
            return (
              <div style={{width: "150px", border: "1px solid black"}} key={cate_idx}>
                {cate}
              </div>
            )
            })}
          </div>
        </Tabs>
      </Styled>
    </>
  );
};

export default MainMobile;

const Styled = styled.div`
  display: flex;
  flex-direction: column;

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
  }
`;
