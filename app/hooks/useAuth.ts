import axios from 'axios';

const useAuth = () => {
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/signin',
        {
          email,
          password,
        }
      );

      console.clear();
      console.log('noticeMeNow', response);
    } catch (e) {
      console.error(e);
    }
  };
  const signUp = async () => {};

  return {
    signIn,
    signUp,
  };
};

export default useAuth;
