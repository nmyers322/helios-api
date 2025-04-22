import styled from 'styled-components';

export const HeaderContainerLarge = styled.div`
  position: fixed;
  top: 0;
  height: var(--header-height);
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: ${props => props.theme.colors.headerBackground};
  width: 100%;
  z-index: 1;

  @media (max-width: 60rem) {
    display: none;
  }
`;

export const HeaderContainerSmall = styled.div`
    display: none;

    @media (max-width: 60rem) {
    padding-top: 0.2rem;
        position: fixed;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: var(--header-height);
        background-color: ${(props) => props.theme.colors.headerBackground};
        width: 100%;
        z-index: 1;
    }
`;

export const HeaderLink = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  padding: 0 2rem;
  min-width: 10rem;
  box-sizing: border-box;
  z-index: 2;

  &:hover {
    color: ${props => props.theme.colors.highlightedText};
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: .2rem;
    background-color: ${props => props.theme.colors.highlightedText};
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`;

export const HeaderButtonContainer = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-transform: uppercase;
  padding: 0 2rem;
  min-width: 10rem;
  box-sizing: border-box;
`;

export const SunContainer = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  padding: 0 2rem;
  min-width: 12rem;
  box-sizing: border-box;
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.5s ease, transform 0.5s ease;
  user-select: none;

  &.visible {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const LinksWrapper = styled(HeaderContainerLarge)``;
