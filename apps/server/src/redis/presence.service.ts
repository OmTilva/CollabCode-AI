import { redis } from "@/lib/redis.js";

interface PresenceUser {
  userId: string;
  email: string;
}
// add user to a project's online set
export const addUserToProject = async (
  projectId: string,
  user: PresenceUser,
) => {
  await redis.sAdd(`project:${projectId}:online`, JSON.stringify(user));
};
// get all online users for a project
export const getProjectUsers = async (projectId: string) => {
  const users = await redis.sMembers(`project:${projectId}:online`);

  return users.map((user) => JSON.parse(user));
};
// remove user from a project's online set
export const removeUserFromProject = async (
  projectId: string,
  user: PresenceUser,
) => {
  await redis.sRem(`project:${projectId}:online`, JSON.stringify(user));
};

// set the projectId for a socket(user) - this is used to track which project a user is currently in
export const setSocketProject = async (socketId: string, projectId: string) => {
  await redis.set(`socket:${socketId}`, projectId);
};
// get the projectId for a socket)
export const getSocketProject = async (socketId: string) => {
  return redis.get(`socket:${socketId}`);
};
// remove the projectId for a socket
export const removeSocketProject = async (socketId: string) => {
  await redis.del(`socket:${socketId}`);
};
