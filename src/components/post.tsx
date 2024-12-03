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
import EmojiPicker from "emoji-picker-react";
import { useAppContext } from "@/context/context";

const TweetInput = () => {
  const { initTweet } = useAppContext()!;

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeInput, setActiveInput] = useState<"topic" | "content" | null>(
    null
  );

  const postTweet = async () => {
    if (topic && content) {
      console.log("in postTweet below");
      await initTweet(topic, content);
      console.log("in postTweet above");

      setTopic("");
      setContent("");
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    if (activeInput === "topic") {
      setTopic((prev) => prev + emojiObject.emoji);
    } else if (activeInput === "content") {
      setContent((prev) => prev + emojiObject.emoji);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-black text-white rounded-lg space-y-2 ml-14">
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
            onFocus={() => setActiveInput("topic")}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (ex:- Technology, Sports)"
            className="bg-black text-white px-4 py-2 rounded-lg outline-none placeholder-gray-500"
          />
          {/* Content Input Field */}
          <input
            type="text"
            value={content}
            onFocus={() => setActiveInput("content")}
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
          <MdOutlineEmojiEmotions
            className="w-5 h-5 cursor-pointer"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          <MdOutlineLocationOn className="w-5 h-5 cursor-pointer" />
          {showEmojiPicker && (
            <div className="absolute bottom-10 right-0 bg-white rounded-lg shadow-lg z-50">
              <EmojiPicker
                onEmojiClick={handleEmojiClick} // Handle emoji click
                // theme="dark" // Optional: Matches dark mode
              />
            </div>
          )}
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
