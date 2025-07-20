import { useEffect, useState } from "react";

import axios from "axios";
type User = {
  userId: string;
  name: string;
  totalPoints: number;
};

import io from "socket.io-client";
const socket = io("https://pointclaimer-backend.onrender.com");

function MainUi() {
  const [users, setUsers] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const [selectUserId, setSelectUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function fetchUsers() {
    try {
      const response = await axios.get<User[]>(
        "https://pointclaimer-backend.onrender.com/api/users"
      );
      const result = response.data;
      setUsers(result);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  useEffect(() => {
    fetchUsers();

    socket.on("leaderboard:update", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off("leaderboard:update");
    };
  }, []);

  //ADD NEW USER///////
  async function addUser() {
    if (!input.trim()) return;
    console.log(input);

    try {
      const response = await axios.post(
        "https://pointclaimer-backend.onrender.com/api/users",
        {
          name: input.trim(),
        }
      );
      setInput("");

      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }

  //////CLAIM BUTTON////////////////
  async function handleClaim() {
    if (!selectUserId) {
      alert("Please select a user");
      return;
    }

    try {
      const response = await axios.post(
        "https://pointclaimer-backend.onrender.com/api/claim",
        {
          userId: selectUserId,
        }
      );

      const { awardedPoints, user } = response.data;

      setMessage(`${user.name} claimed ${awardedPoints} points!`);
    } catch (error) {
      console.error("Claim failed:", error);
      setMessage("Something went wrong while claiming points.");
    }
  }

  const selectUser = users.find((user) => user.userId === selectUserId);
  return (
    <div className="w-full px-6 py-4 space-y-6 bg-gray-50 rounded-xl shadow">
      {/* Add User */}
      <div className="bg-white p-5 rounded-xl border space-y-3">
        <label htmlFor="input" className="block font-semibold text-gray-700">
          Add New User
        </label>
        <div className="flex space-x-2">
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            value={input}
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new user..."
          />
          <button
            onClick={addUser}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              input.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>
      </div>

      {/* Select User */}
      <div className="bg-white p-5 rounded-xl border space-y-3">
        <label className="block font-semibold text-gray-700">Select User</label>
        <select
          onChange={(e) => setSelectUserId(e.target.value)}
          value={selectUserId ?? ""}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose a user --</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Claim Points */}
      <div className="bg-white p-5 rounded-xl border space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Claim Points</h2>
        <p className="text-sm text-gray-600">
          Choose a user from the dropdown above to view them and claim points.
        </p>

        {selectUser && (
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-gray-800 font-semibold text-md">
              👤 Selected: {selectUser.name}
            </h3>
            <button
              onClick={handleClaim}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Claim
            </button>
          </div>
        )}

        {message && (
          <p className="mt-4 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
export default MainUi;
