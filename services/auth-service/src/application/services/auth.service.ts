import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { IUserRepository } from "../../core/interfaces/user.repository";
import { IRefreshTokenRepository } from "../../core/interfaces/refresh-token.repository";
import { RegisterDto, LoginDto, TokenPair, TokenPayload } from "../../core/dto/auth.dto";
import { User } from "../../core/entities/user.entity";
import { RefreshToken } from "../../core/entities/refresh-token.entity";
import { config } from "../../config/env";
import { ValidationError, UnauthorizedError } from "../../../../shared/utils/errors";

export class AuthService {
  constructor(private userRepo: IUserRepository, private refreshTokenRepo: IRefreshTokenRepository) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    // Validate email
    if (!this.isValidEmail(dto.email)) {
      throw new ValidationError("Invalid email format");
    }

    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ValidationError("Email already registered");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const user: User = {
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      role: dto.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.userRepo.create(user);

    // Generate tokens
    return this.generateTokenPair(user);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    // Find user
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is inactive");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate tokens
    return this.generateTokenPair(user);
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const tokenRecord = await this.refreshTokenRepo.findByToken(refreshToken);
    if (!tokenRecord) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Get user
    const user = await this.userRepo.findById(tokenRecord.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    // Delete old refresh token
    await this.refreshTokenRepo.deleteByUserId(user.id);

    // Generate new tokens
    return this.generateTokenPair(user);
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedError("Invalid token");
    }
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepo.deleteByUserId(userId);
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpiry,
    });

    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiry,
    });

    // Store refresh token
    const tokenRecord: RefreshToken = {
      id: randomUUID(),
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    };

    await this.refreshTokenRepo.create(tokenRecord);

    return { accessToken, refreshToken };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
