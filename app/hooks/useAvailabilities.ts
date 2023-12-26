import { useState } from 'react';
import axios from 'axios';

export default function useAvailabilities({
  slug,
  partySize,
  day,
  time,
}: {
  slug: string;
  partySize: number;
  day: string;
  time: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<
    | {
        time: string;
        availabilities: boolean;
      }[]
    | null
  >(null);

  const fetchAvailabilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability?day=${day}&time=${time}&partySize=${partySize}`
      );

      setLoading(false);
      setData(response.data.availabilities);
    } catch (error: any) {
      setError(error?.response?.data?.errorMessage);
    }
  };

  return {
    loading,
    error,
    data,
    fetchAvailabilities,
  };
}
