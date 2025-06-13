import { UserRole } from "../../config/auth.config";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Validate login request
export function isValidLoginRequest(data: any): data is LoginRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.username === 'string' &&
    typeof data.password === 'string' &&
    data.username.trim() !== '' &&
    data.password.trim() !== ''
  );
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
  };
}
