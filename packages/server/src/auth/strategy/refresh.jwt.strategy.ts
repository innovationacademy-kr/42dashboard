import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SECRETORKEY } from 'src/config/42oauth';
import { AuthService } from '../auth.service';

const cookieExtractor = function (req) {
  let token: string = null;
  if (req) token = String(req.headers.cookie);
  const arr = token.split(';');
  for (const idx in arr) {
    const array = arr[idx].split('=');
    array[0] = array[0].replace(/\s/g, ''); //white space제거
    if (array[0] == 'refresh_token') {
      return array[1]; //access_token 값을 반환
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
      //   jwtFromRequest: ExtractJwt.fromExtractors([
      //     (request: Request) => {
      //       return request?.cookies?.refresh_token;
      //     },
      //   ]),
      secretOrKey: SECRETORKEY,
      passReqToCallback: true, //무슨의미?
    });
  }

  async validate(request: Request, payload) {
    console.log('도달');
    const refreshToken = request.cookies?.refresh_token;
    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
