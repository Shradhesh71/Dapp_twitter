// src/components/WhatsHappening.tsx
"use client"

import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";

type TrendingTopic = {
  category: string;
  title: string;
  posts: number;
};

const trendingTopics: TrendingTopic[] = [
  { category: 'Trending in India', title: 'ARRESTED', posts: 131000 },
  { category: 'Politics · Trending', title: '#KanhaiyaKumar', posts: 3764 },
  { category: 'Entertainment · Trending', title: '#BBKingKaran', posts: 10900 },
];

const WhatsHappening = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const toggleMenu = (index: number) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  return (
    <div className="bg-black text-white p-4 rounded-lg border border-gray-700 w-full max-w-xs mb-10 shadow-md shadow-slate-300/50">
      <h2 className="text-xl font-semibold mb-4">What's happening</h2>

      {trendingTopics.map((topic, index) => (
        <div key={index} className="relative mb-4">
          {/* Topic Info */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">{topic.category}</p>
              <p className="font-bold text-white">{topic.title}</p>
              <p className="text-gray-400 text-sm">{topic.posts.toLocaleString()} posts</p>
            </div>
            {/* Ellipsis Button */}
            <button onClick={() => toggleMenu(index)} className="focus:outline-none">
              <BsThreeDots className="w-5 h-5 text-gray-400 hover:text-gray-200" />
            </button>
          </div>

          {/* Dropdown Menu */}
          {activeMenu === index && (
            <div className="absolute right-0 mt-2 w-60 bg-black  text-white rounded-lg shadow-2xl shadow-slate-300/40 p-2 z-10">
              <button className="flex items-center w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                <span className="mr-2">😕</span> Not interested in this
              </button>
              <button className="flex items-center w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                <span className="mr-2">⚠️</span> This trend is harmful or spammy
              </button>
            </div>
          )}
        </div>
      ))}

      <button className="text-blue-500 hover:underline mt-2 text-sm">Show more</button>
    </div>
  );
};

export default WhatsHappening;
