// // src/components/TweetInput.tsx
// "use client";

// import React, { useState } from "react";
// import { CiCamera } from "react-icons/ci";
// import {
//   MdGif,
//   MdOutlineEmojiEmotions,
//   MdOutlineLocationOn,
// } from "react-icons/md";
// import { CgPoll } from "react-icons/cg";
// import EmojiPicker from "emoji-picker-react";
// import { useAppContext } from "@/context/context";

// const TweetInput = () => {
//   const { initTweet } = useAppContext()!;

//   const [topic, setTopic] = useState("");
//   const [content, setContent] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [activeInput, setActiveInput] = useState<"topic" | "content" | null>(
//     null
//   );

//   const postTweet = async () => {
//     if (topic && content) {
//       console.log("in postTweet below");
//       await initTweet(topic, content);
//       console.log("in postTweet above");

//       setTopic("");
//       setContent("");
//     }
//   };

//   const handleEmojiClick = (emojiObject: { emoji: string }) => {
//     if (activeInput === "topic") {
//       setTopic((prev) => prev + emojiObject.emoji);
//     } else if (activeInput === "content") {
//       setContent((prev) => prev + emojiObject.emoji);
//     }
//   };

//   return (
//     <div className="flex flex-col p-4 bg-black text-white rounded-lg space-y-2 ml-14">
//       {/* Profile Picture and Input */}
//       <div className="flex items-start space-x-3">
//         {/* Profile Picture */}
//         <img
//           src="/assets/profile.png" // Replace with actual profile image URL
//           alt="Profile"
//           className="w-20 h-20 rounded-full"
//         />
//         <div className="flex flex-col flex-grow space-y-2">
//           {/* Topic Input */}
//           <input
//             type="text"
//             value={topic}
//             onFocus={() => setActiveInput("topic")}
//             onChange={(e) => setTopic(e.target.value)}
//             placeholder="Enter topic (ex:- Technology, Sports)"
//             className="bg-black text-white px-4 py-2 rounded-lg outline-none placeholder-gray-500"
//           />
//           {/* Content Input Field */}
//           <input
//             type="text"
//             value={content}
//             onFocus={() => setActiveInput("content")}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="What is happening?!"
//             className="bg-black text-white px-4 py-2 rounded-lg outline-none text-xl placeholder-gray-500"
//           />
//         </div>
//       </div>

//       {/* Reply and Icon Options */}
//       <div className="flex items-center justify-between border-t border-gray-700 pt-2">
//         <span className="text-blue-500 text-sm cursor-pointer">
//           Everyone can reply
//         </span>

//         {/* Icons */}
//         <div className="flex space-x-4 text-blue-500">
//           <CiCamera className="w-5 h-5 cursor-pointer" />
//           <MdGif className="w-5 h-5 cursor-pointer" />
//           <CgPoll className="w-5 h-5 cursor-pointer" />
//           <MdOutlineEmojiEmotions
//             className="w-5 h-5 cursor-pointer"
//             onClick={() => setShowEmojiPicker((prev) => !prev)}
//           />
//           <MdOutlineLocationOn className="w-5 h-5 cursor-pointer" />
//           {showEmojiPicker && (
//             <div className="absolute bottom-10 right-0 bg-white rounded-lg shadow-lg z-50">
//               <EmojiPicker
//                 onEmojiClick={handleEmojiClick} // Handle emoji click
//                 // theme="dark" // Optional: Matches dark mode
//               />
//             </div>
//           )}
//         </div>

//         {/* Post Button */}
//         <button
//           onClick={postTweet}
//           disabled={!topic || !content}
//           className={`px-4 py-2 rounded-full ${
//             topic && content
//               ? "bg-blue-500 text-white hover:bg-blue-600"
//               : "bg-blue-400 text-white cursor-not-allowed"
//           }`}
//         >
//           Post
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TweetInput;


"use client";

import React, { useState, useRef } from "react";
import { CiCamera, CiLocationOn } from "react-icons/ci";
import { MdGif, MdEmojiEmotions, MdPoll } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useAppContext } from "@/context/context";
import Image from "next/image";

const Post = () => {
  const { initTweet } = useAppContext()!;
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeInput, setActiveInput] = useState<"topic" | "text" | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 280;
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textValue = e.target.value;
    setText(textValue);
    setCharCount(textValue.length);
    
    // Reset height to calculate the right scroll height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    if (activeInput === "topic") {
      setTopic((prev) => prev + emojiObject.emoji);
    } else if (activeInput === "text") {
      setText((prev) => prev + emojiObject.emoji);
      setCharCount((prev) => prev + 1);
    }
  };

  const postTweet = async () => {
    if (topic && text) {
      setIsPosting(true);
      try {
        await initTweet(topic, text);
        setText("");
        setTopic("");
        setCharCount(0);
      } catch (error) {
        console.error("Error posting tweet:", error);
      } finally {
        setIsPosting(false);
      }
    }
  };

  // Calculate progress for the character limit circle
  const progress = (charCount / MAX_CHARS) * 100;
  const isNearLimit = charCount > MAX_CHARS * 0.8 && charCount <= MAX_CHARS;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
            <Image
              src="/assets/profile.png"
              alt="Profile"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-grow">
          {/* Topic Input */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Topic (Technology, Sports, Crypto...)"
              value={topic}
              onChange={handleTopicChange}
              onFocus={() => setActiveInput("topic")}
              className="w-full bg-transparent border-b border-gray-800 focus:border-blue-400 px-2 py-2 rounded-md focus:outline-none text-white placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Text Input */}
          <div className="mb-3">
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={handleTextChange}
              onFocus={() => setActiveInput("text")}
              placeholder="What's happening?"
              className="w-full bg-transparent focus:outline-none text-white placeholder-gray-500 resize-none overflow-hidden min-h-[80px]"
              style={{ height: 'auto' }}
            ></textarea>
          </div>

          {/* Public Visibility Option */}
          <div className="mb-4">
            <span className="inline-flex items-center text-blue-400 text-sm font-medium rounded-full px-3 py-1 bg-blue-400/10 hover:bg-blue-400/20 cursor-pointer transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Everyone can reply
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-3"></div>

          {/* Icons and Post Button */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                <CiCamera className="w-5 h-5" />
              </button>
              <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                <MdGif className="w-5 h-5" />
              </button>
              <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                <MdPoll className="w-5 h-5" />
              </button>
              <button 
                className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors relative"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <MdEmojiEmotions className="w-5 h-5" />
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </button>
              <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                <CiLocationOn className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center">
              {/* Character count indicator - only show when typing */}
              {charCount > 0 && (
                <div className="mr-3 flex items-center">
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <circle 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        fill="none" 
                        stroke="#2d3748" 
                        strokeWidth="2" 
                      />
                      {charCount > 0 && (
                        <circle 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          fill="none" 
                          stroke={isOverLimit ? "#e53e3e" : isNearLimit ? "#ed8936" : "#3182ce"} 
                          strokeWidth="2" 
                          strokeDasharray={`${progress * 0.628} 100`}
                          transform="rotate(-90 12 12)"
                        />
                      )}
                    </svg>
                    {isNearLimit && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {MAX_CHARS - charCount}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Post Button */}
              <button
                onClick={postTweet}
                disabled={!topic || !text || isPosting || charCount > MAX_CHARS}
                className={`px-5 py-2 rounded-full font-bold transition-all
                  ${(!topic || !text || isPosting || isOverLimit)
                    ? "bg-blue-400/50 text-white/50 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                {isPosting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting
                  </span>
                ) : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;