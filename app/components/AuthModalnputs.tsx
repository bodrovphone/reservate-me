interface Props {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    city: string;
  };
  setInputs: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
      city: string;
    }>
  >;
  isSignedIn: boolean;
}

export default function AuthModalInputs({
  inputs,
  setInputs,
  isSignedIn,
}: Props) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {isSignedIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] bg-white"
            placeholder="Your name please"
            value={inputs.firstName}
            name="firstName"
            onChange={onChange}
          />

          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] bg-white"
            placeholder="Your last name please"
            value={inputs.lastName}
            name="lastName"
            onChange={onChange}
          />
        </div>
      )}

      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-full bg-white"
          placeholder="email"
          value={inputs.email}
          name="email"
          onChange={onChange}
        />
      </div>

      {isSignedIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] bg-white"
            placeholder="Phone"
            value={inputs.phone}
            name="phone"
            onChange={onChange}
          />

          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] bg-white"
            placeholder="City"
            name="city"
            value={inputs.city}
            onChange={onChange}
          />
        </div>
      )}

      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full bg-white"
          placeholder="Password"
          value={inputs.password}
          name="password"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
