import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return;
  }

  const { firstName, lastName, phone, city, email, password } = req.body;

  const validationSchema = [
    {
      valid: validator.isLength(firstName, { min: 2, max: 20 }),
      errorMessage: 'First name must be between 2 and 20 characters',
    },
    {
      valid: validator.isLength(lastName, { min: 2, max: 20 }),
      errorMessage: 'Last name must be between 2 and 20 characters',
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: 'Phone number must be a valid US phone number',
    },
    {
      valid: validator.isEmail(email),
      errorMessage: 'Email must be a valid email address',
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: 'Password must be strong',
    },
    {
      valid: validator.isLength(city, { min: 3, max: 20 }),
      errorMessage: 'City must be between 3 and 20 characters',
    },
  ];

  const errors: string[] = [];

  validationSchema.forEach((validation) => {
    if (!validation.valid) {
      errors.push(validation.errorMessage);
      return;
    }
  });

  if (errors.length > 0) {
    res.status(400).json({ errors });
  }

  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
  } catch (error) {
    res.status(408).json({ error });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
        city,
        email,
        password: hashedPassword,
      },
    });

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({
      email: user.email,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime('2h')
      .sign(secret);

    res.status(200).json({ token });
  } catch (error) {
    res.status(408).json({ error });
  }
}
