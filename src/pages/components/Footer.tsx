import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: 50,
        paddingBottom: 80,
        width: "1050px",
        marginTop: "100px",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <a
          href="https://www.kibo.or.kr/main/work/work030203.do"
          target="blank"
          title="기보벤처스"
          style={{ marginRight: "20px" }}
        >
          <img
            src="../../asset/a-icon-footer-kibo.png"
            style={{ width: "86px" }}
            alt="kibo"
          />
        </a>

        <a
          href="https://www.fnnews.com/"
          target="blank"
          title="파이낸셜 뉴스"
          style={{ marginRight: "20px" }}
        >
          <img
            alt="fn"
            src="../../asset/a-icon-footer-fn.png"
            style={{ width: "132px" }}
          />
        </a>

        <a
          href="https://www.instagram.com/newopen_official/"
          target="blank"
          title="인스타그램"
        >
          <img
            alt="insta"
            src="../../asset/a-icon-footer-instagram.png"
            style={{ width: "20px" }}
          />
        </a>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "30px" }}>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          사업자
        </div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          (주)티어제이
        </div>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          고객센터
        </div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          070-7796-1111
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          사업자등록번호
        </div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          197-81-01864
        </div>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          상담시간
        </div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          평일 10:00~18:00 (토, 일요일, 공휴일 휴무)
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          대표이사
        </div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          장한빛
        </div>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        ></div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        ></div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          주소
        </div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          서울 영등포구 경인로 775 에이스하이테크시티, 4층 421호
        </div>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        ></div>
        <div
          style={{
            flex: 4,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        ></div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "30px" }}>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          Copyright 2021 Tier J Co., Ltd. All Right Reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
