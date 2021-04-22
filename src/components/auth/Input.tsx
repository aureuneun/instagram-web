import styled from 'styled-components';

interface IInputProps {
  hasError?: boolean;
}

const Input = styled.input<IInputProps>`
  width: 100%;
  border-radius: 3px;
  padding: 7px;
  background-color: #fafafa;
  color: rgb(38, 38, 38);
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    border-color: ${(props) => (props.hasError ? 'tomato' : '#ffa502')};
  }
`;

export default Input;
