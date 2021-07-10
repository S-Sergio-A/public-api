export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ClientJWTData {
  ip: string;
  clientId: string;
}
