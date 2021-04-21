import { createGlobalStyle, DefaultTheme } from 'styled-components';
import reset from 'styled-reset';

export const darkTheme: DefaultTheme = {
  bgColor: 'black',
  fontColor: 'white',
};

export const whiteTheme: DefaultTheme = {
  bgColor: 'white',
  fontColor: 'red',
};

export const GlobalStyles = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    background-color: ${(props) => props.theme.bgColor};
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
  }
  a {
    text-decoration: none;
  }
  input {
    all: unset;
  }
`;
