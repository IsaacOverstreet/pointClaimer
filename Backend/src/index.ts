import express from "express";
import userRoutes from "./route/userRoute";
import cors from "cors";
import claimRoute from "./route/claimPointRoute";
import leaderBoardRoute from "./route/leaderBoardRoute";
import { Server } from "socket.io";
import http from "http";
import { connectMongoDb } from "./mongodb";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

// Connect to MongoDB
connectMongoDb();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "https://pointclaimer.netlify.app/",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
});

app.use("/api", userRoutes);
app.use("/api", claimRoute);
app.use("/api", leaderBoardRoute);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
