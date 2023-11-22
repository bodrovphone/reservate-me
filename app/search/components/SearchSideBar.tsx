import { PRICE, PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

const fetchLocations = () => {
  return prisma.location.findMany({
    select: {
      name: true,
    },
  });
};

const fetchcuisines = () => {
  return prisma.cuisine.findMany({
    select: {
      name: true,
    },
  });
};

export default async function SearchSideBar({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const locations = await fetchLocations();
  const cuisines = await fetchcuisines();

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => {
          return (
            <Link
              href={{
                pathname: '/search',
                query: { ...searchParams, city: location.name },
              }}
              className="font-light text-reg capitalize"
            >
              {location.name}
            </Link>
          );
        })}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => {
          return (
            <Link
              href={{
                pathname: '/search',
                query: { ...searchParams, cuisine: cuisine.name },
              }}
              className="font-light text-reg capitalize"
            >
              {cuisine.name}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 pb-4 flex flex-col">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <Link
            href={{
              pathname: '/search',
              query: { ...searchParams, price: PRICE.CHEAP },
            }}
            className="border w-full text-reg font-light rounded-l p-2"
          >
            $
          </Link>
          <Link
            href={{
              pathname: '/search',
              query: { ...searchParams, price: PRICE.REGULAR },
            }}
            className="border-r border-t border-b w-full text-reg font-light p-2"
          >
            $$
          </Link>
          <Link
            href={{
              pathname: '/search',
              query: { ...searchParams, price: PRICE.EXPENSIVE },
            }}
            className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r"
          >
            $$$
          </Link>
        </div>
      </div>
    </div>
  );
}
