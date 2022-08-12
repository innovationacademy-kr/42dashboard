import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SECRETORKEY } from 'src/config/42oauth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Bocal } from './entity/bocal.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refresh.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bocal]),
    PassportModule.register({ defaultStrategy: ['jwt', 'jwt-refresh-token'] }), //기억해두기
    JwtModule.register({
      secret: SECRETORKEY,
      // signOptions: {
      //   // expiresIn: 60 * 60,
      // },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [JwtStrategy, PassportModule, JwtRefreshTokenStrategy],
})
export class AuthModule {}
