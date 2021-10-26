import React from "react";

const FooterMobile = () => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: 20,
        paddingBottom: 100,
        paddingLeft:10,
        paddingRight:10,
      }}
    >
      <div
        style={{width:'100%', height:20}}>
        <a
          href="https://www.instagram.com/newopen_official/"
          target="blank"
          title="인스타그램"
          style={{float:"right", marginRight:10}}
        >
          <img
            alt="insta"
            src="../../asset/a-icon-footer-instagram.png"
            style={{ width: "20px" }}
          />
        </a>
      </div>
      <div
        style={{ width:"100%", display: "flex", flexDirection: "row", alignItems: "center"}}
      >
        <a
          href="https://www.kict.re.kr/"
          target="blank"
          title="kict"
          style={{ width: '33%' }}
        >
          <img
            src="../../asset/a-icon-footer-kict.png"
            style={{ width: '100%' }}
            alt="kict"
          />
        </a>
        
        <a
          href="https://www.kibo.or.kr/main/work/work030203.do"
          target="blank"
          title="기보벤처스"
          style={{ width: '25%' }}
        >
          <img
            src="../../asset/a-icon-footer-kibo.png"
            style={{ width: '100%' }}
            alt="kibo"
          />
        </a>

        <a
          href="https://www.fnnews.com/"
          target="blank"
          title="파이낸셜 뉴스"
          style={{ width: '40%' }}
        >
          <img
            alt="fn"
            src="../../asset/a-icon-footer-fn.png"
            style={{ width: '100%' }}
          />
        </a>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "25px" }}>
        <div
          style={{
            width: 80,
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
            flex: 2,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          (주)티어제이
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            width: 80,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          등록번호
        </div>
        <div
          style={{
            flex: 2,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          197-81-01864
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            width: 80,
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
            flex: 2,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
          }}
        >
          장한빛
        </div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            width: 80,
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
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            textAlign:'left'
          }}
        >
          서울 영등포구 경인로 775 에이스하이테크시티, 4층 421호
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            width:80,
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
            width:80,
            alignItems: "flex-start",
            display: "flex",
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          카카오톡
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
          <a rel="noopener noreferrer" href="http://pf.kakao.com/_zxgRcK/chat" target="_blank" title="다독 카톡플친" style={{color:"#6C757D",fontSize:"14px"}}>@daadok</a>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div
          style={{
            flex: 1,
            width:80,
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

export default FooterMobile;
