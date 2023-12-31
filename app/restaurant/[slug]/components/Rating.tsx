import { Review } from '@prisma/client';
import { calculateReviewRatingAverage } from '../../../../utilities/calculateReviewRatingAverage';
import Reviews from './Reviews';

export default function Rating({ reviews }: { reviews: Review[] }) {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <Reviews reviews={reviews} />
        <p className="text-reg ml-3">{calculateReviewRatingAverage(reviews)}</p>
      </div>
      <div>
        <p className="text-reg ml-4">
          {reviews.length} Review{reviews.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
