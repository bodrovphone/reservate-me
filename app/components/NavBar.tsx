'use client';

import Link from 'next/link';
import AuthModal from './AuthModal';
import { AuthenticationContext } from '../context/AuthContext';
import React from 'react';
import useAuth from '../hooks/useAuth';

export default function NavBar() {
  const { singOut } = useAuth();
  const { data, loading, initialized } = React.useContext(
    AuthenticationContext
  );
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        {' '}
        OpenTable{' '}
      </Link>
      <div>
        <div className="flex">
          {data && !loading && initialized ? (
            <button
              className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
              onClick={singOut}
            >
              Logout
            </button>
          ) : (
            !loading &&
            initialized && (
              <>
                <AuthModal isSignedIn />
                <AuthModal isSignedIn={false} />
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
