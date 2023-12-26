import { PrismaClient } from '@prisma/client';
import { times } from '../../app/data/times';
import { NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Props = {
  time: string;
  day: string;
  res: NextApiResponse;
  slug: string;
};

export const findAvailableTables = async ({ time, day, res, slug }: Props) => {
  const searchTime = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTime) {
    res.status(400).json({ message: 'Invalid time' });
    return {};
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTime.at(0)}`),
        lte: new Date(`${day}T${searchTime.at(-1)}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesDTO: {
    [key: string]: { [key: number]: true };
  } = {};

  bookings.forEach((booking) => {
    bookingTablesDTO[booking.booking_time.toISOString()] =
      booking.tables.reduce((accum, table) => {
        return {
          ...accum,
          [table.table_id]: true,
        };
      }, {});
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    res.status(404).json({ message: 'Restaurant not found' });
    return {};
  }

  const tables = restaurant.tables;

  console.clear();
  console.log('noticeMeNow', tables);

  const searchTimesWithTable = searchTime.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTable.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesDTO[t.date.toISOString()]) {
        if (bookingTablesDTO[t.date.toISOString()][table.id]) {
          return false;
        }
      }
      return true;
    });
  });

  return { searchTimesWithTable, restaurant };
};
