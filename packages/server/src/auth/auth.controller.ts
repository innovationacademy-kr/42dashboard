import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { Bocal } from './entity/bocal.entity';
import { ConfigService } from '@nestjs/config';
import { GqlAuthGuard } from './guard/gql.guard';

//authentication 과 authorization은 다름
@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger('auth');
  constructor(
    private authService: AuthService,
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async helloAuth() {
    return process.env.database;
  }
  @Get('/42')
  async authenticationUser(@Res() res: Response) {
    this.logger.debug('get /42');
    return res.redirect(this.configService.get('OAUTHURL'));
  }

  /**
   *                      나중에 할 일
   * 아래에서 res.redirection(url)의 url을 프론트의 주소값으로 바꿔주자.
   * cookie를 받은 브라우저가 cookie를 저장,
   * 프론트엔드는 그 값을 읽어서 백엔드에 요청보낼때마다 Authorization헤더에 Bearer cookieValue를 삽입해서 요청
   * (jwtStrategy에서 jwtFromRequest도 ExtractJwt.fromAuthHeaderAsBearerToken()로 바꿔주자.)
   * (인증관련된 정보를 일반적으로 어느 header field에 넣어주는지 멘토님께 여쭤보기?)
   */
  @Get('/42/redirection')
  async redirect(@Query('code') code: string, @Res() res: Response) {
    const { access_token, refresh_token } =
      await this.authService.authentication(code);
    res.cookie('refresh_token', `${refresh_token}`, {
      httpOnly: true,
      domain: this.configService.get('BACKEND_APP_DOMAIN'),
    });
    res.cookie('access_token', `${access_token}`, {
      httpOnly: true,
      domain: this.configService.get('BACKEND_APP_DOMAIN'),
    });
    res.redirect(this.configService.get('frontEndURI')); //for hybae
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) //정반합?
  async logout(@Req() req: any, @Res() res: Response) {
    await this.authService.logoutUser(req.user);
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    res.send();
  }

  @Get('renewalAccessTokenByRefreshToken')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  async renewalAccessTokenByRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const access_token =
      await this.authService.renewalAccessTokenByRefreshToken(req.user);
    res.cookie('access_token', `${access_token}`, {
      httpOnly: true,
      domain: this.configService.get('BACKEND_APP_DOMAIN'),
    });
    res.send();
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@Res() res: Response) {
    // guard를 무사히 통과하면 아래 메시지가 전송
    res.send('access_token 인가 완료!');
  }

  @Get('/userInfo')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    description: '로그인한 유저의 정보',
    type: Bocal,
  })
  // [수정사항] 프론트에서 payload에 맞게 데이터를 받아오면 수정할것.
  async getUserInfo(@Req() req) {
    return await this.authService.getUserInfo(req.user);
  }

  @Get('/getError')
  @UseGuards(AuthGuard('jwt')) //배포때 이 주석 해제해야함
  @ApiCreatedResponse({
    description: '에러점검',
    type: Bocal,
  })
  async getError(@Req() req, @Res() res: Response) {
    const data = await this.authService.getError();
    if (!data) res.status(200);
    else res.status(400);
    res.send({ data });
  }
}
