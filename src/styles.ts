import { createGlobalStyle, DefaultTheme } from 'styled-components';
import reset from 'styled-reset';

export const darkTheme: DefaultTheme = {
  bgColor: '#081328',
  fontColor: '#ffffff',
  accent: '#0095f6',
  borderColor: '#f0f0f0',
};

export const lightTheme: DefaultTheme = {
  bgColor: '#ffffff',
  fontColor: '#081328',
  accent: '#0095f6',
  borderColor: '#f0f0f0',
};

export const GlobalStyles = createGlobalStyle`
  ${reset}
  input {
    all: unset;
  }
  * {
    box-sizing: border-box;
  }
  body {
    background-color: ${(props) => props.theme.bgColor};
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    color: ${(props) => props.theme.fontColor};
  }
  a {
    text-decoration: none;
  }
`;
