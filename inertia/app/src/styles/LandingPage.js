import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${(props) => props.theme.colors.cardBackground};
  height: 100%;
  width: 100%;
  position: relative;
  perspective: 1px;
`;

export const HeroContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.headerBackground};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 37rem;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 1rem;
  position: relative;

  @media (max-width: 40rem) {
    min-height: 25rem;
    padding-top: 1rem;
  }
`;

export const HeroTitle = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 5rem;
  font-weight: bold;
  text-transform: uppercase;
  user-select: none;
  position: absolute;
  top: calc(50% - 3rem);
  letter-spacing: .6rem;
  text-shadow: 
    -.333rem -.333rem .122rem ${props => props.theme.colors.cardBackground},
    .15rem .15rem .122rem ${props => props.theme.colors.cardBackground};
  
  @media (max-width: 40rem) {
    font-size: 3rem;
  }
`;

export const HeroImage = styled.img`
  max-width: 30rem;

  @media (max-width: 30rem) {
    max-width: 90%;
  }
`;

export const ParallaxImage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-size: 200%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  scroll-behavior: smooth;
  z-index: -1;

  @media (max-width: 40rem) {
    background-size: 300% auto;
  }
`;

export const ParallaxSpacing = styled.div`
  min-height: 75vh;
  z-index: -2;
`;

export const PageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.headerBackground};
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 6rem;
  font-size: 1.5rem;

  @media (max-width: 40rem) {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
`;

export const ContentBlock = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-left: 15rem;
  margin-right: 15rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  background-color: ${props => props.theme.colors.cardBackground};
  padding-left: 6rem;
  padding-right: 6rem;
  padding-top: var(--top-bottom-spacing);
  padding-bottom: var(--top-bottom-spacing);

  @media (max-width: 40rem) {
    margin-left: 3rem;
    margin-right: 3rem;
    padding-left: 3rem;
    padding-right: 3rem;
    font-size: 1.25rem;
  }
`;

export const Header1 = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;

  @media (max-width: 40rem) {
    font-size: 3rem;
  }
`;

export const Paragraph = styled.p`
  @media (max-width: 40rem) {
    font-size: 1.75rem;
  }
`;

export const ParagraphMedWidth = styled(Paragraph)`
  max-width: 40rem;
`;

export const StandaloneImage = styled.img`
  margin-top: var(--top-bottom-spacing);
  margin-bottom: var(--top-bottom-spacing);
  max-width: 100%;
`;

export const StandaloneImageMedWidth = styled(StandaloneImage)`
  width: 40rem;
`;

export const FloatLeftImage = styled.img`
  height: 16rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  float: left;

  @media (max-width: 40rem) {
    height: 20rem;
    margin: 1rem;
  }
`;

export const FloatRightImage = styled.img`
  height: 16rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  float: right;

  @media (max-width: 40rem) {
    height: 20rem;
    margin: 1rem;
  }
`;

export const Highlight = styled.span`
  color: ${props => props.theme.colors.highlightedText};
`;
