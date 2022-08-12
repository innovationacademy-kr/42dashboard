import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { AUTHPARAM, SECRETORKEY } from 'src/config/42oauth';
import { DataSource } from 'typeorm';
import { Bocal, BocalRole, ErrorObject } from './entity/bocal.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('authService');

  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  /**
   * 배포할때 수정필요함
   */
  async createJwt(obj) {
    // 아래 if문은 주석문은 배포할때 주석풀어주기
    // if (obj.isStaff != true)
    //   throw new BadRequestException('staff가 아니기때문에 로그인 허용 불가');
    const payload = obj;
    console.log(payload);
    const access_token = await this.jwtService.sign(payload, {
      secret: SECRETORKEY,
      expiresIn: '30m',
    });
    const refresh_token = await this.jwtService.sign(payload, {
      secret: SECRETORKEY,
      expiresIn: '7d',
    }); //이 리프레쉬토큰을 해쉬로 바꿔서 데이터베이스에 저장 //이 작업은 DB가 털렸을때를 생각해서 refresh token을 암호화하는거
    const bocal = this.dataSource.getRepository(Bocal).create();
    bocal.id = obj.id;
    bocal.intraName = obj.intraName;
    bocal.image_url = obj.image_url;
    bocal.email = obj.email;
    bocal.role = BocalRole.ADMIN; //이 부분 나중에 분기문으로 처리
    bocal.isStaff = true;
    bocal.currentHashedRefreshToken = refresh_token;
    console.log('save bocal ', bocal.intraName);
    await this.dataSource.getRepository(Bocal).save(bocal);
    return { access_token, refresh_token }; //42에 대한 토큰이 아니라 우리 백엔드 서버에 대한 토큰
  }

  async authentication(code) {
    const param = AUTHPARAM;
    param['code'] = code;
    let response42;
    let url = 'https://api.intra.42.fr/oauth/token?';
    // url에 query붙이기
    for (const key in param) {
      url += `${key}=`;
      url += `${param[key]}&`;
    }
    this.logger.debug(`url: ${url}`);
    try {
      response42 = await axios.post(url);
    } catch (what) {
      console.log('42 token reqest error', what);
      throw new BadRequestException();
    } finally {
      let cache = [];
      this.logger.debug(
        JSON.stringify(response42, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            // Duplicate reference found, discard key
            if (cache.includes(value)) return;

            // Store value in our collection
            cache.push(value);
          }
          return value;
        }),
      );
      cache = null;
      const {
        access_token,
        token_type,
        expires_in,
        refresh_token,
        scope,
        created_at,
      } = response42.data;
      this.logger.debug(`response 42 ${response42}`);
      try {
        response42 = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      } catch (e) {
        console.log('last axios error!!');
        throw new BadRequestException();
      }
    }
    this.logger.debug(`response 42 ${response42}`);

    // 아래에서 id는 고유 number임 ("huchoi"같은 intra_id가 아님)
    const payload = {
      id: response42.data.id,
      intraName: response42.data.login,
      email: response42.data.email,
      image_url: response42.data.image_url,
      isStaff: response42.data['staff?'],
    };
    this.logger.debug(`payload ${payload}`);
    return await this.createJwt(payload);
  }

  async logoutUser(user) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await this.dataSource
      .getRepository(Bocal)
      .update({ id: user.id }, { currentHashedRefreshToken: null });
    await queryRunner.commitTransaction(); //rollback 해버리는 실수
    await queryRunner.release();
  }

  async getError() {
    const ret = [];
    const errArr = await this.dataSource.getRepository(ErrorObject).find();
    if (errArr.length == 0) return null;
    for (const element of errArr) {
      ret.push(JSON.parse(element.error));
    }
    return ret;
  }
  async getUserIfRefreshTokenMatches(refresh_token, id) {
    const bocalRepository = this.dataSource.getRepository(Bocal);
    return bocalRepository.findOneBy({
      id,
      currentHashedRefreshToken: refresh_token,
    });
  }

  async renewalAccessTokenByRefreshToken(user) {
    const payload = { ...user };
    const access_token = await this.jwtService.sign(payload, {
      secret: SECRETORKEY,
      expiresIn: '10m',
    });
    return access_token;
  }
}
