// src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { HiMiniBell } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa";
import { CgMoreO } from "react-icons/cg";
import dynamic from 'next/dynamic';


const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Sidebar = () => {
  return (
    <aside className="flex flex-col items-start pl-20 space-y-4 bg-black text-white h-screen w-80 fixed">
      <div className="text-4xl font-bold m-5 mb-4">
        <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex md:hidden text-lg "/>
      </div>
      <Link href="/" className="flex items-center space-x-2">
        <GoHomeFill className="w-8 h-8" />
        <span className=" text-xl">Home</span>
      </Link>
      <Link href="/explore" className="flex items-center space-x-2">
        <IoSearch className="w-8 h-8" />
        <span className=" text-xl">Explore</span>
      </Link>
      <Link href="/notifications" className="flex items-center  space-x-2">
        <HiMiniBell className="w-8 h-8" />
        <span className=" text-xl">Notifications</span>
      </Link>
      <Link href="/messages" className="flex items-center space-x-2">
        <HiOutlineMail className="w-8 h-8" />
        <span className=" text-xl">Messages</span>
      </Link>
      <Link href="/messages" className="flex items-center space-x-2">
        <HiOutlineMail className="w-8 h-8" />
        <span className=" text-xl">Grok</span>
      </Link>
      <Link href="/messages" className="flex items-center space-x-2">
        <HiOutlineMail className="w-8 h-8" />
        <span className=" text-xl">Communities</span>
      </Link>
      <Link href="/messages" className="flex items-center space-x-2">
        <HiOutlineMail className="w-8 h-8" />
        <span className=" text-xl">Premium</span>
      </Link>
      <Link href="/messages" className="flex items-center space-x-2">
        <HiOutlineMail className="w-8 h-8" />
        <span className=" text-xl">Verified Orgs</span>
      </Link>
      <Link href="/profile" className="flex items-center space-x-2">
        <FaRegUser className="w-8 h-8" />
        <span className=" text-xl">Profile</span>
      </Link>
      <Link href="/profile" className="flex items-center space-x-2">
        <CgMoreO className="w-8 h-8" />
        <span className=" text-xl">More</span>
      </Link>
      <button className="mt-auto text-xl bg-blue-400 text-white rounded-full py-4 px-4 w-full">
        Post
      </button>
      <Link href="/" className="text-4xl font-bold m-5 mb-1">
        X
      </Link>
    </aside>
  );
};

export default Sidebar;
