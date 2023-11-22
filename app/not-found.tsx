'use client';
import Image from 'next/image';
import ErrorImage from '../public/icons/error.png';

export default function ErrorComponent({ error }: { error: React.ErrorInfo }) {
  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <Image src={ErrorImage} alt="Error" className="w-56 mb-8" />
      <div className="bg-white px-9 py-14 shadow rounded">
        <h3 className="text-3xl font-bold">Well, this is embarrasing</h3>
        <p className="text-red font-bold">{error?.message}</p>
        <p className="mt-6 text-sm font-light">Some error happens</p>
      </div>
    </div>
  );
}
