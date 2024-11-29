import WhatsHappening from "./WhatsHappening";
import WhoToFollow from "./WhoToFollow";

const tweets = [
  { id: 1, username: "X Developers", handle: "shn25gsd" },
  { id: 2, username: "RED Global", handle: "shradeshjain835" },
];

export default function RightSide() {
  return (
    <div className="p-5">
      <div>
        <input
          type="search"
          className="rounded-full w-full mb-4 p-2 bg-gray-800"
          placeholder="🔎  Search"
        />
        <WhatsHappening/>
        <WhoToFollow suggestions={tweets} />
      </div>
    </div>
  );
}
