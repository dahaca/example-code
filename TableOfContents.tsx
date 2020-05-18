import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  SCREEN,
  COLORS,
  FONT_SIZE,
  MEDIA_IE_HOVER,
  BREAKPOINT,
  PAGE_TRANSITION_DURATION,
  MAX_CONTENT_WIDTH,
} from "../../constants";
import { scrollToElement } from "../../utils/scrollToElement";
import { formatSlug } from "../../utils/formatSlug";
import { MethodGuide } from "../../types/MethodGuide";

const reveal = keyframes`
  from {
    opacity: 0;
    transform: rotateX(60deg);
  }

  to {
    opacity: 1;
    transform: rotateX(0);
  }
`;

const Container = styled.aside<{
  isScrolled: boolean;
  isAtTheBottom: boolean;
}>`
  display: none;
  position: ${({ isScrolled, isAtTheBottom }) =>
    isScrolled && !isAtTheBottom ? "fixed" : "absolute"};
  top: ${({ isScrolled, isAtTheBottom }) =>
    isScrolled && !isAtTheBottom ? "10rem" : "auto"};
  bottom: ${({ isScrolled, isAtTheBottom }) =>
    isScrolled && isAtTheBottom ? "24rem" : "auto"};
  left: 0;
  width: 100%;
  margin-top: ${({ isScrolled }) => !isScrolled && "14.5rem"};
  pointer-events: none;

  ${SCREEN.ABOVE_LAPTOP} {
    display: block;
  }
`;

const Content = styled.div`
  display: flex;
  max-width: ${MAX_CONTENT_WIDTH}rem;
  margin: 0 auto;
  padding-left: 8rem;
  pointer-events: none;

  ol {
    pointer-events: auto;
  }
`;

const ArticleTitle = styled.li<{ isCurrent: boolean; order: number }>`
  width: 36rem;
  color: ${({ isCurrent }) => (isCurrent ? COLORS.BLUE : COLORS.LIGHT_GREY)};
  font-size: ${FONT_SIZE.SMALL};
  font-weight: ${({ isCurrent }) => isCurrent && 500};
  line-height: 2.6rem;
  animation: ${reveal} 1s ease-in ${({ order }) => order / 10}s both;
  transform-origin: top;
  cursor: pointer;

  ${MEDIA_IE_HOVER} {
    :hover {
      span {
        opacity: ${({ isCurrent }) => !isCurrent && 0.6};
      }
    }
  }
`;

interface TableOfContentsProps {
  articles?: Array<MethodGuide>;
  currentArticleId?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  selectedIndex?: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  articles,
  currentArticleId,
  containerRef,
  selectedIndex,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtTheBottom, setIsAtTheBottom] = useState(false);

  const tocRef = useRef<HTMLElement>(null);

  const handleChapterSelect = useCallback(
    (element?: Element) => scrollToElement(element as HTMLElement),
    []
  );

  const handleScroll = () => {
    const containerEl = containerRef.current;
    const tocEl = tocRef.current;

    if (containerEl) {
      if (containerEl.getBoundingClientRect().top < -45) {
        setIsScrolled(true);
      }

      if (containerEl.getBoundingClientRect().top > -45) {
        setIsScrolled(false);
      }
    }

    if (tocEl && containerEl) {
      const tocHeight = tocEl.getBoundingClientRect().height;
      const containerBottom = containerEl.getBoundingClientRect().bottom;

      if (tocHeight > containerBottom) {
        setIsAtTheBottom(true);
      }

      if (tocHeight < containerBottom) {
        setIsAtTheBottom(false);
      }
    }
  };

  useEffect(() => {
    if (selectedIndex) {
      setTimeout(
        () =>
          handleChapterSelect(containerRef.current?.children[selectedIndex]),
        4000 * PAGE_TRANSITION_DURATION + 500
      );
    }

    if (window.innerWidth >= BREAKPOINT.LAPTOP) {
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Container
      isScrolled={isScrolled}
      isAtTheBottom={isAtTheBottom}
      ref={tocRef}
    >
      <Content>
        <ol>
          {articles &&
            articles.map(({ frontmatter }, index) => (
              <ArticleTitle
                key={frontmatter.title}
                order={index}
                isCurrent={formatSlug(frontmatter.title) === currentArticleId}
                onClick={() =>
                  handleChapterSelect(containerRef.current?.children[index + 1])
                }
              >
                <span>{frontmatter.title}</span>
              </ArticleTitle>
            ))}
        </ol>
      </Content>
    </Container>
  );
};
