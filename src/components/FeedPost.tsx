// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { PublicKey, SystemProgram } from "@solana/web3.js";
// import {
//   getCommentAddress,
//   getProgram,
//   getTweetReaction,
// } from "@/utils/program";
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { mockWallet } from "@/utils/helper";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ReactionType, TWEET_LEN } from "@/utils/constants";

// const PROGRAM_ID = new PublicKey(
//   "31utvwA13kZZaTWcDCcwT2S1H877uRfKGydvnaMFXy2J"
// );

// type Tweet = {
//   id: string; // The public key of the tweet account
//   topic: string;
//   content: string;
//   author: string;
//   likes: number;
//   dislikes: number;
// };

// const Feed: React.FC = () => {
//   const [tweets, setTweets] = useState<Tweet[]>([]);
//   const { connection } = useConnection();
//   const wallet = useAnchorWallet()!;

//   const program = useMemo(() => {
//     if (connection) {
//       return getProgram(connection, wallet ?? mockWallet);
//     }
//   }, [connection, wallet])!;
//   // Fetch tweets from the blockchain
//   const fetchTweets = async () => {
//     try {
//       const accounts = await connection.getProgramAccounts(PROGRAM_ID);
//       // accounts.forEach((account, index) => {
//       //   console.log(
//       //     `Account ${index} buffer size: `,
//       //     account.account.data.length
//       //   );
//       //   console.log(
//       //     `Account ${index} buffer size: `,
//       //     account.account
//       //   );
//       // });
//       const fetchedTweets = accounts
//         .filter((account) => account.account.data.length === 590)
//         .map((account) => {
//           const data = account.account.data;
//           const id = account.pubkey.toBase58();

//           // Offsets based on the Rust struct layout
//           const authorStart = 8;
//           const authorEnd = 40; // PublicKey size is 32 bytes
//           const topicStart = authorEnd; // After author
//           const topicEnd = topicStart + 32; // Fixed topic length (32 bytes)
//           const topicLengthOffset = topicEnd; // 1 byte for topic_length
//           const contentStart = topicEnd + 1; // Content starts after topic length (1 byte)
//           const contentEnd = contentStart + 500; // Fixed content length
//           const likesOffset = contentEnd; // u64 for likes (8 bytes)
//           const dislikesOffset = likesOffset + 8; // u64 for dislikes
//           const bumpOffset = dislikesOffset + 8; // u8 for bump

//           // Extract data
//           const author = new PublicKey(
//             data.slice(authorStart, authorEnd)
//           ).toBase58();
//           const topicRaw = Buffer.from(data.slice(topicStart, topicEnd));
//           const topic = topicRaw.toString("utf-8").replace(/\0/g, "");

//           const contentRaw = Buffer.from(data.slice(contentStart, contentEnd));
//           const content = contentRaw.toString("utf-8").replace(/\0/g, "");

//           const likes = new DataView(data.buffer, likesOffset, 8).getBigUint64(
//             0,
//             true
//           ); // u64
//           const dislikes = new DataView(
//             data.buffer,
//             dislikesOffset,
//             8
//           ).getBigUint64(0, true); // u64

//           console.log({
//             id: id,
//             topic: topic.trim(),
//             content: content.trim(),
//             author: author,
//             likes: Number(likes),
//             dislikes: Number(dislikes),
//           });

//           // Return parsed tweet
//           return {
//             id: id,
//             topic: topic.trim(), // Trim any extra whitespace
//             content: content.trim(),
//             author: author,
//             likes: Number(likes),
//             dislikes: Number(dislikes),
//           };
//         });
//       setTweets(fetchedTweets);
//     } catch (error) {
//       console.error("Error fetching tweets:", error);
//     }
//   };

//   // Handle Like Button Click
//   const ReactionTweet = async (tweetId: string, Reaction: ReactionType) => {
//     try {
//       const tweet_reaction = await getTweetReaction(
//         new PublicKey(tweetId),
//         wallet.publicKey
//       );
//       console.log("Reaction: ", Reaction);
//       if (Reaction == ReactionType.Like) {
//         const tx = await program.methods
//           .likeTweet()
//           .accounts({
//             tweet: new PublicKey(tweetId),
//             tweet_reaction: tweet_reaction,
//             reaction_author: wallet.publicKey,
//             system_program: SystemProgram.programId,
//           })
//           .rpc();
//         console.log("Liked tweet, transaction hash:", tx);
//       } else {
//         const tx = await program.methods
//           .dislikeTweet()
//           .accounts({
//             tweet: new PublicKey(tweetId),
//             tweet_reaction: tweet_reaction,
//             reaction_author: wallet.publicKey,
//             system_program: SystemProgram.programId,
//           })
//           .rpc();
//         console.log("dislikes tweet, transaction hash:", tx);
//       }

