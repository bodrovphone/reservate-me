'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AuthModalInputs from './AuthModalnputs';
import useAuth from '../hooks/useAuth';
import { AuthenticationContext } from '../context/AuthContext';
import { Alert, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  width: 400,
  boxShadow: 24,
  color: 'black',
  p: 4,
};

export default function AuthModal({ isSignedIn }: { isSignedIn: boolean }) {
  const { error, loading, data } = React.useContext(AuthenticationContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //   console.log('noticeMeNow', error, loading, data);

  const renderContentIfSignedIn = (
    signinContent: string,
    sinupContent: string
  ) => {
    return isSignedIn ? signinContent : sinupContent;
  };

  const { signIn, signUp } = useAuth();

  const [inputs, setInputs] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });

  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (isSignedIn) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (Object.values(inputs).every(Boolean)) {
        return setDisabled(false);
      }
    }
    setDisabled(true);
  }, [inputs]);

  const handleClick = () => {
    if (isSignedIn) {
      signIn(
        {
          email: inputs.email,
          password: inputs.password,
        },
        handleClose
      );
    } else {
      signUp(
        {
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          email: inputs.email,
          password: inputs.password,
          phone: inputs.phone,
          city: inputs.city,
        },
        handleClose
      );
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${
          isSignedIn ? 'bg-blue-400 text-white' : ''
        }border p-1 px-4 rounded mr-3`}
      >
        {renderContentIfSignedIn('Sign in', 'Sign up')}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 px-2 h-[60vh] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[60vh]">
              {error ? (
                <Alert severity="error" className="mb-2">
                  this is an alert of error
                </Alert>
              ) : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-small">
                  {renderContentIfSignedIn('Sign in', 'Create Account')}
                </p>
                <p>
                  {data?.firstName} {data?.lastName}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContentIfSignedIn(
                    'Sign in to your account',
                    'Create an account to start booking'
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  setInputs={setInputs}
                  isSignedIn={isSignedIn}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContentIfSignedIn('Sign in', 'Create Account')}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
