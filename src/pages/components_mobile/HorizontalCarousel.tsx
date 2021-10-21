import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import "../../index.css";
import Card from "./Card";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const HorizontalCarousel = ({ flag, flag_change, photo }) => {
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

  const [card_container] = useState({
    transitionDuration: "0.5s",
    transform: `translate(0px)`,
  });
  const info = useRef(null);

  return (
    <Styled>
      <div
        className="view-port"
        style={{
          width: windowDimensions.width,
          height: "160px",
          marginTop: "15px",
        }}
      >
        {/* <button
          className="previous-button"
          onClick={handle_previous}
          style={{
            display: !flag ? "flex" : "none",
          }}
        >
          <div style={{ position: "absolute", right: "12px", top: "5px" }}>
            {"〈"}
          </div>
        </button> */}

        <div
          ref={info}
          className="card-container"
          style={{ ...card_container }}
        >
          {photo?.map((one_photo, photo_idx) => {
            return (
              <Card
                all={photo}
                card={one_photo}
                flag_change={flag_change}
                key={photo_idx}
              />
            );
          })}
        </div>

        {/* <button
          className="next-button"
          onClick={handle_next}
          style={{
            display: !flag ? "flex" : "none",
            marginLeft: windowDimensions.width - 40,
          }}
        >
          <div style={{ position: "absolute", left: "12px", top: "5px" }}>
            {"〉"}
          </div>
        </button> */}
      </div>
    </Styled>
  );
};

export default HorizontalCarousel;

const Styled = styled.div`
  .view-port {
    top: 50%;
    left: 50%;
    width: 522px;
    overflow: scroll;
    display: flex;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .card-container {
    display: flex;
    flex-direction: row;
    width: fit-content;
    width: 700px;
  }

  .previous-button {
    z-index: 10;
    border: 0px solid #e2e2e2;
    width: 30px;
    height: 30px;
    background-color: black;
    opacity: 0.85;
    color: #ffffff;
    margin-top: 62px;
    margin-left: 10px;
    border-radius: 100px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-items: center;
    display: flex;
    position: absolute;
  }

  .next-button {
    z-index: 10;
    border: 0px solid #e2e2e2;
    width: 30px;
    height: 30px;
    background-color: black;
    opacity: 0.85;
    color: #ffffff;
    margin-top: 62px;
    border-radius: 100px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    display: flex;
    position: absolute;
  }
`;
