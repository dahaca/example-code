import React, { useContext } from "react";
import { NextPage } from "next";
import { Trans } from "react-i18next";
import styled from "styled-components";

import { useTranslation } from "../i18n";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { COLORS, FONT_SIZE, FONT_WEIGHT, SCREEN } from "../constants";
import { adjustColor } from "../utils/adjustColor";
import { LanguagePicker } from "../components/LanguagePicker";
import { useRouter } from "next/router";
import { GlobalStateContext } from "../components/GlobalStateProvider";

const InitialPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  ${SCREEN.ABOVE_TABLET} {
    flex-direction: row;
  }
`;

const FirstColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
`;

const SecondColumn = styled.div`
  display: none;
  flex: 0 1 40%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0.8)),
    url("/images/onboarding_banner.jpg");
  background-size: cover;
  background-position-y: center;
  background-blend-mode: darken;

  ${SCREEN.ABOVE_TABLET} {
    display: block;
  }
`;

const OnboardingContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  max-width: 80vw;

  ${SCREEN.ABOVE_TABLET} {
    padding-left: 1rem;
    max-width: 52.2rem;
  }
`;

const InitPageButton = styled(Button)`
  margin-bottom: 2rem;
  background-color: ${COLORS.BLUE};
  white-space: pre-line;

  :enabled:hover {
    background: ${adjustColor(COLORS.BLUE, -50)};
  }

  ${SCREEN.ABOVE_TABLET} {
    margin-left: 0;
  }
`;

const Heading = styled.h1`
  font-family: "Theinhardt", sans-serif;
  text-align: left;
  font-size: 3.2rem;
  font-weight: ${FONT_WEIGHT.BLACK};
  margin: 0 auto 1.6rem auto;
  letter-spacing: 0.1rem;
  line-height: 8.6rem;

  ${SCREEN.ABOVE_MOBILE} {
    font-size: 5.2rem;
  }

  ${SCREEN.ABOVE_TABLET} {
    font-size: 7.2rem;
    margin-left: 0;
  }
`;

const Subheading = styled.p`
  font-family: "Theinhardt", sans-serif;
  font-weight: ${FONT_WEIGHT.BASE_EXTRA};
  font-size: ${FONT_SIZE.BASE};
  letter-spacing: 0.025rem;
  line-height: 3rem;
  margin-bottom: 5.7rem;
  text-align: center;

  ${SCREEN.ABOVE_MOBILE} {
    font-size: ${FONT_SIZE.MEDIUM};
  }

  ${SCREEN.ABOVE_TABLET} {
    font-size: ${FONT_SIZE.LARGE};
    text-align: left;
  }
`;

const HighlightedPhrase = styled.span`
  color: ${COLORS.BLUE};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${SCREEN.ABOVE_MOBILE} {
    flex-direction: row;
    justify-content: center;
    align-items: center;

    > :nth-child(2) {
      margin-left: 2rem;
    }
  }

  ${SCREEN.ABOVE_TABLET} {
    justify-content: flex-start;
  }
`;

const InitialPage: NextPage = () => {
  const {
    client,
    initializeFinancingSteps,
    initializeInsuranceSteps,
  } = useContext(GlobalStateContext);
  const { t } = useTranslation("home");
  const {
    push,
    query: { client: clientQuery },
  } = useRouter();

  const handleFinancingJourney = () => {
    initializeFinancingSteps();
    const route =
      client && clientQuery
        ? `/${clientQuery}/financing-form`
        : `/default/financing-form`;
    push(route);
  };

  const handleInsuranceJourney = () => {
    initializeInsuranceSteps();
    const route =
      client && clientQuery
        ? `/${clientQuery}/insurance-form`
        : `/default/insurance-form`;
    push(route);
  };

  return (
    <Layout>
      <InitialPageLayout>
        <FirstColumn>
          <OnboardingContent>
            <Heading>{t("APPLICATION_TITLE")}</Heading>
            <Subheading>
              <Trans i18nKey="APPLICATION_DESCRIPTION" ns="home">
                Covering
                <HighlightedPhrase>Up the actual</HighlightedPhrase> text
              </Trans>
            </Subheading>

            <ButtonsWrapper>
              {client.withFinancing && (
                <InitPageButton onClick={handleFinancingJourney}>
                  {t("BEGIN_LOAN_JOURNEY")}
                </InitPageButton>
              )}
              {client.withInsurance && (
                <InitPageButton onClick={handleInsuranceJourney}>
                  {t("BEGIN_INSURANCE_JOURNEY")}
                </InitPageButton>
              )}
            </ButtonsWrapper>
          </OnboardingContent>

          <LanguagePicker />
        </FirstColumn>

        <SecondColumn />
      </InitialPageLayout>
    </Layout>
  );
};

InitialPage.getInitialProps = async () => ({
  namespacesRequired: ["home"],
});

export default InitialPage;
