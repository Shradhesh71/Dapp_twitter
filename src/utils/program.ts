import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import crypto from "crypto";

import IDL from "./idl.json";
import {
  TWEET_SEED,
  PROGRAM_ID,
  TWEET_REACTION_SEED,
  COMMENT_SEED,
} from "./constants";

// How to fetch our Program
export const getProgram = (connection: any, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  // console.log("IDL Loaded:", IDL);
  const program = new Program(IDL as any, PROGRAM_ID, provider);
  return program;
};

export const getTweetAddress = async (
  topic: string,
  tweet_authority: PublicKey
) => {
  try {
    return (
      await PublicKey.findProgramAddress(
        [
          Buffer.from(topic),
          Buffer.from(TWEET_SEED),
          tweet_authority.toBuffer(),
        ],
        PROGRAM_ID
      )
    )[0];
  } catch (err: any) {
    console.error("Error in getTweetAddress: ", err.message);
    throw err; // Re-throw to handle it in initTweet
  }
};

export const getTweetReaction = async (
  tweetKey: PublicKey,
  reaction_author: PublicKey
) => {
  try {
    return (
      await PublicKey.findProgramAddress(
        [
          Buffer.from(TWEET_REACTION_SEED),
          reaction_author.toBuffer(),
          tweetKey.toBuffer(),
        ],
        PROGRAM_ID
      )
    )[0];
  } catch (err: any) {
    console.error("Error in getTweetAddress: ", err.message);
    throw err; // Re-throw to handle it in getTweetReaction
  }
};

export const getCommentAddress = async (
  comment_author: PublicKey,
  parentTweetKey: PublicKey,
  comment_content: string
) => {
  try {
    let hexString = crypto
      .createHash("sha256")
      .update(comment_content, "utf-8")
      .digest("hex");
    let content_seed = Uint8Array.from(Buffer.from(hexString, "hex"));
    return (
       PublicKey.findProgramAddressSync(
        [
          Buffer.from(COMMENT_SEED),
          comment_author.toBuffer(),
          content_seed,
          parentTweetKey.toBuffer(),
        ],
        PROGRAM_ID
      )
    )[0];
  } catch (err: any) {
    console.error("Error in getTweetAddress: ", err.message);
    throw err; 
  }
};

// Return the lastTicket ID and multiply the ticket price and convert LAMPORTS PER SOL and convert it to String
// export const getTotalPrize = (lottery: any) => {
//   return new BN(lottery.lastTicketId)
//     .mul(lottery.ticketPrice)
//     .div(new BN(LAMPORTS_PER_SOL))
//     .toString();
// };