//       await fetchTweets();
//     } catch (err) {
//       console.error("Error liking tweet:", err);
//     }
//   };

//   // Real-Time Updates
//   useEffect(() => {
//     fetchTweets();

//     const subscriptionId = connection.onProgramAccountChange(
//       PROGRAM_ID,
//       async () => {
//         console.log("Account changed. Refetching tweets...");
//         await fetchTweets();
//       }
//     );

//     return () => {
//       connection.removeProgramAccountChangeListener(subscriptionId);
//     };
//   }, []);

//   return (
//     <div className="bg-black text-white p-4 space-y-6 ml-12">
//       {tweets.map((tweet) => (
//         <Link href={`${tweet.author}/${tweet.id}`}>
//           <div key={tweet.id} className="border-b border-gray-700 pb-4">
//             {/* Tweet Header */}
//             <div className="flex items-start space-x-3">
//               <div className="flex-grow">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <span className="text-gray-400">
//                       {" "}
//                       Author: {tweet.author.slice(0, 6)}...
//                       {tweet.author.slice(-6)}
//                     </span>
//                   </div>
//                 </div>
//                 <h3 className="text-white mt-1 font-bold">
//                   Topic: {tweet.topic}
//                 </h3>
//                 <p className="text-white mt-1">Content: {tweet.content}</p>
//               </div>
//             </div>
//             <div className="mt-5">
//               <Button variant="outline" className=" text-black">
//                 <Link
//                   target="_blank"
//                   href={`https://explorer.solana.com/address/${tweet.id}?cluster=devnet`}
//                 >
//                   View on Explore
//                 </Link>{" "}
//               </Button>
//             </div>

//             {/* Footer (Engagement Buttons) */}
//             <div className="flex justify-around mt-3 text-gray-500">
//               <button
//                 className="text-blue-500"
//               >
//                 <Link href={`${tweet.author}/${tweet.id}`}>💬</Link>
//               </button>
//               <button
//                 className="text-blue-500 hover:underline"
//                 onClick={() => ReactionTweet(tweet.id, ReactionType.Like)}
//               >
//                 ❤️ Like ({tweet.likes})
//               </button>
//               <button
//                 className="text-blue-500 hover:underline"
//                 onClick={() => ReactionTweet(tweet.id, ReactionType.Dislike)}
//               >
//                 👎 dislikes ({tweet.dislikes})
//               </button>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default Feed;

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
import Link from "next/link";
import { IMAGE_LENGTH, ReactionType, TWEET_LEN } from "@/utils/constants";
import { CiHeart, CiChat1 } from "react-icons/ci";
import { FiThumbsDown, FiExternalLink } from "react-icons/fi";

const PROGRAM_ID = new PublicKey(
  "31utvwA13kZZaTWcDCcwT2S1H877uRfKGydvnaMFXy2J"
);

type Tweet = {
  id: string;
  topic: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
};

