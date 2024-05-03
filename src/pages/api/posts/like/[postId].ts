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
  const oldPost = (await client
    .db("testdb")
    .collection("posts")
    .findOne({ _id: new ObjectId(postId as string) })) as any;
  const isPostLiked = oldPost.isLikedBy.includes(req.body.user);
  const post = await client
    .db("testdb")
    .collection("posts")
    .findOneAndUpdate(
      { _id: new ObjectId(postId as string) },
      {
        $set: {
          likeCount: isPostLiked
            ? oldPost.likeCount - 1
            : oldPost.likeCount + 1,
          isLikedBy: isPostLiked
            ? oldPost.isLikedBy.filter((user) => user !== req.body.user)
            : [...oldPost.isLikedBy, req.body.user],
        },
      },
      { returnDocument: "after" }
    );
  res.status(200).json(post);
}
