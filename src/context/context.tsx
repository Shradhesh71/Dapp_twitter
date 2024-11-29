// Initialized tweet
// Add_comment
// Remove_comment
// Add_likes
// Remove_likes

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { confirmTx, mockWallet } from "../utils/helper";
import { getProgram, getTweetAddress } from "@/utils/program";

export const AppContext = createContext({
  initTweet: async (topic: string, content: string) => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet()!;
  // console.log("Wallet PublicKey: ", wallet.publicKey);

  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet);
    }
  }, [connection, wallet])!;
  console.log("Program Methods: ", program.methods);

  // example of how to fetch data from the blockchain
  // const tweetAccount = async () => {
  //   const tweet = await program.account.tweet.fetch(
  //     "GUF6r6NrVZSPCz4bKykeT3mj8Xoe4SqtFtKP8tVF9s95"
  //   );
  //   console.log("Tweet Account: ", tweet);
    // @ts-ignore
    // console.log("Topic: ", tweet.topic);
    // @ts-ignore
    // console.log("Content: ", tweet.content);
  // };
  // tweetAccount();

  const initTweet = async (topic: string, content: string) => {
    console.log("Running initTweet...");
    try {
      const tweetAddress = await getTweetAddress(topic, wallet.publicKey);
      console.log("tweetAddress: ", tweetAddress);
      console.log("SystemProgram.programId: ", SystemProgram.programId);
      const txHash = await program.methods
        .initialize(topic, content)
        .accounts({
          tweet_authority: wallet.publicKey,
          tweet: tweetAddress,
          system_program: SystemProgram.programId,
        })
        .rpc();
      console.log("txHash: " + txHash);
      await confirmTx(txHash, connection);

      toast({
        title: "Initialized tweet",
        description: (
          <>
            Tweet has been posted successfully with txHash:
            <a href={txHash} target="_blank">
              {" "}
              TxLink
            </a>
          </>
        ),
      });
    } catch (err: any) {
      console.log("err.message in initTweet: ", err.message);
      console.log("err.message in initTweet: ", err);

      toast({
        title: "Initialized Failed",
        description: `Initalized failed with error: ${err.message}`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  

  return (
    <AppContext.Provider value={{ initTweet }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
