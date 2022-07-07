import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { createReadStream, open, write, writeFile } from 'fs';
import { join } from 'path';
import { jsonToFile } from 'src/utils/json-helper/jsonHelper';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async createJwt(obj) {
    const payload = obj;
    console.log(payload);
    const access_token = await this.jwtService.sign(payload);
    return access_token; //42에 대한 토큰이 아니라 우리 백엔드 서버에 대한 토큰
  }

  async authentication(code) {
    const param = {
      grant_type: 'authorization_code',
      client_id:
        'b30d3b073e551b492e6fcd5ad35dad825545eede1f463058fcd255b673721384',
      client_secret:
        'cb465b16e6fe96b7b3659c57bd4587e5133824986f20aa8f7ca33a335872ce24',
      code,
      redirect_uri: 'http://localhost:3000/auth/42/redirection',
      state: 'sStTaATteEe',
    };
    let url = 'https://api.intra.42.fr/oauth/token?';
    //url에 query붙이기
    for (const key in param) {
      url += `${key}=`;
      url += `${param[key]}&`;
    }
    let response42;
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
      console.log(response42.data);
      //이제 jwt 토큰 생성 및 jwt passport 그리고 guard 설정
    }
    // jsonToFile(
    //   join(process.cwd(), './src/auth/responseJson.Json'),
    //   response42.data,
    // );
    // 아래에서 id는 고유 number임 ("huchoi"같은 intra_id가 아님)
    const payload = { id: response42.data.id, login: response42.data.login };
    return await this.createJwt(payload);
  }
}