const Feed: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReactions, setActiveReactions] = useState<
    Record<string, ReactionType | null>
  >({});
  const { connection } = useConnection();
  const wallet = useAnchorWallet()!;

  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet);
    }
  }, [connection, wallet])!;

  // Fetch tweets from the blockchain
  const fetchTweets = async () => {
    setIsLoading(true);
    try {
      const accounts = await connection.getProgramAccounts(PROGRAM_ID);

      const fetchedTweets = accounts
        .filter((account: any) => account.account.data.length === 590)
        .map((account: any) => {
          const data = account.account.data;
          const id = account.pubkey.toBase58();
          console.log("Account Data: ", data); 

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
          const imageStart = bumpOffset + 1;
          const imageEnd = imageStart + IMAGE_LENGTH;

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

          const imageRaw = Buffer.from(data.slice(imageStart, imageEnd));
          let imageUrl = imageRaw.toString("utf-8").replace(/\0/g, "");
          // If it’s all zeros, then imageUrl === "". You can treat that as “no image.”
          if (imageUrl === "") {
            imageUrl = "null";
          }

          console.log({
            image: imageUrl,
          });

          // Return parsed tweet
          return {
            id: id,
            topic: topic.trim(),
            content: content.trim(),
            author: author,
            likes: Number(likes),
            dislikes: Number(dislikes),
            image: imageUrl,
          };
        });

      // Sort tweets with most interactions first
      fetchedTweets.sort(
        (a: any, b: any) => b.likes + b.dislikes - (a.likes + a.dislikes)
      );

      setTweets(fetchedTweets);

      // Check user's reactions to tweets
      if (wallet) {
        const reactionMap: Record<string, ReactionType | null> = {};
        for (const tweet of fetchedTweets) {
          try {
            const tweetReactionAddress = await getTweetReaction(
              new PublicKey(tweet.id),
              wallet.publicKey
            );

            // Here we would ideally fetch the account data to see what type of reaction,
            // but for now we'll just mark that a reaction exists
            reactionMap[tweet.id] = null;
          } catch (error) {
            reactionMap[tweet.id] = null;
          }
        }
        setActiveReactions(reactionMap);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Like Button Click
  const handleReaction = async (
    tweetId: string,
    reactionType: ReactionType
  ) => {
    if (!wallet) return;

    try {
      const tweet_reaction = await getTweetReaction(
        new PublicKey(tweetId),
        wallet.publicKey
      );

      if (reactionType === ReactionType.Like) {
        const tx = await program.methods
          .likeTweet()
          .accounts({
            tweet: new PublicKey(tweetId),
            tweet_reaction: tweet_reaction,
            reaction_author: wallet.publicKey,
            system_program: SystemProgram.programId,
          })
          .rpc();

        // Update local state to show like is active
        setActiveReactions((prev) => ({
          ...prev,
          [tweetId]: ReactionType.Like,
        }));

        // Update the tweet in local state
        setTweets((prev) =>
          prev.map((tweet) =>
            tweet.id === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet
          )
        );
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

        // Update local state to show dislike is active
        setActiveReactions((prev) => ({
          ...prev,
          [tweetId]: ReactionType.Dislike,
        }));

        // Update the tweet in local state
        setTweets((prev) =>
          prev.map((tweet) =>
            tweet.id === tweetId
              ? { ...tweet, dislikes: tweet.dislikes + 1 }
              : tweet
          )
        );
      }
    } catch (err) {
      console.error(
        `Error ${
          reactionType === ReactionType.Like ? "liking" : "disliking"
        } tweet:`,
        err
      );
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
  }, [wallet?.publicKey?.toString()]);

  // Format author address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Get random time for demo purposes
  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    return `${hours}h ago`;
  };

  if (isLoading) {
    return (
      <div className="my-8 flex justify-center">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tweets.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-500 mb-4">No posts yet</div>
          <p className="text-gray-400">Be the first to post something!</p>
        </div>
      ) : (
        tweets.map((tweet) => (
          <div
            key={tweet.id}
            className="p-4 border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
          >
            <Link href={`${tweet.author}/${tweet.id}`} className="block">
              <div className="flex space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500">
                    {/* First letter of address as avatar */}
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {tweet.author.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Author and timestamp */}
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-white truncate">
                      {formatAddress(tweet.author)}
                    </span>
                    <span className="text-gray-500 mx-1">·</span>
                    <span className="text-gray-500">{getRandomTime()}</span>
                  </div>

                  {/* Topic */}
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                      {tweet.topic}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="mt-2 text-white whitespace-pre-wrap break-words">
                    {tweet.content}
                  </p>

                  {/* Footer with action buttons */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-6">
                      {/* Comment button */}
                      <button className="group flex items-center text-gray-500 hover:text-blue-400">
                        <div className="p-1.5 rounded-full group-hover:bg-blue-400/10">
                          <CiChat1 className="w-5 h-5" />
                        </div>
                        <span className="text-xs ml-1">Comment</span>
                      </button>

                      {/* Like button */}
                      <button
                        className={`group flex items-center ${
                          activeReactions[tweet.id] === ReactionType.Like
                            ? "text-pink-500"
                            : "text-gray-500 hover:text-pink-500"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReaction(tweet.id, ReactionType.Like);
                        }}
                      >
                        <div
                          className={`p-1.5 rounded-full ${
                            activeReactions[tweet.id] === ReactionType.Like
                              ? "bg-pink-500/10"
                              : "group-hover:bg-pink-500/10"
                          }`}
                        >
                          <CiHeart
                            className={`w-5 h-5 ${
                              activeReactions[tweet.id] === ReactionType.Like
                                ? "fill-pink-500"
                                : ""
                            }`}
                          />
                        </div>
                        <span className="text-xs ml-1">
                          {tweet.likes || ""}
                        </span>
                      </button>

                      {/* Dislike button */}
                      <button
                        className={`group flex items-center ${
                          activeReactions[tweet.id] === ReactionType.Dislike
                            ? "text-red-500"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReaction(tweet.id, ReactionType.Dislike);
                        }}
                      >
                        <div
                          className={`p-1.5 rounded-full ${
                            activeReactions[tweet.id] === ReactionType.Dislike
                              ? "bg-red-500/10"
                              : "group-hover:bg-red-500/10"
                          }`}
                        >
                          <FiThumbsDown className="w-5 h-5" />
                        </div>
                        <span className="text-xs ml-1">
                          {tweet.dislikes || ""}
                        </span>
                      </button>
                    </div>

                    {/* Solana Explorer Link */}
                    <Link
                      href={`https://explorer.solana.com/address/${tweet.id}?cluster=devnet`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-500 hover:text-blue-400 p-1.5 rounded-full hover:bg-blue-400/10"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
