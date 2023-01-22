import { NextApiRequest, NextApiResponse } from "next/types";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function getServerSession({ req, res }: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const session = await unstable_getServerSession(req, res, authOptions);
  return session;
}
