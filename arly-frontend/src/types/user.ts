export interface User {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
  };
  app_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  is_premium: boolean;
  premium_until: string | null;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface WebhookResponse {
  profile: UserProfile;
}
