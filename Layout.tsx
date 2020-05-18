import React from "react";
import styled from "styled-components";
import { TransitionState } from "gatsby-plugin-transition-link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import {
  MAX_CONTENT_WIDTH,
  SCREEN,
  PAGE_TRANSITION_DURATION,
  PADDING,
} from "../../constants";
import { GlobalStyles } from "../../utils/GlobalStyles";
import "../../utils/typography.css";
import { CookieBar } from "./CookieBar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  overflow: hidden;
`;

const AnimatedElements = styled.div<{ transitionStatus: string }>`
  padding-top: 8rem;
  transform: ${({ transitionStatus }) =>
    (transitionStatus === "exiting" ||
      transitionStatus === "exited" ||
      transitionStatus === "entering") &&
    "translateY(70px)"};
  opacity: ${({ transitionStatus }) =>
    transitionStatus === "entered" ? 1 : 0};
  transition: transform ${PAGE_TRANSITION_DURATION - 0.05}s ease-in,
    opacity ${PAGE_TRANSITION_DURATION - 0.05}s ease-in;
`;

const Content = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: ${MAX_CONTENT_WIDTH}rem;
  padding: 0 ${PADDING.MOBILE}rem 8rem;

  ${SCREEN.ABOVE_TABLET} {
    margin: 0 auto;
    padding: 0 ${PADDING.DESKTOP}rem 15rem;
  }
`;

export const Layout: React.FC = ({ children }) => (
  <>
    <GlobalStyles />

    <Container>
      <Header />
      <TransitionState>
        {({ transitionStatus }: { transitionStatus: string }) => (
          <AnimatedElements transitionStatus={transitionStatus}>
            <Content>{children}</Content>
            <Footer />
          </AnimatedElements>
        )}
      </TransitionState>
      <CookieBar />
    </Container>
  </>
);
