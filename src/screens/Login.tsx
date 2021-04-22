import React from 'react';
import styled from 'styled-components';
import {
  faFacebookSquare,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import routes from '../routes';
import AuthLayout from '../components/auth/AuthLayout';
import FormBox from '../components/auth/FormBox';
import Input from '../components/auth/Input';
import Button from '../components/auth/Button';
import Separator from '../components/auth/Separator';
import BottomBox from '../components/auth/BottomBox';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import FormError from '../components/auth/FormError';
import { gql, useMutation } from '@apollo/client';
import { login, loginVariables } from '../__generated__/login';
import { logUserIn } from '../apollo';
import { useLocation } from 'react-router';

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      error
      token
    }
  }
`;

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

interface ILoginForm {
  username: string;
  password: string;
}

interface ILocationState {
  username?: string;
  password?: string;
}

const Login = () => {
  const location = useLocation<ILocationState>();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    mode: 'onChange',
    defaultValues: {
      username: location.state?.username || '',
      password: location.state?.password || '',
    },
  });
  const onCompleted = (data: login) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      logUserIn(token);
    }
  };
  const [login, { loading, data: loginData }] = useMutation<
    login,
    loginVariables
  >(LOGIN_MUTATION, { onCompleted });
  const onValid = () => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: {
        username,
        password,
      },
    });
  };
  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register('username', {
              required: 'Username is required.',
              minLength: {
                value: 4,
                message: 'Username should be longer than 4 chars.',
              },
            })}
            type="text"
            placeholder="Username"
            hasError={Boolean(errors.username?.message)}
          />
          {errors.username?.message && (
            <FormError message={errors.username.message} />
          )}
          <Input
            {...register('password', {
              required: 'Password is required.',
              minLength: {
                value: 4,
                message: 'Password should be longer than 4 chars.',
              },
            })}
            type="password"
            placeholder="Password"
            hasError={Boolean(errors.password?.message)}
          />
          {errors.password?.message && (
            <FormError message={errors.password.message} />
          )}
          <Button
            type="submit"
            value={loading ? 'Loading...' : 'Log in'}
            disabled={!isValid || loading}
          />
          {loginData?.login.error && (
            <FormError message={loginData.login.error} />
          )}
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
};

export default Login;
