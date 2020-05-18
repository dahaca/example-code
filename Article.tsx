import React, { useState, useRef, useEffect } from "react";
import SEO from "../components/Seo";
import { Layout } from "../components/Layout";
import { BREAKPOINT } from "../constants";
import { throttle } from "throttle-debounce";
import { MethodGuide } from "../types/MethodGuide";
import { MethodArticle } from "../components/methodStage/MethodArticle";
import { TableOfContents } from "../components/methodStage/TableOfContents";
import { Heading } from "../components/Heading";
import { AnimatedPageProps } from "../pages";
import { AnimatedLink } from "../components/AnimatedLink";
import { SectionDescription } from "../components/SectionDescription";
import { FloatingText } from "../components/FloatingText";
import { ArticlesContainer } from "../components/ArticlesContainer";

interface MethodGroup {
  fieldValue: string;
  nodes: Array<MethodGuide> | undefined;
}

interface MethodStageContext {
  name: string;
  description: string;
  articles: MethodGroup;
}

const MethodStagePage: React.FC<AnimatedPageProps<
  unknown,
  MethodStageContext
>> = ({ pageContext: { name, description, articles }, location }) => {
  const [currentArticleId, setCurrentArticleId] = useState<string>();

  const containerRef = useRef<HTMLDivElement>(null);

  const handleScrollSpy = throttle(400, () => {
    if (containerRef.current) {
      let bestMatch: { articleId: string; delta: number } | undefined;

      for (const articleEl of containerRef.current.children) {
        const articleId = articleEl.id;

        if (articleId) {
          const delta = Math.abs(
            window.pageYOffset - (articleEl as HTMLElement).offsetTop
          );

          if (!bestMatch) {
            bestMatch = { articleId, delta };
          } else if (delta < bestMatch?.delta) {
            bestMatch = { articleId, delta };
          }
        }
      }

      setCurrentArticleId(bestMatch?.articleId);
    }
  });

  useEffect(() => {
    if (window.innerWidth >= BREAKPOINT.LAPTOP) {
      window.addEventListener("scroll", handleScrollSpy);

      return () => window.removeEventListener("scroll", handleScrollSpy);
    }
  }, []);

  return (
    <Layout>
      <SEO title={`${name}`} description={description} />

      <section>
        <Heading
          isMain
          subheading={<AnimatedLink to="/method">Method</AnimatedLink>}
        >
          {name}
        </Heading>
        <SectionDescription maxWidth={60} isMain>
          {description}
        </SectionDescription>
        <FloatingText>Read on</FloatingText>

        <ArticlesContainer ref={containerRef}>
          <TableOfContents
            articles={articles?.nodes}
            currentArticleId={currentArticleId}
            containerRef={containerRef}
            selectedIndex={(location.state as { index: number })?.index}
          />

          {articles?.nodes?.map(({ html, frontmatter }) => (
            <MethodArticle
              key={frontmatter.title}
              html={html}
              frontmatter={frontmatter}
            />
          ))}
        </ArticlesContainer>
      </section>
    </Layout>
  );
};

export default MethodStagePage;
