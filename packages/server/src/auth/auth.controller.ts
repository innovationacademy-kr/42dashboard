import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { OAUTHURL } from 'src/config/42oauth';
import { AuthService } from './auth.service';
import { Bocal } from './entity/bocal.entity';

//authentication 과 authorization은 다름
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/42')
  async authenticationUser(@Res() res: Response) {
    return res.redirect(OAUTHURL);
  }

  /**
   *                     나중에 할 일
   * 아래에서 res.redirection(url)의 url을 프론트의 주소값으로 바꿔주자.
   * cookie를 받은 브라우저가 cookie를 저장,
   * 프론트엔드는 그 값을 읽어서 백엔드에 요청보낼때마다 Authorization헤더에 Bearer cookieValue를 삽입해서 요청
   * (jwtStrategy에서 jwtFromRequest도 ExtractJwt.fromAuthHeaderAsBearerToken()로 바꿔주자.)
   * (인증관련된 정보를 일반적으로 어느 header field에 넣어주는지 멘토님께 여쭤보기?)
   */
  @Get('/42/redirection')
  async redirect(@Query('code') code: string, @Res() res: Response) {
    // console.log(code);
    const access_token = await this.authService.authentication(code);
    res.cookie('access_token', `${access_token}`, {
      httpOnly: true,
      domain: 'dashboard42.com',
    }); //res.cookie()는 하나만 적용됨. 여러개 호출하면 제일 마지막에 호출된것만 적용됨(??)
    // res.setHeader('WWW-authenticate', `Bearer: realm="DashBoard"`);
    // res.redirect('http://localhost:3000/auth/test'); //redirection해도 됨. 나중에 front Home으로 redirection되게 할 예정.
    // res.redirect('10.18.246.245'); //for hybae
    res.send('login success!!');
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@Req() req, @Res() res: Response) {
    // guard를 무사히 통과하면 아래 메시지가 전송
    res.send('access_token 인가 완료!');
  }

  @Get('/userInfo')
  @ApiCreatedResponse({
    description: '로그인한 유저의 정보',
    type: Bocal,
  })
  @UseGuards(AuthGuard('jwt'))
  getUserInfo(@Req() req) {
    // console.log(req.user);
    return req.user;
  }
}
