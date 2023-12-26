'use client';

import React from 'react';
import { partySize } from '../../../data/partySize';
import { times } from '../../../data/times';
import ReactDatePicker from 'react-datepicker';
import useAvailabilities from '../../../hooks/useAvailabilities';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import {
  convertToDisplayTime,
  Time,
} from '../../../../utilities/convertToDisplayTime';

type Props = {
  openTime: string;
  closeTime: string;
  slug: string;
};
export default function ReservationCard({ openTime, closeTime, slug }: Props) {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [time, setTime] = React.useState(openTime);
  const [size, setSize] = React.useState(1);
  const [day, setDay] = React.useState<string>(
    new Date()?.toISOString().split('T')[0]
  );

  const { data, loading, error, fetchAvailabilities } = useAvailabilities({
    slug,
    day,
    time,
    partySize: size,
  });

  console.log('data', data);

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithinWindow = true;
      }

      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }

      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };

  const handleClick = () => {
    fetchAvailabilities();
  };

  const handleChangeDate = (date: Date | null) => {
    setStartDate(date);

    const day = date?.toISOString().split('T')[0];
    if (!day) return;
    setDay(day);
  };

  return (
    <div className="w-[27%] relative text-reg">
      <div className="fixed w-[15%] bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select
            name=""
            className="py-3 border-b font-light bg-white"
            id=""
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
          >
            {partySize.map((size) => (
              <option value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <ReactDatePicker
              selected={startDate}
              onChange={handleChangeDate}
              className="py-3 border-b font-light text-reg w-28 bg-white"
              dateFormat="MMMM d"
              wrapperClassName="w-[48]"
            />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              name=""
              id=""
              className="py-3 border-b font-light bg-white"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {filterTimeByRestaurantOpenWindow().map((time) => (
                <option value={time.time}>{time.displayTime}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? <CircularProgress color="inherit" /> : 'Find a Time'}
          </button>
        </div>
      </div>
      {data?.length && (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((availability) =>
              availability.availabilities ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${availability.time}&partySize=${size}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(availability.time as Time)}
                  </p>
                </Link>
              ) : (
                <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
