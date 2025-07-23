export interface LoginResponse {
  access_token: string;
}

export interface DecodedToken {
  sub: string;
  role: 'admin' | 'user';
  exp: number;
}
