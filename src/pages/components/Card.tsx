import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import Modal from "react-modal";
import styled from "styled-components";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../../index.css";

const Card = ({ card, flag_change }) => {
  // 매장 사진 모달
  const [mall_modal, set_mall_modal] = useState(false);
  const close_mall_modal = () => {
    set_mall_modal(false);
    flag_change();
  };

  return (
    <Styled>
      <div className="card">
        <img
          onClick={() => {
            set_mall_modal(true);
            flag_change();
          }}
          src={card}
          style={{
            width: "154px",
            height: "154px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          alt="mall"
        />
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
            width: "520px",
          },
        }}
        isOpen={mall_modal}
        onRequestClose={close_mall_modal}
        ariaHideApp={false}
      >
        <StyledModal>
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
            showIndicators={true}
            onChange={(e) => {
              console.log(e);
            }}
          >
            <div className="banner" style={{ height: "500px" }} />
            <div className="banner" style={{ backgroundColor: "lightgreen" }} />
          </Carousel>

          <div
            style={{
              width: "500px",
              display: "flex",
              flexDirection: "row",
              marginTop: "15px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            <div style={{ flex: 1 }}>선유기지 매장사진</div>
            <div>1/3</div>
          </div>
        </StyledModal>
      </Modal>
    </Styled>
  );
};

export default Card;

const Styled = styled.div`
  .card {
    width: 154px;
    height: 154px;
    box-sizing: border-box;
    border: 1px solid #e2e2e2;
    margin: 0px 10px;
    border-radius: 10px;
  }
`;

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .banner {
    width: 500px;
    height: 500px;
    background-color: #fff9c1;
    border-radius: 5px;
    z-index: 999;
  }
`;
