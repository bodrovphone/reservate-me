import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const errors: string[] = [];
  const { email, password } = req.body;

  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: 'Email must be a valid email address',
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: 'Password must be strong',
    },
  ];

  validationSchema.forEach((validation) => {
    if (!validation.valid) {
      errors.push(validation.errorMessage);
      return;
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  let userWithEmail;

  try {
    userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (e) {
    console.error('error', e);
  }

  if (!userWithEmail) {
    return res.status(401).json({ message: 'User not found' });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    userWithEmail.password
  );

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Password is incorrect' });
  }

  const alg = 'HS256';
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({
    email: userWithEmail.email,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime('2h')
    .sign(secret);

  res.status(200).json({ token });
}
