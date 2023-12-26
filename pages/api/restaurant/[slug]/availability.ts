import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../app/data/times';
import { PrismaClient } from '@prisma/client';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(400).json({ message: 'Invalid request' });
  }

  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  if (!slug || !day || !time || !partySize) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  const searchTime = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTime) {
    res.status(400).json({ message: 'Invalid time' });
    return;
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
    return;
  }

  const { searchTimesWithTable = [] } =
    (await findAvailableTables({ time, day, res, slug })) ?? {};

  if (!searchTimesWithTable) {
    return res.status(400).json({
      message:
        'no search times with table - probably a time or other params are not valid',
    });
  }

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

  const availabilities = searchTimesWithTable
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);

      return {
        time: t.time,
        availabilities: sumSeats >= parseInt(partySize),
      };
    })
    .filter((availability) => {
      const timeIsAfterOpenningHours =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      const timeIsBeforeClosingHours =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);

      return timeIsAfterOpenningHours && timeIsBeforeClosingHours;
    });

  return res.json({
    availabilities,
  });
}

// localhost:3000/api/restaurant/ramakrishna-indian-restaurant-ottawa/availability?day=2021-01-01&time=00:30:00.000Z&partySize=2
