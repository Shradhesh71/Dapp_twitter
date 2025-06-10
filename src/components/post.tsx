"use client";

// import React, { useState, useRef } from "react";
// import { CiCamera, CiLocationOn } from "react-icons/ci";
// import { MdGif, MdEmojiEmotions, MdPoll } from "react-icons/md";
// import EmojiPicker from "emoji-picker-react";
// import { useAppContext } from "@/context/context";
// import Image from "next/image";
// import axios from "axios";

// const Post = () => {
//   const { initTweet } = useAppContext()!;
//   const [text, setText] = useState("");
//   const [topic, setTopic] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [activeInput, setActiveInput] = useState<"topic" | "text" | null>(null);
//   const [isPosting, setIsPosting] = useState(false);
//   const [charCount, setCharCount] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [documentFile, setDocumentFile] = useState<File | null>(null);
//   const MAX_CHARS = 280;

//   const textAreaRef = useRef<HTMLTextAreaElement>(null);

//   // Auto-resize textarea as content grows
//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const textValue = e.target.value;
//     setText(textValue);
//     setCharCount(textValue.length);

//     // Reset height to calculate the right scroll height
//     if (textAreaRef.current) {
//       textAreaRef.current.style.height = "auto";
//       textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
//     }
//   };

//   const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTopic(e.target.value);
//   };

//   const handleEmojiClick = (emojiObject: { emoji: string }) => {
//     if (activeInput === "topic") {
//       setTopic((prev) => prev + emojiObject.emoji);
//     } else if (activeInput === "text") {
//       setText((prev) => prev + emojiObject.emoji);
//       setCharCount((prev) => prev + 1);
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setDocumentFile(file);

//       const imgUrl = await uploadToPinata(file);
//       console.log("Done handleFileChange ✅", imgUrl);
//     }
//   };

//   const uploadToPinata = async (file: File) => {
//     if (!file) {
//       alert("Please select a document to upload.");
//       return "";
//     }

//     setIsUploading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           headers: {
//             pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
//             pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
//           },
//         }
//       );

