import { Review } from '@prisma/client';

export const calculateReviewRatingAverage = (reviews: Review[]): number => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((acc, review) => {
    return acc + review.rating;
  }, 0);
  return (total / reviews.length).toFixed(1) as any;
};
