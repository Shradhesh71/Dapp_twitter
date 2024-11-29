import HomePage from "@/components/FeedPost";
import Post from "@/components/post";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Post/>
      <HomePage/>
    </div>
  );
}
