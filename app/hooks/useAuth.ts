import axios from 'axios';
import React from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import { getCookies, deleteCookie } from 'cookies-next';

const useAuth = () => {
  const { setAuthState } = React.useContext(AuthenticationContext);

  const signIn = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose?: () => void
  ) => {
    setAuthState({
      initialized: true,
      loading: true,
      data: null,
      error: null,
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/signin',
        {
          email,
          password,
        }
      );

      setAuthState({
        initialized: true,
        loading: false,
        data: response.data,
        error: null,
      });

      handleClose?.();
    } catch (e: any) {
      setAuthState({
        initialized: true,
        loading: false,
        data: null,
        error: e.response.data.message,
      });
      console.error(e);
    }
  };

  const signUp = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose?: () => void
  ) => {
    setAuthState({
      initialized: true,
      loading: true,
      data: null,
      error: null,
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/signup',
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phone,
        }
      );

      setAuthState({
        initialized: true,
        loading: false,
        data: response.data,
        error: null,
      });

      handleClose?.();
    } catch (e: any) {
      setAuthState({
        initialized: true,
        loading: false,
        data: null,
        error:
          e?.response?.data?.message ||
          e?.response?.data?.errors?.join(', ') ||
          e?.message ||
          'weird error',
      });
      console.error(e);
    }
  };

  const singOut = async () => {
    deleteCookie('jwt');

    setAuthState({
      initialized: true,
      loading: false,
      data: null,
      error: null,
    });
  };
  return {
    signIn,
    signUp,
    singOut,
  };
};

export default useAuth;
