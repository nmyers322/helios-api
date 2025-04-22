import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import heliosTxtLogo from '../../images/helios-text-yellow-1000.png';
import parallax1 from '../../images/parallax1.jpeg';
import parallax2 from '../../images/parallax2.jpeg';
import parallax3 from '../../images/parallax3.jpeg';
import standalone1 from '../../images/standalone1.jpeg';
import { ContentBlock, FloatRightImage, Header1, HeroContainer, HeroImage, Highlight, PageContainer, PageSection, Paragraph, ParagraphMedWidth, ParallaxImage, ParallaxSpacing, StandaloneImageMedWidth } from '../../styles/LandingPage';
import ButtonBigCTA from '../form/main/ButtonBigCTA';

const LandingPage = ({
  titleRef
}) => {
  const navigate = useNavigate();
  const parallaxRefs = useRef([]);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          parallaxRefs.current.forEach((ref, i) => {
            if (ref) {
              const offset = ref.offsetTop;
              const moveUpBy = window.innerWidth;
              ref.style.backgroundPositionY = `${((scrollPos - offset - moveUpBy) * 0.5)}px`;
            }
          });
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [parallaxRefs, ticking]);

  return (
    <PageContainer>

      <HeroContainer ref={titleRef}>
        <HeroImage src={heliosTxtLogo} />
      </HeroContainer>

      <ParallaxImage 
        ref={el => parallaxRefs.current[0] = el}
        style={{
          backgroundImage: `url(${parallax3})`
        }}>
        <ParallaxSpacing />
      </ParallaxImage>

      <PageSection id="about">
        <ContentBlock>
          <Header1>
            Crafting High-Quality Vinyl Records
          </Header1>
          <Paragraph>At Helios Press, our mission is to craft <Highlight>high-quality, domestically manufactured vinyl records</Highlight>. We cater to fans and collectors across all genres who cherish the experience of listening to music on physical formats and appreciate the purity of phonographic sound.</Paragraph>
        </ContentBlock>
      </PageSection>

      <ParallaxImage 
        ref={el => parallaxRefs.current[1] = el}
        style={{backgroundImage: `url(${parallax2})`}}>
        <ContentBlock style={{
          flexDirection: "row",
        }}>
          <Paragraph>Owned and operated by dedicated music fans, <Highlight>Helios</Highlight> brings decades of deep involvement in the independent music scene to the table. From organizing and promoting gigs, publishing music-related books and zines, and running DIY music labels and underground record stores, our team’s experience spans the process from start to finish. This wealth of knowledge fuels our continuous efforts to optimize both <Highlight>customer experience and record quality</Highlight>.</Paragraph>
        </ContentBlock>
      </ParallaxImage>

      <PageSection>
        <ContentBlock>
          <Header1>
            State-of-the-Art Pressing Machines
          </Header1>
          <ParagraphMedWidth>With four brand new manual pressing machines imported from Germany, we can produce 160 or 180-gram 12" vinyl with a wide range of color options.</ParagraphMedWidth>
          <StandaloneImageMedWidth 
            src={standalone1} />
          <ParagraphMedWidth>Based in Brady, Texas, Helios Press partners with <a href="https://www.enormousdoor.com/" target="_blank" rel="noopener noreferrer">Enormous Door Mastering</a>, a seasoned Texas-based company with over two decades of expertise. Together, we bring an audiophile sensibility to guarantee the <Highlight>finest sound quality</Highlight> for your vinyl records.</ParagraphMedWidth>

          <Header1>Ready to get started?</Header1>

          <ButtonBigCTA 
            buttonText={"BEGIN NEW ORDER"}
            onClick={() => navigate('/order')}
            styles={{fontSize: "2rem"}} />
        </ContentBlock>
      </PageSection>

      <ParallaxImage 
        ref={el => parallaxRefs.current[2] = el}
        style={{backgroundImage: `url(${parallax1})`}}>
        <ContentBlock>
          <Header1>
            Top-Notch Customer Service
          </Header1>
          <Paragraph>Beyond producing quality records, Helios is committed to delivering <Highlight>exceptional customer service</Highlight>. We focus on direct communication with our clients, providing detailed explanations of the vinyl pressing process, realistic timelines, and ensuring efficient and reliable product delivery.</Paragraph>
        </ContentBlock>
      </ParallaxImage>

      <PageSection>
        <ContentBlock>
          <Header1>
            Values That Drive Us
          </Header1>
          <Paragraph><FloatRightImage style={{maxWidth: "20rem"}} src={heliosTxtLogo} />At Helios, we bring our personal values to our work. We believe in American manufacturing and supporting the local economy. We hire from our community and source production materials from domestic suppliers whenever possible. We are also mindful of our environmental impact, striving to minimize waste and reuse surplus materials. Lastly, we uphold the right to free speech and refuse to engage in any content-based censorship.</Paragraph>
        </ContentBlock>
      </PageSection>

    </PageContainer>
  );
};

export default LandingPage;