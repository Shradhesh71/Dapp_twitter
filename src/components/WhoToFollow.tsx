interface User {
    id: number;
    username: string;
    handle: string;
  }
  
  const WhoToFollow = ({ suggestions }: { suggestions: User[] }) => {
    return (
      <div className="p-4 bg-black text-white rounded-lg  border border-gray-700 shadow-md shadow-slate-300/50">
        <h2 className="font-bold mb-2">Who to follow</h2>
        {suggestions.map((user) => (
          <div key={user.id} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold">{user.username}</p>
              <p className="text-gray-500">@{user.handle}</p>
            </div>
            <button className="bg-blue-500 text-white rounded-full py-1 px-3">Follow</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default WhoToFollow;
  