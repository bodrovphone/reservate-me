import { Cuisine, Location, PRICE as PriceType, Review } from '@prisma/client';
import Link from 'next/link';
import Price from '../../components/Price';
import { calculateReviewRatingAverage } from '../../../utilities/calculateReviewRatingAverage';
import Stars from '../../components/Stars';

interface Props {
  name: string;
  location: Location;
  main_image: string;
  slug: string;
  reviews: Review[];
  cuisine: Cuisine;
  price: PriceType;
}

export default function RestaurnatCard({
  name,
  location,
  main_image,
  slug,
  cuisine,
  price,
  reviews,
}: Props) {
  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(reviews);
    if (rating > 4) {
      return 'Awesome';
    } else if (rating > 3) {
      return 'Good';
    } else if (rating > 2) {
      return 'Okay';
    } else if (rating > 1) {
      return 'Not so good';
    } else {
      return 'Not rated yet';
    }
  };
  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={main_image} alt="" className="w-44 h-36 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{name}</h2>
        <div className="flex items-start">
          <Stars reviews={reviews} />
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={price} />
            <p className="mr-4 capitalize">{cuisine.name}</p>
            <p className="mr-4 capitalize">{location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}
