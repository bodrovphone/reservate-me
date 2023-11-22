import React from 'react';

import fullStar from '../../public/icons/full-star.png';
import halfStar from '../../public/icons/half-star.png';
import emptyStar from '../../public/icons/empty-star.png';

import Image from 'next/image';
import { Review } from '@prisma/client';
import { calculateReviewRatingAverage } from '../../utilities/calculateReviewRatingAverage';

export default function Stars({ reviews = [] }: { reviews: Review[] }) {
  const rating = calculateReviewRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = parseFloat((rating - i).toFixed(1));

      if (difference >= 1) {
        stars.push(
          <Image
            src={fullStar}
            alt="full star"
            className="w-4 h4 mr-1"
            key={i}
          />
        );
      } else if (difference < 1 && difference > 0) {
        stars.push(
          <Image
            src={halfStar}
            alt="half star"
            className="w-4 h4 mr-1"
            key={i}
          />
        );
      } else {
        stars.push(
          <Image
            src={emptyStar}
            alt="empty star"
            className="w-4 h4 mr-1"
            key={i}
          />
        );
      }
    }

    return stars;
  };

  return <div className="flex flex-center">{renderStars()}</div>;
}
