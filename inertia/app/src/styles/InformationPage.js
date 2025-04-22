import styled from "styled-components";

const InformationPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin-left: 5rem;
    margin-right: 5rem;
    margin-top: var(--header-height);
    padding: var(--top-bottom-spacing);
    box-sizing: border-box;
    font-size: 1.5rem;
    line-height: 2rem;
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.cardBackground};
    margin-top: var(--top-bottom-spacing);
    margin-bottom: var(--top-bottom-spacing);
    word-wrap: break-word;
    scrollbar-color: ${(props) => props.theme.colors.text} ${(props) => props.theme.colors.cardBackground};
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        width: 0.5rem;
    }
    &::-webkit-scrollbar-track {
        background: ${(props) => props.theme.colors.cardBackground};
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.colors.text};
        border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: ${(props) => props.theme.colors.text};
    }
    @media (max-width: 40rem) {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

export default InformationPage;