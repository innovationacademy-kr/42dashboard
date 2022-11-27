import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { Bocal } from '../entity/bocal.entity';

const cookieExtractor = function (req) {
  let token: string = null;
  if (req) token = String(req.headers.cookie);
  const arr = token.split(';');
  for (const idx in arr) {
    const array = arr[idx].split('=');
    array[0] = array[0].replace(/\s/g, ''); //white space제거
    if (array[0] == 'access_token') {
      return array[1]; //access_token 값을 반환
    }
  }
  return null; //null을 반환
};

@Injectable() //이 strategy가 guard에서 쓰일 예정
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    super({
      // 들어온 cookie와 payload를 통해 새로 만든 cookie를 비교해서 인가절차 진행
      secretOrKey: process.env.JWT_SECRETORKEY,
      jwtFromRequest: cookieExtractor,
    });
  }

  async validate(payload) {
    return await this.validateUser(payload); //<- 배포때는 이걸로 return 해줘야함
    // return payload; //<- 배포때는 이걸로 return 해줘야함
  }

  async validateUser(payload) {
    const user = await this.dataSource
      .getRepository(Bocal)
      .findOne({ where: { id: payload.id } });
    if (user) {
      // console.log(`In authGuard: ${user.intraName} is login`);
      return payload.id;
    }
    
    else return null;
  }
}
