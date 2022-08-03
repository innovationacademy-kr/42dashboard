import {
  Controller,
  Param,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Res,
  ConsoleLogger,
  Delete,
  Put,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { takeLast } from 'rxjs';
import { Bocal, BocalRole, PreSet } from 'src/auth/entity/bocal.entity';
import { DataSource, Equal, IsNull, Not } from 'typeorm';
// import { PreSet } from './entity/preset.entity';
import { User } from './entity/user_information.entity';
import { UserInformationService } from './user_information.service';

// class CreateCatDto {
//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   age: number;

//   @ApiProperty()
//   breed: string;
// }

@Controller('user-information')
export class UserInformationController {
  constructor(
    private readonly userService: UserInformationService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @Get()
  testUser() {
    return 'hello user!';
  }

  /**
   * body는 아래 구조라고 가정
   *  {
   *    "id": "231asdf-sda231",
   *    "data": {......}
   *  }
   */
  @Post('/addPreSet')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    required: true,
  })
  async addPreSet(@Req() req, @Body() body: JSON) {
    const bocalRepository = await this.dataSource.getRepository(Bocal);
    const preSetRepository = await this.dataSource.getRepository(PreSet);
    const user = req.user;
    const bocalEntity = await bocalRepository.findOne({
      where: { id: user.id },
    });
    const preSetData = body['data'];
    const info = body['info'];
    const preSetEntity = await preSetRepository.create();
    preSetEntity.id = body['id'];
    preSetEntity.preSetData = JSON.stringify(preSetData);
    preSetEntity.info = JSON.stringify(info);
    preSetEntity.bocal = bocalEntity;
    await preSetRepository.save(preSetEntity);
    return true;
  }

  // @Post('/overWritePreSet')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBody({
  //   required: true,
  // })
  // async overWritePreSet(@Req() req, @Body() body: JSON) {
  //   const bocalRepository = await this.dataSource.getRepository(Bocal);
  //   const preSetRepository = await this.dataSource.getRepository(PreSet);
  //   const user = req.user;
  //   const bocalEntity = await bocalRepository.findOne({
  //     relations: {
  //       preSetArray: true,
  //     },
  //     where: { id: user.id },
  //   });
  //   // 덮어쓰기를 위해 이미 존재하는거 다 지우기
  //   for (const index in bocalEntity['preSetArray']) {
  //     await preSetRepository.remove(bocalEntity['preSetArray'][index]);
  //   }
  //   for (const index in body['data']) {
  //     const onePreSet = body['data'][index];
  //     const preSetEntity = await preSetRepository.create();
  //     preSetEntity.id = onePreSet['uuid'];
  //     preSetEntity.preSetData = JSON.stringify(onePreSet);
  //     preSetEntity.bocal = bocalEntity;
  //     await preSetRepository.save(preSetEntity);
  //   }
  //   return true;
  // }

  @Get('/getAllPreSet')
  @UseGuards(AuthGuard('jwt'))
  async getAllPreSet(@Param('id') id, @Req() req) {
    const bocalRepository = await this.dataSource.getRepository(Bocal);
    console.log(req.user.id);
    const bocal = await bocalRepository.findOne({
      relations: { preSetArray: true },
      where: { id: req.user.id },
    });
    if (!bocal) return 'bocal not found!';
    const ret = [];
    for (const index in bocal['preSetArray']) {
      ret[index] = {};
      const onePreSet = bocal['preSetArray'][index];
      ret[index]['id'] = JSON.parse(onePreSet['id']);
      ret[index]['data'] = JSON.parse(onePreSet['preSetData']);
      ret[index]['info'] = JSON.parse(onePreSet['info']);
    }
    return ret;
  }

  @Get('/getOnePreSet/:uuid')
  @ApiParam({
    required: true,
    name: 'uuid',
  })
  @UseGuards(AuthGuard('jwt'))
  async getOnePreSet(@Param('uuid') uuid, @Req() req) {
    const bocalRepository = await this.dataSource.getRepository(Bocal);
    const bocal = await bocalRepository.findOne({
      relations: { preSetArray: true },
      where: { id: req.user.id, preSetArray: { id: uuid } },
    });
    if (!bocal) return 'entity not found!';
    const ret = [];
    // 배열에 요소 하나만 담김
    for (const index in bocal['preSetArray']) {
      ret[index] = {};
      const onePreSet = bocal['preSetArray'][index];
      ret[index]['id'] = JSON.parse(onePreSet['id']);
      ret[index]['data'] = JSON.parse(onePreSet['preSetData']);
      ret[index]['info'] = JSON.parse(onePreSet['info']);
    }
    return ret;
  }

  @Delete('/deleteOnePreSet/:uuid')
  @ApiParam({
    required: true,
    name: 'uuid',
  })
  @UseGuards(AuthGuard('jwt'))
  async deleteOnePreSet(@Param('uuid') uuid) {
    const preSetRepository = await this.dataSource.getRepository(PreSet);
    // 당연히 bocal에서도 삭제될것. (실제 DB에서 fk를 가진 튜플을 삭제한거니까)
    // 이 경우는 onDelete 옵션 안써도 되는거
    const preSet = await preSetRepository.delete({
      id: Equal(uuid),
    });
    if (preSet) return 'entity not found!';
    return 'delete success';
  }

  @Put('/updateOnePreSet/:uuid')
  @ApiParam({
    required: true,
    name: 'uuid',
  })
  @UseGuards(AuthGuard('jwt'))
  async updateOnePreSet(@Param('uuid') uuid, @Body() body) {
    const preSetRepository = await this.dataSource.getRepository(PreSet);
    const preSet = await preSetRepository.update(
      {
        id: Equal(uuid),
      },
      {
        preSetData: JSON.stringify(body['data']),
        info: JSON.stringify(body['info']),
      },
    );
    if (!preSet) return 'entity not found';
    return 'update success';
  }
}
