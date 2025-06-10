// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useParams } from "next/navigation";
// import {
//   getCommentAddress,
//   getProgram,
//   getTweetReaction,
// } from "@/utils/program";
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { mockWallet } from "@/utils/helper";
// import { PROGRAM_ID, ReactionType } from "@/utils/constants";
// import { PublicKey, SystemProgram } from "@solana/web3.js";
// import Link from "next/link";
// import { getComments } from "@/utils/getcomments";

// type Tweet = {
//   id: string;
//   topic: string;
//   content: string;
//   author: string;
//   likes: number;
//   dislikes: number;
// };
// type Comment = {
//   id: string;
//   author: string;
//   content: string;
// };

// const TweetDetail = () => {
//   const { AuthorId, TweetId } = useParams() ?? { AuthorId: "", TweetId: "" };

//   const [tweet, setTweet] = useState<Tweet[]>([]);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { connection } = useConnection();
//   const wallet = useAnchorWallet()!;

//   const program = useMemo(() => {
//     if (connection) {
//       return getProgram(connection, wallet ?? mockWallet);
//     }
//   }, [connection, wallet])!;

//   useEffect(() => {
//     if (TweetId) {
//       fetchTweet();
//       fetchComments();
//     }
//   }, [TweetId]);

//   const fetchTweet = async () => {
//     try {
//       const accounts = await connection.getProgramAccounts(PROGRAM_ID);
//       const fetchedTweets = accounts
//         .filter(
//           (account) =>
//             account.account.data.length === 590 &&
//             account.pubkey.toBase58() === TweetId
//         )
//         .map((account) => {
//           const data = account.account.data;
//           const id = account.pubkey.toBase58();

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
//       setTweet(fetchedTweets);
//     } catch (error) {
//       console.error("Error fetching tweets:", error);
//     }
//   };

//   const ReactionTweet = async (Reaction: ReactionType) => {
//     try {
//       const tweet_reaction = await getTweetReaction(
//         new PublicKey(TweetId!),
//         wallet.publicKey
//       );
//       console.log("Reaction: ", Reaction);
//       if (Reaction == ReactionType.Like) {
//         const tx = await program.methods
//           .likeTweet()
//           .accounts({
//             tweet: new PublicKey(TweetId!),
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
//             tweet: new PublicKey(TweetId!),
//             tweet_reaction: tweet_reaction,
//             reaction_author: wallet.publicKey,
//             system_program: SystemProgram.programId,
//           })
//           .rpc();
//         console.log("dislikes tweet, transaction hash:", tx);
//       }

//       await fetchTweet();
//     } catch (err) {
//       console.error("Error liking tweet:", err);
//     }
//   };

//   const fetchComments = async () => {
//     try {
//       const fetchedComments = await getComments(
//         TweetId!.toString(),
//         connection
//       );
//       console.log("fetchedComments: ", fetchedComments);
//       setComments(fetchedComments);
//     } catch (err) {
//       console.error("Error fetching comments:", err);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;
//     setLoading(true);
//     try {
//       console.log("tweet[0]?.id: " + tweet[0]?.id);
//       await AddComment(tweet[0]?.id, newComment);
//       // setNewComment("");
//       // fetchComments(); // Refresh comments after adding
//     } catch (err) {
//       console.log("Error adding comment:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const AddComment = async (tweetId: string, comment_content: string) => {
//     try {
//       const commentAddress = await getCommentAddress(
//         wallet.publicKey,
//         new PublicKey(tweetId),
//         comment_content
//       );
//       console.log("commentAddress: " + commentAddress);
//       console.log("commentContent: " + comment_content);

//       try {
//         const tx = await program.methods
//           .commentTweet(comment_content)
//           .accounts({
//             comment_author: wallet.publicKey,
//             comment: commentAddress,
//             tweet: new PublicKey(tweetId),
//             system_program: SystemProgram.programId,
//           })
//           .rpc();
//         console.log("Commented on tweet, transaction hash:", tx);
//       } catch (err) {
//         console.log("Error AddComment 1 tweet:", err);
//       }
//     } catch (err) {
//       console.log("Error AddComment 2 tweet:", err);
//     }
//   };

