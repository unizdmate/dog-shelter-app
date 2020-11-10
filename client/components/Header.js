import Nav from "./Nav";
import Link from "next/link";
import styled from "styled-components";
import Router from "next/router";
import NProgress from "nprogress";

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const StyledName = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  transform: skew(-10deg);
  a {
    padding: 0.5rem 1rem;
    background: ${(props) => props.theme.lightBlue};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 20px;
  }
  @media (max-width: 800px) {
    margin: 0;
    text-align: center;
  }
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 5px solid ${(props) => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1000px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${(props) => props.theme.lightgrey};
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <div className="bar">
        <StyledName>
          <Link href="/">
            <a>Zadarski Azil</a>
          </Link>
        </StyledName>
        <Nav />
      </div>
    </StyledHeader>
  );
};

export default Header;
