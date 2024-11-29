import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "@/utils/constants";

type Comment = {
  id: string;
  author: string;
  content: string;
};

export const getComments = async (
  tweetId: string,
  connection: any
): Promise<Comment[]> => {
  try {
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 40, // Offset where `parent_tweet` starts in `Comment` struct
            bytes: tweetId, // TweetId as a base58 string
          },
        },
      ],
    });

    const comments = accounts.map((account: any) => {
      const data = account.account.data;

      // Extract fields based on your Comment struct
      const authorStart = 8; // `comment_author` starts at offset 0
      const authorEnd = 40; // PublicKey size is 32 bytes
      const parentTweetStart = authorEnd; // `parent_tweet` starts after `comment_author`
      const parentTweetEnd = parentTweetStart + 32; // PublicKey size is 32 bytes
      const contentStart = 72; // Content starts after `parent_tweet`
      const contentLength = 500; // Fixed content length in your struct
      const contentEnd = contentStart + contentLength;

      const commentAuthor = new PublicKey(
        data.slice(authorStart, authorEnd)
      ).toBase58();
      const contentRaw = Buffer.from(data.slice(contentStart, contentEnd));
      const content = contentRaw.toString("utf-8").replace(/\0/g, ""); // Remove null chars

      console.log({
        id: account.pubkey.toBase58(),
        author: commentAuthor,
        content: content.trim(),
      });
      return {
        id: account.pubkey.toBase58(),
        author: commentAuthor,
        content: content.trim(),
      };
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Unable to fetch comments");
  }
};