//   if (!tweet) return <p>Loading tweet...</p>;

//   return (
//     <div className="bg-black text-white p-6 min-h-screen">
//       <div className="border-b border-gray-700 pb-4">
//         {/* Tweet Header */}
//         <div className="flex items-start space-x-3">
//           <div className="flex-grow">
//             <div className="flex justify-between items-center">
//               <div>
//                 <span className="text-gray-400">
//                   {" "}
//                   Author: {tweet[0]?.author.slice(0, 6)}...
//                   {tweet[0]?.author.slice(-6)}
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-white mt-1 font-bold">
//               Topic: {tweet[0]?.topic}
//             </h3>
//             <p className="text-white mt-1">Content: {tweet[0]?.content}</p>
//           </div>
//         </div>
//         <div className="mt-5">
//           <Button variant="outline" className=" text-black">
//             <Link
//               target="_blank"
//               href={`https://explorer.solana.com/address/${tweet[0]?.id}?cluster=devnet`}
//             >
//               View on Explore
//             </Link>{" "}
//           </Button>
//         </div>

//         {/* Footer (Engagement Buttons) */}
//         <div className="flex justify-around mt-3 text-gray-500">
//           <button
//             className="text-blue-500 hover:underline"
//             onClick={() => ReactionTweet(ReactionType.Like)}
//           >
//             ❤️ Like ({tweet[0]?.likes})
//           </button>
//           <button
//             className="text-blue-500 hover:underline"
//             onClick={() => ReactionTweet(ReactionType.Dislike)}
//           >
//             👎 dislikes ({tweet[0]?.dislikes})
//           </button>
//           <div className="text-gray-400">📝 Comments: {comments.length}</div>
//         </div>
//       </div>

//       {/* Comments Section */}
//       <div className="mt-6">
//         <h2 className="text-lg font-bold">Comments</h2>

//         {/* Add Comment */}
//         <div className="mt-4">
//           <Textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Add your comment..."
//             className="w-full mb-2"
//           />
//           <Button
//             onClick={handleAddComment}
//             disabled={loading}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             {loading ? "Adding Comment..." : "Add Comment"}
//           </Button>
//         </div>
//       </div>
//       <div className="mt-4 space-y-4">
//         {comments.length > 0 ? (
//           comments.map((comment) => (
//             <div
//               key={comment.id}
//               className="p-4 border border-gray-700 rounded-lg"
//             >
//               <p className="text-gray-400">
//                 Author: {comment.author.slice(0, 6)}...
//                 {comment.author.slice(-6)}
//               </p>
//               <p className="mt-2">{comment.content}</p>
//             </div>
//           ))
//         ) : (
//           <p>No comments yet. Be the first to comment!</p>
//         )}
//       </div>
//     </div>
//     // </div>
//   );
// };

// export default TweetDetail;

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import {
  getCommentAddress,
  getProgram,
  getTweetReaction,
} from "@/utils/program";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { mockWallet } from "@/utils/helper";
import { ReactionType } from "@/utils/constants";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import Link from "next/link";
import { getComments } from "@/utils/getcomments";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  ExternalLink,
  User,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

const PROGRAM_ID = new PublicKey(
  "31utvwA13kZZaTWcDCcwT2S1H877uRfKGydvnaMFXy2J"
);

