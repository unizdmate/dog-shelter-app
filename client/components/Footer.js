import styled from "styled-components";

const StyledFooter = styled.div`
  background-color: ${(props) => props.theme.lightBlue};
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  justify-content: center;
  padding: 0;
  p {
    justify-content: center;
    font-size: 8px;
    margin: 0;
  }
`;

const Footer = (props) => {
  return (
    <StyledFooter>
      <p>Developed by Mate Krezic / UNIZD (2020)</p>
    </StyledFooter>
  );
};

export default Footer;
