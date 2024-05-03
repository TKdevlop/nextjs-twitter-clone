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
  const post = await client
    .db("testdb")
    .collection("posts")
    .insertOne(req.body);
  res.status(200).json({ _id: post.insertedId, ...req.body });
}
