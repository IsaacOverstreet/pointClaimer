import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://pointclaimer-backend.onrender.com");

type LeaderboardEntry = {
  id: string;
  userId: string;
  name: string;
  totalPoints: number;
  rank: number;
};

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(
        "https://pointclaimer-backend.onrender.com/api/leaderboard"
      );
      setLeaderboard(res.data.data);
    } catch (error) {
      console.error("Failed to load leaderboard", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    socket.on("leaderboardUpdate", fetchLeaderboard);

    return () => {
      socket.off("leaderboardUpdate", fetchLeaderboard);
    };
  }, []);

  return (
    <div className="p-4 w-full md:w-[20%] flex md:h-screen">
      <aside className="w-full bg-gray-800 text-white p-4 overflow-y-auto rounded-md md:rounded-none">
        <h2 className="text-lg font-bold mb-4">🏆 Leaderboard</h2>
        <ul className="space-y-3">
          {leaderboard.map((user, index) => (
            <li
              key={user.id}
              className="flex items-center justify-between border-b border-gray-600 pb-2"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    index === 0
                      ? "bg-yellow-400 text-black"
                      : index === 1
                      ? "bg-gray-300 text-black"
                      : index === 2
                      ? "bg-orange-400 text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
              <span className="text-sm font-semibold">
                {user.totalPoints} pts
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Leaderboard;
