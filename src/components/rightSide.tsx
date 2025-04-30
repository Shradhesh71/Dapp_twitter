// import WhatsHappening from "./WhatsHappening";
// import WhoToFollow from "./WhoToFollow";

// const tweets = [
//   { id: 1, username: "X Developers", handle: "shn25gsd" },
//   { id: 2, username: "RED Global", handle: "shradeshjain835" },
// ];

// export default function RightSide() {
//   return (
//     <div className="p-5">
//       <div>
//         <input
//           type="search"
//           className="rounded-full w-full mb-4 p-2 bg-gray-800"
//           placeholder="🔎  Search"
//         />
//         <WhatsHappening/>
//         <WhoToFollow suggestions={tweets} />
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SiSolana } from "react-icons/si";

const RightSide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connection } = useConnection();

  // Trending topics - this would come from your backend in a real app
  const trendingTopics = [
    { id: 1, name: "Solana", posts: "216K" },
    { id: 2, name: "Crypto", posts: "165K" },
    { id: 3, name: "Blockchain", posts: "112K" },
    { id: 4, name: "NFT", posts: "97K" },
    { id: 5, name: "DeFi", posts: "85K" },
  ];

  // Fetch SOL price - in a real app you'd use a price oracle or API
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // This is a mock price - in a real app you'd fetch from an API
        const mockPrice = 147.25 + (Math.random() * 5 - 2.5);
        setSolPrice(mockPrice);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch SOL price:", error);
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6 py-2 px-1">
      {/* Search Bar */}
      <div className="sticky top-2 z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-800 w-full pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* SOL Price Widget */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white">SOL Price</h2>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
            Devnet
          </span>
        </div>

        {isLoading ? (
          <div className="animate-pulse h-12 bg-gray-700 rounded"></div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {/* <img
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                alt="Solana Logo"
                className="w-8 h-8 mr-2"
              /> */}
              <SiSolana className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">
                ${solPrice ? solPrice.toFixed(2) : "N/A"}
              </span>
            </div>
            <span className="text-sm text-green-400">+4.3%</span>
          </div>
        )}
      </div>

      {/* Trending Topics */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h2 className="text-xl font-bold text-white mb-4">Trending Topics</h2>
        <div className="space-y-4">
          {trendingTopics.map((topic) => (
            <div
              key={topic.id}
              className="hover:bg-gray-700 p-2 rounded transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">#{topic.id}</span>
                <button className="text-gray-400 hover:text-white">•••</button>
              </div>
              <p className="font-semibold text-white">#{topic.name}</p>
              <p className="text-gray-400 text-sm">{topic.posts} posts</p>
            </div>
          ))}
        </div>
        <button className="text-blue-400 hover:text-blue-500 text-sm mt-4">
          Show more
        </button>
      </div>

      {/* Who to Follow */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h2 className="text-xl font-bold text-white mb-4">Who to Follow</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="flex items-center justify-between hover:bg-gray-700 p-2 rounded transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {String.fromCharCode(64 + id)}
                </div>
                <div>
                  <p className="font-semibold text-white">User{id}</p>
                  <p className="text-gray-400 text-sm">@user{id}</p>
                </div>
              </div>
              <button className="bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-opacity-90 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
        <button className="text-blue-400 hover:text-blue-500 text-sm mt-4">
          Show more
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Cookie Policy
          </a>
          <a href="#" className="hover:underline">
            Accessibility
          </a>
          <a href="#" className="hover:underline">
            Ads Info
          </a>
          <a href="#" className="hover:underline">
            More
          </a>
        </div>
        <p className="mt-2">© 2025 SolanaTwitter, Inc.</p>
      </div>
    </div>
  );
};

export default RightSide;
