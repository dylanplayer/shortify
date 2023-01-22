import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export async function createContext({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET as string});

  if (!token) return {};

  return { user: token.user };
}
