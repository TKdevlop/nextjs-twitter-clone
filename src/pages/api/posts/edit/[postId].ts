import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = await clientPromise;
  const { postId } = req.query;

  const post = await client
    .db("testdb")
    .collection("posts")
    .findOneAndUpdate(
      { _id: new ObjectId(postId as string) },
      {
        $set: {
          ...req.body,
        },
      },
      { returnDocument: "after" }
    );
  res.status(200).json(post);
}
