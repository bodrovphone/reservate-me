import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { slug, day, time, partySize } = req.query as Record<string, string>;

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
    });

    const { searchTimesWithTable } = await findAvailableTables({
      time,
      day,
      res,
      slug,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (!searchTimesWithTable) {
      return res.status(400).json({
        message:
          'no search times with table - probably a time or other params are not valid',
      });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res
        .status(400)
        .json({ message: 'Restaurant is not open at that time' });
    }

    const searchTimeWithTable = searchTimesWithTable.find((t) => {
      return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if (!searchTimeWithTable) {
      return res.status(400).json({ message: 'no availability, cannot book' });
    }

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    searchTimeWithTable.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else if (table.seats === 4) {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4].pop() as number);
          seatsRemaining -= 4;
        } else {
          tablesToBook.push(tablesCount[2].pop() as number);
          seatsRemaining -= 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2].pop() as number);
          seatsRemaining -= 2;
        } else {
          tablesToBook.push(tablesCount[4].pop() as number);
          seatsRemaining -= 4;
        }
      }
    }

    if (seatsRemaining > 0) {
      return res.status(400).json({
        message: 'your party is too big for the available tables',
      });
    }
    try {
      const booking = await prisma.booking.create({
        data: {
          number_of_people: parseInt(partySize),
          booking_time: new Date(`${day}T${time}`),
          booker_email: bookerEmail,
          booker_phone: bookerPhone,
          booker_first_name: bookerFirstName,
          booker_last_name: bookerLastName,
          booker_occasion: bookerOccasion,
          booker_request: bookerRequest,
          restaurant_id: restaurant.id,
        },
      });

      const bookingOnTablesData = tablesToBook.map((tableId) => {
        return {
          table_id: tableId,
          booking_id: booking.id,
        };
      });

      await prisma.bookingsOnTables.createMany({
        data: bookingOnTablesData,
      });

      return res.status(201).json({
        message: 'Reservation created',
        booking,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'error creating booking', error });
    }
  }
}
