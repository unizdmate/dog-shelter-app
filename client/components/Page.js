import React from "react";
import Header from "./Header";
import Meta from "./Meta";
import styled, { ThemeProvider, injectGlobal } from "styled-components";
import Footer from "./Footer";

const theme = {
  blue: "#006ECD",
  lightBlue: "#1b95ff",
  complementaryColor: "#0189ff",
  black: "#292929",
  grey: "#3A3A3A",
  lightgrey: "#E1E1E1",
  offWhite: "#EDEDED",
  maxWidth: "1000px",
  boxShadow: "0 12px 24px 0 rgba(0,0,0,0.09)",
};

const StyledPage = styled.div`
  background: white;
  color: ${() => theme.black};
`;

const StyledInnerContainer = styled.div`
  max-width: ${() => theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

injectGlobal`
@font-face {
  font-family: "noto_sans";
  src: url("/static/radnikanext-medium-webfont.woff2")
  format("woff2");
  font-weight: normal;
  font-style: normal;
}
  html{
    box-sizing: border-box;
    font-size: 10px;
    margin: 0;
    padding: 0
  }
  *, *:before, *:after{
    box-sizing: inherit;
  }
  body{
    padding: 0px;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: "radnika_next";
  }
  a{
    text-decoration: none;
    color: ${theme.black};
  }
`;

const Page = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <Meta />
        <Header />
        <StyledInnerContainer>{props.children}</StyledInnerContainer>
        <Footer />
      </StyledPage>
    </ThemeProvider>
  );
};

export default Page;
