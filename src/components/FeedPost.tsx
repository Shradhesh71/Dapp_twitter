"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  getCommentAddress,
  getProgram,
  getTweetReaction,
} from "@/utils/program";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { mockWallet } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactionType, TWEET_LEN } from "@/utils/constants";

const PROGRAM_ID = new PublicKey(
  "31utvwA13kZZaTWcDCcwT2S1H877uRfKGydvnaMFXy2J"
);

type Tweet = {
  id: string; // The public key of the tweet account
  topic: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
};

const Feed: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const { connection } = useConnection();
  const wallet = useAnchorWallet()!;

  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet);
    }
  }, [connection, wallet])!;
  // Fetch tweets from the blockchain
  const fetchTweets = async () => {
    try {
      const accounts = await connection.getProgramAccounts(PROGRAM_ID);
      // accounts.forEach((account, index) => {
      //   console.log(
      //     `Account ${index} buffer size: `,
      //     account.account.data.length
      //   );
      //   console.log(
      //     `Account ${index} buffer size: `,
      //     account.account
      //   );
      // });
      const fetchedTweets = accounts
        .filter((account) => account.account.data.length === 590)
        .map((account) => {
          const data = account.account.data;
          const id = account.pubkey.toBase58();

          // Offsets based on the Rust struct layout
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
      setTweets(fetchedTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  // Handle Like Button Click
  const ReactionTweet = async (tweetId: string, Reaction: ReactionType) => {
    try {
      const tweet_reaction = await getTweetReaction(
        new PublicKey(tweetId),
        wallet.publicKey
      );
      console.log("Reaction: ", Reaction);
      if (Reaction == ReactionType.Like) {
        const tx = await program.methods
          .likeTweet()
          .accounts({
            tweet: new PublicKey(tweetId),
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
            tweet: new PublicKey(tweetId),
            tweet_reaction: tweet_reaction,
            reaction_author: wallet.publicKey,
            system_program: SystemProgram.programId,
          })
          .rpc();
        console.log("dislikes tweet, transaction hash:", tx);
      }

      await fetchTweets();
    } catch (err) {
      console.error("Error liking tweet:", err);
    }
  };

  // Real-Time Updates
  useEffect(() => {
    fetchTweets();

    const subscriptionId = connection.onProgramAccountChange(
      PROGRAM_ID,
      async () => {
        console.log("Account changed. Refetching tweets...");
        await fetchTweets();
      }
    );

    return () => {
      connection.removeProgramAccountChangeListener(subscriptionId);
    };
  }, []);

  return (
    <div className="bg-black text-white p-4 space-y-6 ml-12">
      {tweets.map((tweet) => (
        <Link href={`${tweet.author}/${tweet.id}`}>
          <div key={tweet.id} className="border-b border-gray-700 pb-4">
            {/* Tweet Header */}
            <div className="flex items-start space-x-3">
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-400">
                      {" "}
                      Author: {tweet.author.slice(0, 6)}...
                      {tweet.author.slice(-6)}
                    </span>
                  </div>
                </div>
                <h3 className="text-white mt-1 font-bold">
                  Topic: {tweet.topic}
                </h3>
                <p className="text-white mt-1">Content: {tweet.content}</p>
              </div>
            </div>
            <div className="mt-5">
              <Button variant="outline" className=" text-black">
                <Link
                  target="_blank"
                  href={`https://explorer.solana.com/address/${tweet.id}?cluster=devnet`}
                >
                  View on Explore
                </Link>{" "}
              </Button>
            </div>

            {/* Footer (Engagement Buttons) */}
            <div className="flex justify-around mt-3 text-gray-500">
              <button
                className="text-blue-500"
              >
                <Link href={`${tweet.author}/${tweet.id}`}>💬</Link>
              </button>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => ReactionTweet(tweet.id, ReactionType.Like)}
              >
                ❤️ Like ({tweet.likes})
              </button>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => ReactionTweet(tweet.id, ReactionType.Dislike)}
              >
                👎 dislikes ({tweet.dislikes})
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
