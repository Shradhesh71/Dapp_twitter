import { PublicKey } from "@solana/web3.js";

export const TOPIC_LENGTH: number = 32;
export const CONTENT_LENGTH: number = 500;
export const COMMENT_LENGTH: number = 500;

export const TWEET_SEED = "TWEET_SEED";
export const TWEET_REACTION_SEED = "TWEET_REACTION_SEED";
export const COMMENT_SEED = "COMMENT_SEED";

export const TWEET_LEN: number =
  32 + TOPIC_LENGTH + 1 + CONTENT_LENGTH + 8 + 8 + 1;
export const REACTION_LEN: number = 32 + 32 + 1 + 1;
export const COMMENT_LEN: number = 32 + 32 + COMMENT_LENGTH + 2 + 1;
export const IMAGE_LENGTH: number = 200; 

export enum ReactionType {
  Like,
  Dislike,
}

export const PROGRAM_ID = new PublicKey(
  "31utvwA13kZZaTWcDCcwT2S1H877uRfKGydvnaMFXy2J"
);
// 9bd7tiPQiPnU3BJoitePtsvyeeuh7imw4Y6X8LGwLUBo