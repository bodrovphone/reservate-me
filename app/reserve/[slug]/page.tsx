import Header from './components/Header';
import Form from './components/Form';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function ReservationPate({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    date: string;
    partySize: number;
  };
}) {
  const restaurant = await fetchRestaurantBySlug(slug);
  return (
    <>
      {/* NAVBAR END */}
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          {/* HEADER */}
          <Header
            image={restaurant.main_image}
            name={restaurant.name}
            date={searchParams.date}
            partySize={searchParams.partySize}
          />
          {/* HEADER */} {/* FORM */}
          <Form
            date={searchParams.date}
            partySize={searchParams.partySize}
            slug={slug}
          />
        </div>
      </div>
    </>
  );
}
