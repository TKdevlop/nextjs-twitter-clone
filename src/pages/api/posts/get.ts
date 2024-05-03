import { clientPromise } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = await clientPromise;
  const posts = await client
    .db("testdb")
    .collection("posts")
    .find({})
    .skip(Number(req.query.skip || 0))
    .limit(Number(req.query.limit || 0))
    .toArray();
  const totalCount = await client
    .db("testdb")
    .collection("posts")
    .find({})
    .count();
  res.status(200).json({ posts, totalCount: totalCount });
}
