import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { throttle } from 'throttle-debounce'
import {
  COLORS,
  SCREEN,
  Z_INDEX,
  ANIMATIONS,
  FONT_WEIGHT,
  MEDIA_IE_HOVER,
} from '../../../constants'
import { useStaticQuery, graphql } from 'gatsby'
import { AnimatedLink } from '../../AnimatedLink'
import { CaseStudy } from '../../../types/CaseStudy'

const mobileScroll = keyframes`
  100% {
    transform: translateY(-100%);
  }
`

const desktopScroll = keyframes`
  100% {
    transform: translateX(-100%);
  }
`

const Container = styled.div<{ isScrolled: boolean; isReadyToRender: boolean }>`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 4.5rem;
  height: 100vh;
  background: ${COLORS.BLUE};
  color: ${COLORS.WHITE};
  transform: ${({ isScrolled }) => isScrolled && 'translateX(5rem)'};
  transition: transform 0.2s ease-in;
  z-index: ${Z_INDEX.ABOVE};
  opacity: 0;
  animation: ${ANIMATIONS.FADE_IN} 0.4s ease-in 0.2s forwards;

  ${SCREEN.ABOVE_MOBILE} {
    display: flex;
    align-items: center;
    justify-content: initial;
    width: 100vw;
    height: 4.5rem;
    transform: ${({ isScrolled, isReadyToRender }) =>
      (isScrolled || !isReadyToRender) && 'translateY(5rem)'};
  }
`

const Motto = styled.div`
  display: none;
  padding: 0 2rem 0 4rem;
  background: ${COLORS.BLUE};
  box-shadow: 14px 0px 7px -6px ${COLORS.BLUE};
  white-space: nowrap;
  z-index: ${Z_INDEX.ABOVE};

  ${SCREEN.ABOVE_MOBILE} {
    display: block;
  }

  ${SCREEN.ABOVE_TABLET} {
    padding: 0 2rem 0 8rem;
  }
`

const StyledAnimatedLink = styled(AnimatedLink)`
  font-weight: ${FONT_WEIGHT.MEDIUM};

  ${MEDIA_IE_HOVER} {
    :hover {
      text-decoration: underline;
    }
  }
`

const Content = styled.div<{ count: number }>`
  display: flex;
  width: 100%;
  align-items: center;
  white-space: nowrap;
  writing-mode: vertical-rl;
  -ms-writing-mode: rl;
  animation: ${mobileScroll} ${({ count }) => count * 10}s linear infinite;

  ${SCREEN.ABOVE_MOBILE} {
    display: block;
    width: auto;
    transform: translateX(0);
    writing-mode: initial;
    animation-name: ${desktopScroll};
  }
`

const PlusSign = styled.span`
  margin: 1.2rem 0;

  ${SCREEN.ABOVE_MOBILE} {
    margin: 0 1.2rem;
  }
`

interface StripQuery {
  allRestApiCaseStudies: {
    nodes: Array<Pick<CaseStudy, 'shortDescription' | 'id' | 'industry'>>
  }
}

interface StripProps {
  isReadyToRender: boolean
}

export const Strip: React.FC<StripProps> = ({ isReadyToRender }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  const data = useStaticQuery<StripQuery>(graphql`
    query StripQuery {
      allRestApiCaseStudies {
        nodes {
          shortDescription
          id
          industry {
            title
          }
        }
      }
    }
  `)

  const handleScroll = throttle(300, () => {
    if (window.pageYOffset > 10) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mapData = () =>
    data.allRestApiCaseStudies.nodes.map(caseStudy => (
      <span key={caseStudy.id}>
        <b>{caseStudy.industry.title}</b> – {caseStudy.shortDescription}
        <PlusSign>+</PlusSign>
      </span>
    ))

  const elements = (
    <Container isScrolled={isScrolled} isReadyToRender={isReadyToRender}>
      <Motto>
        <StyledAnimatedLink to="/work">
          Ideas –&gt; Products:
        </StyledAnimatedLink>
      </Motto>
      <Content count={data.allRestApiCaseStudies.nodes.length}>
        {mapData()}
      </Content>
      <Content count={data.allRestApiCaseStudies.nodes.length}>
        {mapData()}
      </Content>
    </Container>
  )

  const portalEl =
    typeof document !== `undefined` && document.getElementById('strip')

  if (portalEl) {
    return createPortal(elements, portalEl)
  }

  return null
}
