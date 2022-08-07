import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { createReadStream, open, write, writeFile } from 'fs';
import { join } from 'path';
import { AUTHPARAM } from 'src/config/42oauth';
import { jsonToFile } from 'src/utils/json-helper/jsonHelper';
import { DataSource } from 'typeorm';
import { Bocal, BocalRole, ErrorObject } from './entity/bocal.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  /**
   * 배포할때 수정필요함
   */
  async createJwt(obj) {
    // 아래 if문은 주석문은 배포할때 주석풀어주기
    // if (obj['staff'] == false) throw new BadRequestException();
    if (obj.isStaff != true) throw new BadRequestException();
    console.log(obj.isStaff, '<- false인데, 여기에 도달하면 절대 안됨');
    const bocal = this.dataSource.getRepository(Bocal).create();
    bocal.id = obj.id;
    bocal.intraName = obj.intraName;
    bocal.image_url = obj.image_url;
    bocal.email = obj.email;
    bocal.role = BocalRole.ADMIN; //이 부분 나중에 분기문으로 처리
    bocal.isStaff = true;
    console.log('save bocal ', bocal.intraName);
    await this.dataSource.getRepository(Bocal).save(bocal);
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
      throw new BadRequestException();
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
    }
    // 아래에서 id는 고유 number임 ("huchoi"같은 intra_id가 아님)
    const payload = {
      id: response42.data.id,
      intraName: response42.data.login,
      email: response42.data.email,
      image_url: response42.data.image_url,
      isStaff: response42.data['staff?'],
    };
    return await this.createJwt(payload);
  }

  async logoutUser(user) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await this.dataSource.getRepository(Bocal).delete({ id: user.id });
    await queryRunner.commitTransaction(); //rollback 해버리는 실수
    await queryRunner.release();
  }

  async getError(user) {
    const ret = [];
    const errArr = await this.dataSource.getRepository(ErrorObject).find();
    if (errArr.length == 0) return null;
    for (const element of errArr) {
      ret.push(JSON.parse(element.error));
    }
    return ret;
  }
}
