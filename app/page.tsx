import Head from 'next/head';
import Header from './components/Header';
import RestaurantCard, {
  RestaurantCardType,
} from './components/RestaurantCard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      slug: true,
      cuisine: true,
      location: true,
      price: true,
      reviews: true,
    },
  });

  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <>
      <Head key="latest">
        <title>ReserveMe</title>
        <meta property="og:title" content="ReserveMe" key="title" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="ReserveMe" />
      </Head>
      {/* HEADER */}
      <Header />
      {/* HEADER */} {/* CARDS */}
      <div className="py-3 px-36 mt-10 flex flex-wrap text-black">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
      {/* CARDS */}
    </>
  );
}
