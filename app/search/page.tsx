import Header from './components/Header';
import SearchSideBar from './components/SearchSideBar';
import RestaurnatCard from './components/RestaurantCard';
import { PRICE, Prisma, PrismaClient, Restaurant } from '@prisma/client';

const prisma = new PrismaClient();

type SearchParams = {
  city?: string;
  cuisine?: string;
  price?: PRICE;
};
const fetchRestaurantByCity = ({ city, cuisine, price }: SearchParams) => {
  if (!city && !cuisine && !price) {
    return prisma.restaurant.findMany({
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
  }

  const filters: Prisma.RestaurantWhereInput = {};

  if (city) {
    filters['location'] = {
      name: {
        contains: city,
      },
    };
  }

  if (cuisine) {
    filters['cuisine'] = {
      name: {
        contains: cuisine,
      },
    };
  }

  if (price) {
    filters['price'] = {
      equals: price.toUpperCase() as PRICE,
    };
  }

  return prisma.restaurant.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      main_image: true,
      slug: true,
      cuisine: true,
      location: true,
      reviews: true,
      price: true,
    },
  });
};

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const restaurants = await fetchRestaurantByCity({
    city: searchParams.city?.toLowerCase().trim(),
    cuisine: searchParams.cuisine?.toLowerCase().trim(),
    price: searchParams.price?.toLowerCase().trim() as any,
  });

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        {/* SEARCH SIDE BAR */}
        <SearchSideBar searchParams={searchParams} />
        {/* SEARCH SIDE BAR */}
        <div className="w-5/6">
          {/* RESAURANT CAR */}
          {restaurants.length === 0 && (
            <h1 className="text-2xl">No restaurants found</h1>
          )}
          {restaurants.map(({ id, ...restaurant }) => (
            <RestaurnatCard key={id} {...restaurant} />
          ))}
          {/* RESAURANT CAR */}
        </div>
      </div>
    </>
  );
}
