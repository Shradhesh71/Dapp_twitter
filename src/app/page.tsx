// import HomePage from "@/components/FeedPost";
// import Post from "@/components/post";

// export default function Home() {
//   return (
//     <div>
//       <Post/>
//       <HomePage/>
//     </div>
//   );
// }
// pages/index.tsx
"use client";

import Feed from "@/components/FeedPost";
import Post from "@/components/post";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Sticky header with backdrop blur */}
      <div className={`sticky top-0 backdrop-blur-md z-10 px-4 py-3 ${isScrolled ? 'bg-black/70' : 'bg-transparent'} transition-all duration-300`}>
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Post component */}
      <div className="mb-4">
        <Post />
      </div>
      
      {/* Feed component */}
      <Feed />
    </div>
  );
}