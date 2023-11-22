import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get('authorization');

  if (!bearerToken) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const [_bearer, token] = bearerToken.split(' ');

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });

    //   res.status(401).json({ message: 'Unauthorized' });
  }

  const payload: any = jwt.decode(token);

  if (!payload?.email) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      city: true,
    },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
