import styled from "styled-components";

const CardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 5rem 1.5rem 5rem;
  border-radius: 1rem;
  width: 35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: var(--top-bottom-spacing);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  @media (max-width: 57rem) {
    width: calc(100% - 6rem);
    padding: 1rem 2rem 1.5rem 2rem;
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-top: 1rem;
`;

const CardSubtitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  margin-left: 1rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
`;

const CardContent = styled.div`
  flex-grow: 1;
`;

const WidthGrowWrapper = styled.div`
  width: 100% !important;
`;

const Card = ({
  className = "",
  children,
  disabled = false,
  subtitle,
  title,
}) => {

  return (
    <CardContainer className={`${className}`} disabled={disabled}>
      <WidthGrowWrapper>
        { title && 
          <CardTitle>
            <h2>{title}</h2>
          </CardTitle> 
        }
        { subtitle &&
          <CardSubtitle>
            <h3>{subtitle}</h3>
          </CardSubtitle>
        }
        <CardContent>{children}</CardContent>
      </WidthGrowWrapper>
    </CardContainer>
  );
};

export default Card;
