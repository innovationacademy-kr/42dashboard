import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SECRETORKEY } from 'src/config/42oauth';
import { DataSource } from 'typeorm';

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
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super({
      // 들어온 cookie와 payload를 통해 새로 만든 cookie를 비교해서 인가절차 진행
      secretOrKey: SECRETORKEY,
      jwtFromRequest: cookieExtractor,
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    // const { email, login, first_name, last_name, usual_full_name } = payload;
    const { id, login } = payload;
    console.log(`${login} is login`);
    return this.validateUser(payload);
  }

  async validateUser(payload) {
    //DB에서 해당 사용자에 대한 정보가 있는지 체크 <- repo.findOne()하면 될듯?
    if (payload) return payload;
    else return null;
  }
}
