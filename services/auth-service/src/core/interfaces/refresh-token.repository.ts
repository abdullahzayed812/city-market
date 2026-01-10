import { RefreshToken } from "../entities/refresh-token.entity";

export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
