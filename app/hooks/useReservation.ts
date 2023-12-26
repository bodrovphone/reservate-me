import { useState } from 'react';
import axios from 'axios';

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
    onReservation,
  }: {
    slug: string;
    partySize: number;
    day: string;
    time: string;
    onReservation: () => void;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequest: string;
  }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve?day=${day}&time=${time}&partySize=${partySize}`,
        {
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequest,
        }
      );

      setLoading(false);
      onReservation();
      return response.data;
    } catch (error: any) {
      setError(error?.response?.data?.errorMessage);
    }
  };

  return {
    loading,
    error,
    createReservation,
  };
}
