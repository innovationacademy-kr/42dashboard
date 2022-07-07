import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { createReadStream, open, write, writeFile } from 'fs';
import { join } from 'path';
import { AUTHPARAM } from 'src/config/42oauth';
import { jsonToFile } from 'src/utils/json-helper/jsonHelper';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async createJwt(obj) {
    // 아래 if문은 주석문은 배포할때 주석풀어주기
    // if (obj['staff'] == false) throw new BadRequestException();
    const payload = obj;
    console.log(payload);
    const access_token = await this.jwtService.sign(payload);
    return access_token; //42에 대한 토큰이 아니라 우리 백엔드 서버에 대한 토큰
  }

  async authentication(code) {
    const param = AUTHPARAM;
    param['code'] = code;
    let response42;
    let url = 'https://api.intra.42.fr/oauth/token?';
    //url에 query붙이기
    for (const key in param) {
      url += `${key}=`;
      url += `${param[key]}&`;
    }
    try {
      response42 = await axios.post(url);
    } catch (what) {
      console.log('42 token reqest error', what);
      return new BadRequestException();
    } finally {
      const {
        access_token,
        token_type,
        expires_in,
        refresh_token,
        scope,
        created_at,
      } = response42.data;
      response42 = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log(response42.data);
      //이제 jwt 토큰 생성 및 jwt passport 그리고 guard 설정
    }
    // jsonToFile(
    //   join(process.cwd(), './src/auth/responseJson.Json'),
    //   response42.data,
    // );
    // 아래에서 id는 고유 number임 ("huchoi"같은 intra_id가 아님)
    const payload = {
      id: response42.data.id,
      login: response42.data.login,
      staff: response42.data['staff?'],
    };
    return await this.createJwt(payload);
  }
}
