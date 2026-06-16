import { api } from "@/lib/axios";

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role?: string;
}
export interface GetMeResponse {
  success: boolean;

  user: AuthUser;
}
export interface LoginResponse {
  success: boolean;

  message: string;

  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export const signup = async (data: SignupInput) => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};
