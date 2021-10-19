import { useState, useRef } from "react";
import styled from "styled-components";
import "../../index.css";

import Card from "./Card";

const HorizontalCarousel = ({ menu_modal, coupon_modal }) => {
  const [current_card, set_current_card] = useState(0);
  const [card_container, set_card_container] = useState({
    transitionDuration: "0.5s",
    transform: `translate(0px)`,
  });
  const info = useRef(null);

  const handle_previous = () => {
    if (current_card - 1 < 0) {
      return;
    }

    set_current_card(current_card - 1);
    set_card_container({
      transitionDuration: "0.7s",
      transform: `translate(-${174 * (current_card - 1)}px)`,
    });
  };

  const handle_next = () => {
    if (current_card > 0) {
      return;
    }

    set_current_card(current_card + 1);
    set_card_container({
      transitionDuration: "0.7s",
      transform: `translate(-${174 * (current_card + 1)}px)`,
    });
  };

  return (
    <Styled>
      <div className="view-port">
        <button
          className="previous-button"
          onClick={handle_previous}
          style={{ display: !menu_modal && !coupon_modal ? "flex" : "none" }}
        >
          {"〈"}
        </button>

        <div
          ref={info}
          className="card-container"
          style={{ ...card_container }}
        >
          <Card
            card={
              "https://firebasestorage.googleapis.com/v0/b/new-open-35265.appspot.com/o/temp_image%2Fimage_1.png?alt=media&token=f374ac46-1bc5-4903-8f21-0cc10960d286"
            }
          />
          <Card
            card={
              "https://firebasestorage.googleapis.com/v0/b/new-open-35265.appspot.com/o/temp_image%2Fimage_2.png?alt=media&token=508aea55-ce56-457e-9d9d-c1700f64c3b9"
            }
          />
          <Card
            card={
              "https://firebasestorage.googleapis.com/v0/b/new-open-35265.appspot.com/o/temp_image%2Fimage_3.png?alt=media&token=7d6f9ac7-9563-4531-ae99-63a1f61a1d5d"
            }
          />
          <Card
            card={
              "https://firebasestorage.googleapis.com/v0/b/new-open-35265.appspot.com/o/temp_image%2Fimage_4.png?alt=media&token=c4edfb8a-24a8-49f5-94b4-307164106d4e"
            }
          />
        </div>

        <button
          className="next-button"
          onClick={handle_next}
          style={{ display: !menu_modal && !coupon_modal ? "flex" : "none" }}
        >
          {"〉"}
        </button>
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
  }

  .card-container {
    display: flex;
    flex-direction: row;
    width: fit-content;
    width: 700px;
  }

  .previous-button {
    position: absolute;
    z-index: 10;
    border: 0px solid #e2e2e2;
    width: 30px;
    height: 30px;
    background-color: black;
    opacity: 0.85;
    color: #ffffff;
    margin-top: 62px;
    margin-left: 15px;
    border-radius: 100px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .next-button {
    position: absolute;
    z-index: 10;
    border: 0px solid #e2e2e2;
    width: 30px;
    height: 30px;
    background-color: black;
    opacity: 0.85;
    color: #ffffff;
    margin-top: 62px;
    margin-left: 475px;
    border-radius: 100px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    display: flex;
  }
`;
