import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function LinkHandler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  const link = await prisma.link.findUnique({
    where: {
      slug: slug as string,
    },
  });

  if (link) {
    res.redirect(link.url);
  } else {
    res.status(404).redirect("/");
  }
}
