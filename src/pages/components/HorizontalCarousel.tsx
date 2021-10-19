import { useState, useRef } from "react";
import styled from "styled-components";
import "../../index.css";

import Card from "./Card";

const HorizontalCarousel = () => {
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
        <button className="previous-button" onClick={handle_previous}>
          {"〈"}
        </button>

        <div
          ref={info}
          className="card-container"
          style={{ ...card_container }}
        >
          <Card card={0} />
          <Card card={1} />
          <Card card={2} />
          <Card card={3} />
        </div>

        <button className="next-button" onClick={handle_next}>
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
    z-index: 999;
    border: 0px solid #e2e2e2;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0.5;
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
    z-index: 999;
    border: 0px solid #e2e2e2;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0.5;
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
