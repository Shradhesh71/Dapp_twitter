"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import {
  getCommentAddress,
  getProgram,
  getTweetReaction,
} from "@/utils/program";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { mockWallet } from "@/utils/helper";
import { PROGRAM_ID, ReactionType } from "@/utils/constants";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import Link from "next/link";
import { getComments } from "@/utils/getcomments";

type Tweet = {
  id: string;
  topic: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
};
type Comment = {
  id: string;
  author: string;
  content: string;
};

const TweetDetail = () => {
  const { AuthorId, TweetId } = useParams() ?? { AuthorId: "", TweetId: "" };

  const [tweet, setTweet] = useState<Tweet[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const wallet = useAnchorWallet()!;

  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet);
    }
  }, [connection, wallet])!;

  useEffect(() => {
    if (TweetId) {
      fetchTweet();
      fetchComments();
    }
  }, [TweetId]);

  const fetchTweet = async () => {
    try {
      const accounts = await connection.getProgramAccounts(PROGRAM_ID);
      const fetchedTweets = accounts
        .filter(
          (account) =>
            account.account.data.length === 590 &&
            account.pubkey.toBase58() === TweetId
        )
        .map((account) => {
          const data = account.account.data;
          const id = account.pubkey.toBase58();

          const authorStart = 8;
          const authorEnd = 40; // PublicKey size is 32 bytes
          const topicStart = authorEnd; // After author
          const topicEnd = topicStart + 32; // Fixed topic length (32 bytes)
          const topicLengthOffset = topicEnd; // 1 byte for topic_length
          const contentStart = topicEnd + 1; // Content starts after topic length (1 byte)
          const contentEnd = contentStart + 500; // Fixed content length
          const likesOffset = contentEnd; // u64 for likes (8 bytes)
          const dislikesOffset = likesOffset + 8; // u64 for dislikes
          const bumpOffset = dislikesOffset + 8; // u8 for bump

          // Extract data
          const author = new PublicKey(
            data.slice(authorStart, authorEnd)
          ).toBase58();
          const topicRaw = Buffer.from(data.slice(topicStart, topicEnd));
          const topic = topicRaw.toString("utf-8").replace(/\0/g, "");

          const contentRaw = Buffer.from(data.slice(contentStart, contentEnd));
          const content = contentRaw.toString("utf-8").replace(/\0/g, "");

          const likes = new DataView(data.buffer, likesOffset, 8).getBigUint64(
            0,
            true
          ); // u64
          const dislikes = new DataView(
            data.buffer,
            dislikesOffset,
            8
          ).getBigUint64(0, true); // u64

          console.log({
            id: id,
            topic: topic.trim(),
            content: content.trim(),
            author: author,
            likes: Number(likes),
            dislikes: Number(dislikes),
          });

          // Return parsed tweet
          return {
            id: id,
            topic: topic.trim(), // Trim any extra whitespace
            content: content.trim(),
            author: author,
            likes: Number(likes),
            dislikes: Number(dislikes),
          };
        });
      setTweet(fetchedTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  const ReactionTweet = async (Reaction: ReactionType) => {
    try {
      const tweet_reaction = await getTweetReaction(
        new PublicKey(TweetId!),
        wallet.publicKey
      );
      console.log("Reaction: ", Reaction);
      if (Reaction == ReactionType.Like) {
        const tx = await program.methods
          .likeTweet()
          .accounts({
            tweet: new PublicKey(TweetId!),
            tweet_reaction: tweet_reaction,
            reaction_author: wallet.publicKey,
            system_program: SystemProgram.programId,
          })
          .rpc();
        console.log("Liked tweet, transaction hash:", tx);
      } else {
        const tx = await program.methods
          .dislikeTweet()
          .accounts({
            tweet: new PublicKey(TweetId!),
            tweet_reaction: tweet_reaction,
            reaction_author: wallet.publicKey,
            system_program: SystemProgram.programId,
          })
          .rpc();
        console.log("dislikes tweet, transaction hash:", tx);
      }

      await fetchTweet();
    } catch (err) {
      console.error("Error liking tweet:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(
        TweetId!.toString(),
        connection
      );
      setComments(fetchedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await AddComment(tweet[0]?.id, newComment);
      setNewComment("");
      fetchComments(); // Refresh comments after adding
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };
  const AddComment = async (tweetId: string, comment_content: string) => {
    try {
      const commentAddress = await getCommentAddress(
        wallet.publicKey,
        new PublicKey(tweetId),
        comment_content
      );
      const tx = await program.methods
        .commentTweet(comment_content)
        .accounts({
          comment_author: wallet.publicKey,
          comment: commentAddress,
          tweet: new PublicKey(tweetId),
          system_program: SystemProgram.programId,
        })
        .rpc();
      console.log("Commented on tweet, transaction hash:", tx);
    } catch (err) {
      console.error("Error AddComment tweet:", err);
    }
  };

  if (!tweet) return <p>Loading tweet...</p>;

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="border-b border-gray-700 pb-4">
        {/* Tweet Header */}
        <div className="flex items-start space-x-3">
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400">
                  {" "}
                  Author: {tweet[0]?.author.slice(0, 6)}...
                  {tweet[0]?.author.slice(-6)}
                </span>
              </div>
            </div>
            <h3 className="text-white mt-1 font-bold">
              Topic: {tweet[0]?.topic}
            </h3>
            <p className="text-white mt-1">Content: {tweet[0]?.content}</p>
          </div>
        </div>
        <div className="mt-5">
          <Button variant="outline" className=" text-black">
            <Link
              target="_blank"
              href={`https://explorer.solana.com/address/${tweet[0]?.id}?cluster=devnet`}
            >
              View on Explore
            </Link>{" "}
          </Button>
        </div>

        {/* Footer (Engagement Buttons) */}
        <div className="flex justify-around mt-3 text-gray-500">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => ReactionTweet(ReactionType.Like)}
          >
            ❤️ Like ({tweet[0]?.likes})
          </button>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => ReactionTweet(ReactionType.Dislike)}
          >
            👎 dislikes ({tweet[0]?.dislikes})
          </button>
          <div className="text-gray-400">
            📝 Comments: {comments.length}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-lg font-bold">Comments</h2>

        {/* Add Comment */}
        <div className="mt-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            className="w-full mb-2"
          />
          <Button
            onClick={handleAddComment}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Adding Comment..." : "Add Comment"}
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-gray-700 rounded-lg"
            >
              <p className="text-gray-400">
                Author: {comment.author.slice(0, 6)}...
                {comment.author.slice(-6)}
              </p>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
    // </div>
  );
};

export default TweetDetail;
// import React from "react";
// type Paramms = {
//   TweetId: string;
// };

// const TweetDetail = (params: Paramms) => {
//   const { AuthorId, TweetId } = useParams();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-semibold text-gray-800">Dynamic Page</h1>
//         <p className="mt-4 text-gray-600">
//           <strong>Author ID:</strong> {AuthorId}
//         </p>
//         <p className="mt-2 text-gray-600">
//           <strong>Tweet ID:</strong> {TweetId}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TweetDetail;
