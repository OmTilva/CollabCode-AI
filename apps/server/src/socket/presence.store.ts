export interface OnlineUser {
  userId: string;

  email: string;

  socketId: string;

  projectId: string;
}

export const onlineUsers = new Map<string, OnlineUser>();
