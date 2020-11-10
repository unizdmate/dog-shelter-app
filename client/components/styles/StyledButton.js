import styled from "styled-components";

const StyledButton = styled.button`
  background: ${(props) => props.theme.blue};
  color: white;
  font-weight: 250;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 1.2rem;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  display: inline-block;
  transition: all 0.5s;
  cursor: pointer;
  &[disabled] {
    opacity: 0.5;
  }
  a {
    color: white;
  }
`;

export default StyledButton;
