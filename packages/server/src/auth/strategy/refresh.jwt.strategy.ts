import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

const cookieExtractor = function (req) {
  let token: string = null;
  if (req) token = String(req.headers.cookie);
  const arr = token.split(';');
  for (const idx in arr) {
    const array = arr[idx].split('=');
    array[0] = array[0].replace(/\s/g, ''); //white space제거
    if (array[0] == 'refresh_token') {
      return array[1]; //refresh_token 값을 반환
    }
  }
  return null; //null을 반환
};

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true, //무슨의미?
    });
  }

  // [수정 사항] refresh_token 검증 코드 추가
  async validate(request: Request, payload) {
    const refreshToken = cookieExtractor(request);
    return await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
