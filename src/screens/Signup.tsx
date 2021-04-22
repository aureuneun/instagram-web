import { gql, useMutation } from '@apollo/client';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import AuthLayout from '../components/auth/AuthLayout';
import BottomBox from '../components/auth/BottomBox';
import Button from '../components/auth/Button';
import FormBox from '../components/auth/FormBox';
import FormError from '../components/auth/FormError';
import Input from '../components/auth/Input';
import PageTitle from '../components/PageTitle';
import { FatLink } from '../components/shared';
import routes from '../routes';
import {
  createAccount,
  createAccountVariables,
} from '../__generated__/createAccount';

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    ) {
      ok
      error
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

interface ISignupForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

const SingUp = () => {
  const history = useHistory();
  const onCompleted = (data: createAccount) => {
    const {
      createAccount: { ok },
    } = data;
    const { username, password } = getValues();
    if (ok) {
      return history.push(routes.home, { username, password });
    }
  };
  const [createAccount, { loading, data: createAccountData }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<ISignupForm>({ mode: 'onChange' });
  const onValid = () => {
    if (loading) {
      return;
    }
    const { firstName, lastName, email, username, password } = getValues();
    createAccount({
      variables: {
        firstName,
        lastName,
        email,
        username,
        password,
      },
    });
  };
  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register('firstName', { required: 'First name is required.' })}
            type="text"
            placeholder="First Name"
          />
          {errors.firstName?.message && (
            <FormError message={errors.firstName.message} />
          )}
          <Input
            {...register('lastName', { required: 'Last name is required.' })}
            type="text"
            placeholder="Last Name"
          />
          {errors.lastName?.message && (
            <FormError message={errors.lastName.message} />
          )}
          <Input
            {...register('email', { required: 'Email is required.' })}
            type="email"
            placeholder="Email"
          />
          {errors.email?.message && (
            <FormError message={errors.email.message} />
          )}
          <Input
            {...register('username', { required: 'UserName is required.' })}
            type="text"
            placeholder="Username"
          />
          {errors.username?.message && (
            <FormError message={errors.username.message} />
          )}
          <Input
            {...register('password', { required: 'Password is required.' })}
            type="password"
            placeholder="Password"
          />
          {errors.password?.message && (
            <FormError message={errors.password.message} />
          )}
          <Button
            type="submit"
            value={loading ? 'Loading...' : 'Sign up'}
            disabled={!isValid || loading}
          />
          {createAccountData?.createAccount.error && (
            <FormError message={createAccountData.createAccount.error} />
          )}
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
    </AuthLayout>
  );
};

export default SingUp;