const TweetDetail = () => {
  const { AuthorId, TweetId } = useParams() ?? { AuthorId: "", TweetId: "" };

  const [tweet, setTweet] = useState<Tweet[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const { connection } = useConnection();
  const wallet = useAnchorWallet()!;

  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet);
    }
  }, [connection, wallet])!;

  // Parse content to extract image and text
  const parseContentWithImage = (content: string) => {
    const sjdecxMatch = content.match(/SJDECX:([^\s]+)/);
    if (sjdecxMatch) {
      const imageUrl = sjdecxMatch[1];
      const textContent = content.replace(/SJDECX:[^\s]+\s?/, "").trim();
      return { textContent, imageUrl };
    }
    return { textContent: content, imageUrl: null };
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

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
          const authorEnd = 40;
          const topicStart = authorEnd;
          const topicEnd = topicStart + 32;
          const topicLengthOffset = topicEnd;
          const contentStart = topicEnd + 1;
          const contentEnd = contentStart + 500;
          const likesOffset = contentEnd;
          const dislikesOffset = likesOffset + 8;
          const bumpOffset = dislikesOffset + 8;

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
          );
          const dislikes = new DataView(
            data.buffer,
            dislikesOffset,
            8
          ).getBigUint64(0, true);

          return {
            id: id,
            topic: topic.trim(),
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

  const ReactionTweet = async (reactionType: ReactionType) => {
    if (!wallet || !wallet.publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before doing anything.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Reaction Type: ", TweetId);
      const tweet_reaction = await getTweetReaction(
        new PublicKey(TweetId!),
        wallet.publicKey
      );

      if (reactionType === ReactionType.Like) {
        const tx = await program.methods
          .likeTweet()
          .accounts({
            tweet: new PublicKey(TweetId!),
            tweet_reaction: tweet_reaction,
            reaction_author: wallet.publicKey,
            system_program: SystemProgram.programId,
          })
          .rpc();
        setIsLiked(true);
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

        setIsDisliked(true);
      }
    } catch (err) {
      console.error(
        `Error ${
          reactionType === ReactionType.Like ? "liking" : "disliking"
        } tweet:`,
        err
      );
      console.log(
        `Error ${
          reactionType === ReactionType.Like ? "liking" : "disliking"
        } tweet:`,
        err
      );
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
    if (!wallet || !wallet.publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before doing anything.",
        variant: "destructive",
      });
      return;
    }
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await AddComment(tweet[0]?.id, newComment);
      setNewComment("");
      fetchComments();
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
    } catch (err) {
      console.log("Error adding comment:", err);
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
      console.log("Error adding comment:", err);
    }
  };

  if (!tweet.length)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-white text-lg">Loading tweet...</p>
        </div>
      </div>
    );

  const currentTweet = tweet[0];
  const { textContent, imageUrl } = parseContentWithImage(
    currentTweet?.content
  );

  const handleShare = async (
    author: string,
    tweetId: string,
    topic: string
  ) => {
    const shareData = {
      title: topic,
      text: `Check out this tweet on DECX: ${topic}!\nAuthor: ${author}.`,
      url:
        typeof window !== "undefined"
          ? `${window.location.href}/${author}/${tweetId}`
          : "",
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        // Optionally handle error
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(shareData.url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="text-white hover:bg-gray-900 p-2 rounded-full transition-colors"
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-white">Post</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Main Tweet */}
        <article className="bg-black border-b border-gray-800 px-4 py-6">
          {/* Author Info */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-lg truncate">
                  {formatAddress(currentTweet?.author)}
                </h3>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-500 text-sm">DEC X</span>
              </div>
              <p className="text-gray-500 text-sm">
                @{formatAddress(currentTweet?.author)}
              </p>
            </div>
          </div>

          {/* Topic Badge */}
          {currentTweet?.topic && (
            <div className="mb-4">
              <span className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                #{currentTweet.topic}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            <p className="text-white text-xl leading-relaxed whitespace-pre-wrap">
              {textContent}
            </p>

            {/* Image */}
            {imageUrl && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-gray-800">
                <img
                  src={imageUrl}
                  alt="Tweet image"
                  className="w-full h-auto object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  onLoadStart={() => setImageLoading(true)}
                />
                {imageLoading && (
                  <div className="flex items-center justify-center h-64 bg-gray-900">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp & Explorer Link */}
          <div className="flex items-center justify-between mb-6 text-gray-500 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Just now</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>
                  {formatNumber(
                    currentTweet?.likes + currentTweet?.dislikes + 47
                  )}{" "}
                  views
                </span>
              </div>
            </div>
            <Link
              href={`https://explorer.solana.com/address/${currentTweet?.id}?cluster=devnet`}
              target="_blank"
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </Link>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center space-x-6 mb-4 pb-4 border-b border-gray-800">
            <div className="text-white">
              <span className="font-bold">
                {formatNumber(currentTweet?.likes)}
              </span>
              <span className="text-gray-500 ml-1">Likes</span>
            </div>
            <div className="text-white">
              <span className="font-bold">
                {formatNumber(currentTweet?.dislikes)}
              </span>
              <span className="text-gray-500 ml-1">Dislikes</span>
            </div>
            <div className="text-white">
              <span className="font-bold">{formatNumber(comments.length)}</span>
              <span className="text-gray-500 ml-1">Comments</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-around py-2">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-400/10 group">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">
                {formatNumber(comments.length)}
              </span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-400 transition-colors p-2 rounded-full hover:bg-green-400/10 group">
              <Repeat2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">0</span>
            </button>

            <button
              onClick={() => ReactionTweet(ReactionType.Like)}
              className={`flex items-center space-x-2 transition-colors p-2 rounded-full group ${
                isLiked
                  ? "text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  : "text-gray-500 hover:text-red-400 hover:bg-red-400/10"
              }`}
            >
              <Heart
                className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  isLiked ? "fill-current" : ""
                }`}
              />
              <span className="text-sm font-medium">
                {formatNumber(currentTweet?.likes)}
              </span>
            </button>

            <button
              onClick={() => ReactionTweet(ReactionType.Dislike)}
              className={`flex items-center space-x-2 transition-colors p-2 rounded-full group ${
                isDisliked
                  ? "text-orange-500 hover:text-orange-400 hover:bg-orange-500/10"
                  : "text-gray-500 hover:text-orange-400 hover:bg-orange-400/10"
              }`}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                👎
              </span>
              <span className="text-sm font-medium">
                {formatNumber(currentTweet?.dislikes)}
              </span>
            </button>

            <button
              onClick={() =>
                handleShare(
                  currentTweet.author,
                  currentTweet.id,
                  currentTweet.topic
                )
              }
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-400/10 group"
            >
              <Share className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </article>

        {/* Add Comment Section */}
        <div className="border-b border-gray-800 px-4 py-6">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post your reply"
                className="w-full bg-transparent border-none text-xl text-white placeholder-gray-500 resize-none focus:outline-none min-h-[100px]"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-blue-400">
                  <button className="hover:bg-blue-400/10 p-2 rounded-full transition-colors">
                    📷
                  </button>
                  <button className="hover:bg-blue-400/10 p-2 rounded-full transition-colors">
                    📊
                  </button>
                  <button className="hover:bg-blue-400/10 p-2 rounded-full transition-colors">
                    😊
                  </button>
                </div>
                <Button
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-full font-bold transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Reply"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="divide-y divide-gray-800">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <article
                key={comment.id}
                className="px-4 py-6 hover:bg-gray-950/50 transition-colors"
              >
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-white">
                        {formatAddress(comment.author)}
                      </h4>
                      <span className="text-gray-500 text-sm">
                        @{formatAddress(comment.author)}
                      </span>
                      <span className="text-gray-500 text-sm">·</span>
                      <span className="text-gray-500 text-sm">now</span>
                    </div>
                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center justify-between mt-3 max-w-md">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-blue-400/10 group">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-400 transition-colors p-1 rounded-full hover:bg-green-400/10 group">
                        <Repeat2 className="w-4 h-4" />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-400/10 group">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-blue-400/10 group">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No replies yet
              </h3>
              <p className="text-gray-500">Be the first to reply!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetDetail;
