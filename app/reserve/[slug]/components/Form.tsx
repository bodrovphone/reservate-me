'use client';

import React from 'react';
import useReservation from '../../../hooks/useReservation';
import { CircularProgress } from '@mui/material';

export default function Form(formProps: {
  slug: string;
  partySize: number;
  date: string;
}) {
  const [inputs, setInputs] = React.useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequest: '',
  });

  const [day, time] = formProps.date.split('T');

  const [disabled, setDisabled] = React.useState(true);
  const [didBook, setDidBook] = React.useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    const { bookerOccasion, bookerRequest, ...inputsRequired } = inputs;
    const isDisabled = Object.values(inputsRequired).some(
      (value) => value === ''
    );
    setDisabled(isDisabled);
  }, [inputs]);

  const { createReservation, loading } = useReservation();

  const handleSubmit = async () => {
    await createReservation({
      ...inputs,
      ...formProps,
      time,
      day,
      onReservation: () => {
        setDidBook(true);
      },
    });
  };

  if (didBook) {
    return (
      <div className="mt-10 flex flex-wrap justify-between w-[660px]">
        <h1>You made it! - booked your seats</h1>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-gray-100"
        placeholder="First name"
        name="bookerFirstName"
        onChange={onChange}
        value={inputs.bookerFirstName}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-gray-100"
        placeholder="Last name"
        name="bookerLastName"
        onChange={onChange}
        value={inputs.bookerLastName}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-gray-100"
        placeholder="Phone number"
        name="bookerPhone"
        onChange={onChange}
        value={inputs.bookerPhone}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-gray-100"
        placeholder="Email"
        name="bookerEmail"
        onChange={onChange}
        value={inputs.bookerEmail}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-gray-100"
        placeholder="Occasion (optional)"
        name="bookerOccasion"
        onChange={onChange}
        value={inputs.bookerOccasion}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-gray-100"
        placeholder="Requests (optional)"
        name="bookerRequest"
        onChange={onChange}
        value={inputs.bookerRequest}
      />
      <button
        disabled={disabled || loading}
        onClick={handleSubmit}
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          'Complete reservation'
        )}
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of
        Use and Privacy Policy. Standard text message rates may apply. You may
        opt out of receiving text messages at any time.
      </p>
    </div>
  );
}
