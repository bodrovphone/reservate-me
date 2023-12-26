import {
  Time,
  convertToDisplayTime,
} from '../../../../utilities/convertToDisplayTime';
import { format } from 'date-fns';

export default function Header({
  image,
  name,
  date,
  partySize,
}: {
  image: string;
  name: string;
  date: string;
  partySize: number;
}) {
  const [day, time] = date.split('T');

  return (
    <div>
      <h3 className="font-bold">You're almost done!</h3>
      <div className="mt-5 flex">
        <img src={image} alt="" className="w-32 h-18 rounded" />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex mt-3">
            <p className="mr-6">
              {format(new Date(day), 'ccc, LLL, d')}
              {convertToDisplayTime(time as Time)}
            </p>
            <p className="mr-6">7:30 PM</p>
            <p className="mr-6">
              {partySize}
              {partySize > 1 ? ' people' : ' person'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
