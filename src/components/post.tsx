// src/components/TweetInput.tsx
"use client";

import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import {
  MdGif,
  MdOutlineEmojiEmotions,
  MdOutlineLocationOn,
} from "react-icons/md";
import { CgPoll } from "react-icons/cg";
import { useAppContext } from "@/context/context";

const TweetInput = () => {
  const { initTweet } = useAppContext()!;

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  const postTweet = async () => {
    if (topic && content) {
      console.log("in postTweet below");
      await initTweet(topic, content);
      console.log("in postTweet above");

      setTopic("");
      setContent("");
    }
  };
  return (
    <div className="flex flex-col p-4 bg-black text-white rounded-lg space-y-2 ml-10">
      {/* Profile Picture and Input */}
      <div className="flex items-start space-x-3">
        {/* Profile Picture */}
        <img
          src="/assets/profile.png" // Replace with actual profile image URL
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div className="flex flex-col flex-grow space-y-2">
          {/* Topic Input */}
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., Technology, Sports)"
            className="bg-black text-white px-4 py-2 rounded-lg outline-none placeholder-gray-500"
          />
          {/* Content Input Field */}
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is happening?!"
            className="bg-black text-white px-4 py-2 rounded-lg outline-none text-xl placeholder-gray-500"
          />
        </div>
      </div>

      {/* Reply and Icon Options */}
      <div className="flex items-center justify-between border-t border-gray-700 pt-2">
        <span className="text-blue-500 text-sm cursor-pointer">
          Everyone can reply
        </span>

        {/* Icons */}
        <div className="flex space-x-4 text-blue-500">
          <CiCamera className="w-5 h-5 cursor-pointer" />
          <MdGif className="w-5 h-5 cursor-pointer" />
          <CgPoll className="w-5 h-5 cursor-pointer" />
          <MdOutlineEmojiEmotions className="w-5 h-5 cursor-pointer" />
          <MdOutlineLocationOn className="w-5 h-5 cursor-pointer" />
        </div>

        {/* Post Button */}
        <button
          onClick={postTweet}
          disabled={!topic || !content}
          className={`px-4 py-2 rounded-full ${
            topic && content
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-400 text-white cursor-not-allowed"
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default TweetInput;
