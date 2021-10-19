import styled from "styled-components";
import "../../index.css";

const Card = ({ card }) => {
  return (
    <Styled>
      <div className="card">{card}</div>
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
