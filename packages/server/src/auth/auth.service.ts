import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { hash, compare } from 'bcrypt';
import { jsonToFile } from 'src/utils/json-helper/jsonHelper';
import { DataSource } from 'typeorm';
import { Bocal, BocalRole, ErrorObject } from './entity/bocal.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('authService');

  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 배포할때 수정필요함
   */
  async createJwt(obj) {
    await this.validateBocal(obj);
    // [수정 사항] payload는 id만 가지고 있음
    const payload = { id: obj.id };
    const access_token = await this.getCookieWithJwtAccessToken(payload);
    const refresh_token = await this.getCookieWithJwtRefreshToken(payload);
    await this.createBocal(obj, refresh_token);
    this.logger.debug('toekn created');
    await this.setCurrentRefreshToken(refresh_token, payload);
    return { access_token, refresh_token }; //42에 대한 토큰이 아니라, 우리 백엔드 서버에 대한 토큰
  }

  async authentication(code) {
    const param = {
      grant_type: this.configService.get('grant_type'),
      client_id: this.configService.get('42oauth_client_id'),
      client_secret: this.configService.get('42oauth_client_secret'),
      redirect_uri: this.configService.get('42oauth_redirect_uri'),
      state: this.configService.get('state'),
      code,
    };
    let response42;
    let url = 'https://api.intra.42.fr/oauth/token?';
    // url에 query붙이기
    for (const key in param) {
      url += `${key}=`;
      url += `${param[key]}&`;
    }
    try {
      response42 = await axios.post(url);
    } catch (what) {
      this.logger.error('42 token reqest error', what);
      throw new BadRequestException();
    } finally {
      const { access_token } = response42.data;
      response42 = await this.getUserMe(access_token);
    }
    const payload = {
      id: response42.data.id,
      intraName: response42.data.login,
      email: response42.data.email,
      image_url: response42.data.image.link,
      isStaff: response42.data['staff?'],
      campusId: response42.data['campus'][0]['id'],
    };
    this.logger.debug('42 OAuth success');
    return await this.createJwt(payload);
  }

  async logoutUser(user) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await this.dataSource.getRepository(Bocal).update({ id: user.id }, { currentHashedRefreshToken: null });
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

  // [수정 사항] refresh_token hash 검증
  async getUserIfRefreshTokenMatches(refresh_token, id) {
    const bocalRepository = this.dataSource.getRepository(Bocal);
    const bocal = await bocalRepository.findOneBy({ id });
    const isRefreshTokenMatching = await compare(
      refresh_token,
      bocal.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return bocal;
    }
  }

  // [수정 사항] payload는 id만 가지고 있음
  async renewalAccessTokenByRefreshToken(user) {
    // const payload = { ...user };
    const payload = { id: user.id };
    const access_token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRETORKEY'),
      expiresIn: '10m',
    });
    return access_token;
  }
  async getUserMe(access_token: string) {
    let response42: AxiosResponse<any, any>;
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
    return response42;
  }

  async validateBocal(payload: any) {
    const whiteList = [
      'kilee',
      'sonkang',
      'hybae',
      'jinbekim',
      'doyun',
      'huchoi',
      'junghan',
      'dcho',
    ];
    //스태프 또는 플젝인원들만 로그인 가능
    if (payload.isStaff != true && !whiteList.includes(payload.intraName))
      throw new BadRequestException('staff가 아니기때문에 로그인 허용 불가');
    //42 Seoul 사람만 로그인 가능 (42 Seoul의 campusId는 29번)
    if (payload['campusId'] != 29)
      throw new BadRequestException(
        'campusId가 부적절하기때문에 로그인 허용 불가',
      );
  }

  // [수정 사항] 유저 정보 가져오기 함수 추가
  async getUserInfo(user) {
    const bocalRepository = this.dataSource.getRepository(Bocal);
    const bocal = await bocalRepository.findOneBy({ id: user.id });
    if (!bocal) throw new BadRequestException();
    const res = {
      id: bocal.id,
      intraName: bocal.intraName,
      email: bocal.email,
      image_url: bocal.image_url,
      isStaff: bocal.isStaff,
    };
    return res;
  }

  // [수정 사항] bocal 생성 함수 추가
  async createBocal(obj, refresh_token) {
    const bocal = this.dataSource.getRepository(Bocal).create();
    bocal.id = obj.id;
    bocal.intraName = obj.intraName;
    bocal.image_url = obj.image_url;
    bocal.email = obj.email;
    bocal.role = BocalRole.ADMIN; //이 부분 나중에 분기문으로 처리
    bocal.isStaff = true;
    // bocal.currentHashedRefreshToken = null;
    await this.dataSource.getRepository(Bocal).save(bocal);
  }

  // [수정 사항] access_token, refresh_token 생성 함수 추가
  async getCookieWithJwtAccessToken(payload) {
    const access_token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRETORKEY'),
      expiresIn: '30m',
    });
    return access_token;
  }

  async getCookieWithJwtRefreshToken(payload) {
    const refresh_token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    return refresh_token;
  }

  // [수정 사항] refresh_token hash 저장 함수 추가
  async setCurrentRefreshToken(refresh_token, payload) {
    const currentHashedRefreshToken = await hash(refresh_token, 10);
    await this.dataSource.getRepository(Bocal).update( { id: payload.id }, { currentHashedRefreshToken });
  }
}
