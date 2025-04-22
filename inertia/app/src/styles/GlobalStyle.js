import { createGlobalStyle } from "styled-components";

export const HEADER_HEIGHT = "5rem";

// This is broken in local development, but works in production
// Need to update the index.html file when you change this
const GlobalStyle = createGlobalStyle`
  :root {
    --header-height: ${HEADER_HEIGHT};
    --top-bottom-spacing: 2rem;
    --outside-card-spacing: 1rem;
    --phone-size-break: 40rem;
    --full-page-size-break: 60rem;
  }

  html, body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.fonts.base};
    font-size: ${(props) => props.theme.fonts.size};
    margin: 0;
    padding: 0;
    height: auto;
    width: auto;
    overflow-x: hidden;
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.scrollbarThumb} ${(props) => props.theme.colors.scrollbarBackground};
  }

  #root {
    overflow-y: visible;
    height: auto;
    margin: 0;
    padding: 0;
    width: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  .react-tel-input .selected-flag .flag {
    margin-top: -0.6rem;
  }

  a, a:visited {
    color: ${(props) => props.theme.colors.link};
    text-decoration: none;
  }

  ul {
    list-style-type: none;
  }

  ul li, ul li a, ul li a:visited {
    position: relative;
    padding-left: 0.6rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.text};
  }

  ul li::before {
    content: '‣';
    position: absolute;
    left: 0;
    top: -0.2rem;
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.5rem;
    line-height: 1.5;
  }

  ul li:hover, ul li a:hover, ul li a:visited:hover {
    color: ${(props) => props.theme.colors.secondary};
    cursor: pointer;
  }

  .wt_coupon_wrapper {
    display: none;
  }
`;

  export default GlobalStyle;