//       const fileUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
//       setImageUrl(fileUrl);
//       return fileUrl;
//     } catch (error: any) {
//       console.log("Error uploading to Pinata Document:", error);
//       // toast({
//       //   title: "Image upload Failed",
//       //   description: "Please try again, error: " + error.message,
//       //   variant: "destructive",
//       // });
//       return "";
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const postTweet = async () => {
//     if (topic && text) {
//       setIsPosting(true);
//       try {
//         if( documentFile) {
//           const imgUrl = await uploadToPinata(documentFile);
//           if (imgUrl) {
//             await initTweet(topic, text, imgUrl);
//           }
//         } else {
//           await initTweet(topic, text);
//         }
//         setText("");
//         setTopic("");
//         setCharCount(0);
//       } catch (error) {
//         console.error("Error posting tweet:", error);
//       } finally {
//         setIsPosting(false);
//       }
//     }
//   };

//   // Calculate progress for the character limit circle
//   const progress = (charCount / MAX_CHARS) * 100;
//   const isNearLimit = charCount > MAX_CHARS * 0.8 && charCount <= MAX_CHARS;
//   const isOverLimit = charCount > MAX_CHARS;

//   return (
//     <div className="border-b border-gray-800 p-4">
//       <div className="flex space-x-4">
//         {/* Profile Image */}
//         <div className="flex-shrink-0">
//           <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
//             <Image
//               src="/assets/profile.png"
//               alt="Profile"
//               width={48}
//               height={48}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>

//         {/* Post Content */}
//         <div className="flex-grow">
//           {/* Topic Input */}
//           <div className="mb-2">
//             <input
//               type="text"
//               placeholder="Topic (Technology, Sports, Crypto...)"
//               value={topic}
//               onChange={handleTopicChange}
//               onFocus={() => setActiveInput("topic")}
//               className="w-full bg-transparent border-b border-gray-800 focus:border-blue-400 px-2 py-2 rounded-md focus:outline-none text-white placeholder-gray-500 transition-colors"
//             />
//           </div>

//           {/* Text Input */}
//           <div className="mb-3">
//             <textarea
//               ref={textAreaRef}
//               value={text}
//               onChange={handleTextChange}
//               onFocus={() => setActiveInput("text")}
//               placeholder="What's happening?"
//               className="w-full bg-transparent focus:outline-none text-white placeholder-gray-500 resize-none overflow-hidden min-h-[80px]"
//               style={{ height: "auto" }}
//             ></textarea>
//           </div>

//           {/* Public Visibility Option */}
//           <div className="mb-4">
//             <span className="inline-flex items-center text-blue-400 text-sm font-medium rounded-full px-3 py-1 bg-blue-400/10 hover:bg-blue-400/20 cursor-pointer transition-colors">
//               <svg
//                 className="w-4 h-4 mr-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
//                 ></path>
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 ></path>
//               </svg>
//               Everyone can reply
//             </span>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-gray-800 my-3"></div>

//           {/* Icons and Post Button */}
//           <div className="flex items-center justify-between">
//             <div className="flex space-x-3">
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt="Degree image"
//                   className="w-72 h-84 rounded-2xl mx-auto"
//                 />
//               ) : (
//                 <label htmlFor="document" className="custum-file-upload">
//                   <div className="text">
//                     <span>Click to upload image</span>
//                   </div>
//                   <input
//                     type="file"
//                     id="document"
//                     name="document"
//                     accept=".jpg,.png"
//                     onChange={handleFileChange}
//                     required={!imageUrl}
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <p className="text-violet-600 mt-2 text-center">
//                       Uploading image...
//                     </p>
//                   )}
//                   {imageUrl && <p>image uploaded: {imageUrl}</p>}
//                 </label>
//               )}
//               <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
//                 <CiCamera className="w-5 h-5" />
//               </button>
//               <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
//                 <MdGif className="w-5 h-5" />
//               </button>
//               <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
//                 <MdPoll className="w-5 h-5" />
//               </button>
//               <button
//                 className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors relative"
//                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//               >
//                 <MdEmojiEmotions className="w-5 h-5" />
//                 {showEmojiPicker && (
//                   <div className="absolute top-full left-0 mt-2 z-50">
//                     <EmojiPicker onEmojiClick={handleEmojiClick} />
//                   </div>
//                 )}
//               </button>
//               <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
//                 <CiLocationOn className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex items-center">
//               {/* Character count indicator - only show when typing */}
//               {charCount > 0 && (
//                 <div className="mr-3 flex items-center">
//                   <div className="relative w-8 h-8">
//                     <svg className="w-8 h-8" viewBox="0 0 24 24">
//                       <circle
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         fill="none"
//                         stroke="#2d3748"
//                         strokeWidth="2"
//                       />
//                       {charCount > 0 && (
//                         <circle
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           fill="none"
//                           stroke={
//                             isOverLimit
//                               ? "#e53e3e"
//                               : isNearLimit
//                               ? "#ed8936"
//                               : "#3182ce"
//                           }
//                           strokeWidth="2"
//                           strokeDasharray={`${progress * 0.628} 100`}
//                           transform="rotate(-90 12 12)"
//                         />
//                       )}
//                     </svg>
//                     {isNearLimit && (
//                       <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
//                         {MAX_CHARS - charCount}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Post Button */}
//               <button
//                 onClick={postTweet}
//                 disabled={!topic || !text || isPosting || charCount > MAX_CHARS}
//                 className={`px-5 py-2 rounded-full font-bold transition-all
//                   ${
//                     !topic || !text || isPosting || isOverLimit
//                       ? "bg-blue-400/50 text-white/50 cursor-not-allowed"
//                       : "bg-blue-500 text-white hover:bg-blue-600"
//                   }`}
//               >
//                 {isPosting ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Posting
//                   </span>
//                 ) : (
//                   "Post"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Post;

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Image,
  Smile,
  MapPin,
  Calendar,
  BarChart3,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/context";
import EmojiPicker from "emoji-picker-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const XPostComposer = () => {
  const { initTweet } = useAppContext()!;
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const { publicKey } = useWallet();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // total 280 + ~120 = 400 characters
  const MAX_CHARS = 280;
  const charCount = text.length;
  const progress = (charCount / MAX_CHARS) * 100;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isOverLimit = charCount > MAX_CHARS;

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const handleTopicChange = (e: any) => {
    setTopic(e.target.value);
  };

  const handleFileChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);

      // Create preview URL immediately
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);

      // Upload to Pinata
      const imgUrl = await uploadToPinata(file);
      console.log("Done handleFileChange ✅", imgUrl);
    }
  };

  const uploadToPinata = async (file: any) => {
    if (!file) {
      toast({
        description: "Please select a document to upload.",
        title: "Error",
        variant: "destructive",
      });
      return "";
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
          },
        }
      );

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      setImageUrl(fileUrl);
      return fileUrl;
    } catch (error) {
      console.log("Error uploading to Pinata Document:", error);
      toast({
        description: "Image upload failed. Please try again.",
        title: "Error",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setDocumentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const postTweet = async () => {
    if (!topic || !text || charCount > MAX_CHARS) return;

    setIsPosting(true);

    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before doing anything.",
        variant: "destructive",
      });
      setIsPosting(false);
      return;
    }
    try {
      // if (documentFile) {
      //   const imgUrl = await uploadToPinata(documentFile);
      //   if (imgUrl) {
      //     await initTweet(topic, text, imgUrl);
      //   }
      // } else {
      // await initTweet(topic, text);
      // }

      if (documentFile) {
        const textWithImageUrl = text + ` SJDECX:${imageUrl}`;
        await initTweet(topic, textWithImageUrl);
      } else {
        await initTweet(topic, text);
      }

      // Clear form after successful post
      setText("");
      setTopic("");
      setImageUrl("");
      setDocumentFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Post shared successfully!",
        description: "Your post has been shared.",
      });
    } catch (error) {
      console.error("Error posting tweet:", error);
      toast({
        description: "Failed to post. Please try again.",
        title: "Error",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="bg-black text-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-3xl bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent font-bold">
            DEC X
          </h1>
          {/* <button className="text-gray-400 hover:text-white">
            <X className="w-10 h-10" />
          </button> */}
          <div className="md:hidden">
            <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600 !transition-colors !rounded-full !py-2 !font-bold" />
          </div>
        </div>

        {/* Composer */}
        <div className="p-4">
          <div className="flex space-x-3">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="flex-grow">
              {/* Topic Input */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Add a topic"
                  value={topic}
                  required
                  onChange={handleTopicChange}
                  onFocus={() => setActiveInput("topic")}
                  className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none border-none"
                />
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <textarea
                  required
                  ref={textAreaRef}
                  value={text}
                  onChange={handleTextChange}
                  onFocus={() => setActiveInput("text")}
                  placeholder="What's happening?"
                  className="w-full bg-transparent text-xl placeholder-gray-500 focus:outline-none resize-none border-none min-h-[120px]"
                  style={{ height: "auto" }}
                />
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="mb-4 relative">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                    <img
                      src={imageUrl}
                      alt="Upload preview"
                      className="w-full max-h-96 object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4 p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-300">Uploading to IPFS...</span>
                  </div>
                </div>
              )}

              {/* Privacy Setting */}
              <div className="mb-4">
                <button className="flex items-center text-blue-400 text-sm font-medium hover:bg-blue-400/10 rounded-full px-3 py-1 transition-colors">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Everyone can reply
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 my-4"></div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between">
                {/* Media Icons */}
                <div className="flex items-center space-x-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors relative"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-5 h-5" />
                    {/* {showEmojiPicker && (
                      <div className="absolute bottom-12 left-0 bg-gray-900 border border-gray-700 rounded-lg p-4 z-50">
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            "😀",
                            "😂",
                            "😍",
                            "🤔",
                            "😢",
                            "😡",
                            "👍",
                            "👎",
                            "❤️",
                            "🔥",
                            "💯",
                            "🎉",
                          ].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiClick({ emoji })}
                              className="text-2xl hover:bg-gray-800 rounded p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-2 z-50">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </button>
                  <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </button>
                  <button className="text-blue-400 hover:bg-blue-400/10 rounded-full p-2 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>

                {/* Character Count and Post Button */}
                <div className="flex items-center space-x-3">
                  {charCount > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="relative w-6 h-6">
                        <svg
                          className="w-6 h-6 transform -rotate-90"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="3"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke={
                              isOverLimit
                                ? "#ef4444"
                                : isNearLimit
                                ? "#f59e0b"
                                : "#3b82f6"
                            }
                            strokeWidth="3"
                            strokeDasharray={`${progress * 0.628} 100`}
                          />
                        </svg>
                        {isNearLimit && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {MAX_CHARS - charCount}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={postTweet}
                    disabled={!text.trim() || isPosting || isOverLimit}
                    className={`px-6 py-1.5 rounded-full font-bold text-sm transition-all ${
                      !text.trim() || isPosting || isOverLimit
                        ? "bg-blue-400/50 text-white/50 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isPosting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Posting</span>
                      </div>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPostComposer;
