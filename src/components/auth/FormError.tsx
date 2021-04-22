import styled from 'styled-components';

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
  margin: 12px 0px 0px 0px;
`;

interface IFormErrorProps {
  message: string;
}

const FormError: React.FC<IFormErrorProps> = ({ message }) => {
  return <SFormError>{message}</SFormError>;
};

export default FormError;
