import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export class ProviderImportsFactory {
  // JWT Auth Guard
  static createJwtAuthGuard() {
    return {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    };
  }

  // Rate Limiting Guard
  static createThrottleGuard() {
    return {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    };
  }

  // Roles Guard (for role-based access control)
  static createRolesGuard() {
    return {
      provide: APP_GUARD,
      useClass: RolesGuard,
    };
  }
}
