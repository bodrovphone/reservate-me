import Header from './components/Header';
import RestaurantNavBar from './components/RestaurantNavBar';
import Title from './components/Title';
import Rating from './components/Rating';
import Description from './components/Description';
import Images from './components/Images';
import Reviews from './components/Reviews';
import ReservationCard from './components/ReservationCard';
import { PrismaClient, Review } from '@prisma/client';

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      reviews: true,
      slug: true,
    },
  });

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  return restaurant;
};

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  images: string[];
  description: string;
  reviews: Review[];
}

export default async function RestaurantDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        {/* RESAURANT NAVBAR */}
        <RestaurantNavBar slug={restaurant.slug} />
        {/* RESAURANT NAVBAR */} {/* TITLE */}
        <Title name={restaurant.name} />
        {/* TITLE */} {/* RATING */}
        <Rating reviews={restaurant.reviews} />
        {/* RATING */} {/* DESCRIPTION */}
        <Description description={restaurant.description} />
        {/* DESCRIPTION */} {/* IMAGES */}
        <Images images={restaurant.images} />
        {/* IMAGES */} {/* REVIEWS */}
        <Reviews reviews={restaurant.reviews} />
        {/* REVIEWS */}
      </div>
      <ReservationCard />
    </>
  );
}
