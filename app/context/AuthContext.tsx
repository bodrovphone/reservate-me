'use client';

import React from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface State {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

// cc@dd.vi
// pasSwo342rd!!!fasD
export const AuthenticationContext = React.createContext<AuthState>({
  initialized: false,
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = React.useState<State>({
    initialized: false,
    loading: false,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    try {
      const jwt = getCookie('jwt');

      if (!jwt) {
        return setAuthState({
          initialized: true,
          loading: false,
          data: null,
          error: null,
        });
      }

      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      setAuthState({
        initialized: true,
        loading: false,
        data: response.data,
        error: null,
      });
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
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
