import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "@/modules/auth/routes/auth.routes.js";
import teamRoutes from "@/modules/team/routes/team.routes.js";
import projectRoutes from "@/modules/project/routes/project.routes.js";
import fileRoutes from "@/modules/file/routes/file.routes.js";
import activityRoutes from "@/modules/activity/routes/activity.routes.js";
import { initializeSocket } from "@/socket/index.js";
import { connectRedis, redis } from "@/lib/redis.js";
import {
  addUserToProject,
  getProjectUsers,
  removeUserFromProject,
} from "./redis/presence.service.js";

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//health check route
app.get("/api/v1/health", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Server running properly",
  });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", fileRoutes);
app.use("/api/v1", activityRoutes);

await connectRedis();

await initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
