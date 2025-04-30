// // src/components/Sidebar.tsx
// "use client";
// import Link from "next/link";
// import { GoHomeFill } from "react-icons/go";
// import { IoSearch } from "react-icons/io5";
// import { HiMiniBell } from "react-icons/hi2";
// import { HiOutlineMail } from "react-icons/hi";
// import { FaRegUser } from "react-icons/fa";
// import { CgMoreO } from "react-icons/cg";
// import dynamic from 'next/dynamic';


// const WalletMultiButtonDynamic = dynamic(
//   async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
//   { ssr: false }
// );

// const Sidebar = () => {
//   return (
//     <aside className="flex flex-col items-start pl-20 space-y-4 bg-black text-white h-screen w-80 fixed">
//       <div className="text-4xl font-bold m-5 mb-4">
//         <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex md:hidden text-lg "/>
//       </div>
//       <Link href="/" className="flex items-center space-x-2">
//         <GoHomeFill className="w-8 h-8" />
//         <span className=" text-xl">Home</span>
//       </Link>
//       <Link href="/explore" className="flex items-center space-x-2">
//         <IoSearch className="w-8 h-8" />
//         <span className=" text-xl">Explore</span>
//       </Link>
//       <Link href="/notifications" className="flex items-center  space-x-2">
//         <HiMiniBell className="w-8 h-8" />
//         <span className=" text-xl">Notifications</span>
//       </Link>
//       <Link href="/messages" className="flex items-center space-x-2">
//         <HiOutlineMail className="w-8 h-8" />
//         <span className=" text-xl">Messages</span>
//       </Link>
//       <Link href="/messages" className="flex items-center space-x-2">
//         <HiOutlineMail className="w-8 h-8" />
//         <span className=" text-xl">Grok</span>
//       </Link>
//       <Link href="/messages" className="flex items-center space-x-2">
//         <HiOutlineMail className="w-8 h-8" />
//         <span className=" text-xl">Communities</span>
//       </Link>
//       <Link href="/messages" className="flex items-center space-x-2">
//         <HiOutlineMail className="w-8 h-8" />
//         <span className=" text-xl">Premium</span>
//       </Link>
//       <Link href="/messages" className="flex items-center space-x-2">
//         <HiOutlineMail className="w-8 h-8" />
//         <span className=" text-xl">Verified Orgs</span>
//       </Link>
//       <Link href="/profile" className="flex items-center space-x-2">
//         <FaRegUser className="w-8 h-8" />
//         <span className=" text-xl">Profile</span>
//       </Link>
//       <Link href="/profile" className="flex items-center space-x-2">
//         <CgMoreO className="w-8 h-8" />
//         <span className=" text-xl">More</span>
//       </Link>
//       <button className="mt-auto text-xl bg-blue-400 text-white rounded-full py-4 px-4 w-full">
//         Post
//       </button>
//       <Link href="/" className="text-4xl font-bold m-5 mb-1">
//         X
//       </Link>
//     </aside>
//   );
// };

// export default Sidebar;


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaList, FaUser } from "react-icons/fa";
import { CgMoreO } from "react-icons/cg";
import { RiQuillPenFill } from "react-icons/ri";

const Sidebar = () => {
  const { connected, publicKey } = useWallet();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Home", icon: <FaHome className="h-6 w-6" />, href: "/" },
    { name: "Explore", icon: <FaHashtag className="h-6 w-6" />, href: "/explore" },
    { name: "Notifications", icon: <FaBell className="h-6 w-6" />, href: "/notifications" },
    { name: "Messages", icon: <FaEnvelope className="h-6 w-6" />, href: "/messages" },
    { name: "Bookmarks", icon: <FaBookmark className="h-6 w-6" />, href: "/bookmarks" },
    { name: "Lists", icon: <FaList className="h-6 w-6" />, href: "/lists" },
    { name: "Profile", icon: <FaUser className="h-6 w-6" />, href: connected && publicKey ? `/${publicKey.toString()}` : "/profile" },
    { name: "More", icon: <CgMoreO className="h-6 w-6" />, href: "#" },
  ];

  return (
    <div className="h-full flex flex-col justify-between py-4">
      {/* Logo */}
      <div className="px-4">
        <Link href="/" className="text-white">
          <div className="w-8 h-8 xl:w-10 xl:h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 xl:h-6 xl:w-6">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </svg>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className="flex items-center px-4 py-2 text-lg font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                <span className="min-w-[30px]">{item.icon}</span>
                <span className="hidden xl:block ml-4">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Post Button */}
      <div className="px-4 my-4">
        <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-full w-12 h-12 xl:w-full xl:py-3 flex items-center justify-center">
          <RiQuillPenFill className="h-6 w-6 xl:hidden" />
          <span className="hidden xl:block font-bold">Post</span>
        </button>
      </div>

      {/* Profile Section */}
      <div className="mt-auto px-4">
        <div className="wallet-adapter-dropdown">
          {connected && publicKey ? (
            <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {publicKey.toString().charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block overflow-hidden">
                <p className="font-semibold truncate w-32">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </p>
              </div>
            </div>
          ) : 
          (
            <div className="wallet-adapter-button-trigger">
              <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600 !transition-colors !rounded-full !py-2 !font-bold" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;