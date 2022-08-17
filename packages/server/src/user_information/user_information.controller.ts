import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { PreSet } from 'src/auth/entity/bocal.entity';
import { DataSource, Equal, FindManyOptions } from 'typeorm';
import { User } from './entity/user_information.entity';
import { UserInformationService } from './user_information.service';

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

  @Get('/out2')
  async testOut2() {
    const findObj: FindManyOptions<User> = {
      relations: {
        userPersonalInformation: true,
        userCourseExtension: true,
        userLeaveOfAbsence: true,
        userBlackhole: true,
        userInterruptionOfCourse: true,
        // userLearningDataAPI: true,
        userLoyaltyManagement: true,
        userEmploymentStatus: true,
        userHrdNetUtilizeConsent: true,
        // userHrdNetUtilize: true,
        userOtherEmploymentStatus: true,
        userComputationFund: true,
        userAccessCardInformation: true,
        userOtherInformation: true,
        userLapiscineInformation: true,
      },
      where: {
        // start_process_date: LessThan(new Date('9999-12-31')),
      },
      select: { intra_no: true, userLearningDataAPI: false },
      // loadRelationIds: true,
      take: 500,
      // cache: true,
    };
    const userRepository = await this.dataSource.getRepository(User);
    const result = await userRepository.find(findObj);
    return result;
  }

  /**
   * body는 아래 구조라고 가정
   *  {
   *    "id": "something",
   *    "data": {...},
   *    "info": {...},
   *  }
   */
  @Post('/addPreSet')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    required: true,
  })
  async addPreSet(@Body() body: JSON) {
    const preSetRepository = this.dataSource.getRepository(PreSet);
    const preSetEntity = preSetRepository.create();
    preSetEntity.id = body['id'];
    preSetEntity.preSetData = JSON.stringify(body['data']);
    preSetEntity.info = JSON.stringify(body['info']);
    const savedEntity = await preSetRepository.save(preSetEntity);
    if (!savedEntity) throw new BadRequestException('DB에 프리셋 저장 실패');
    return true;
  }

  @Get('/getAllPreSet')
  @UseGuards(AuthGuard('jwt'))
  async getAllPreSet() {
    const preSetArray = await this.dataSource.getRepository(PreSet).find();
    const ret = [];
    for (const index in preSetArray) {
      const onePreSet = preSetArray[index];
      ret[index] = {};
      ret[index]['id'] = onePreSet['id'];
      ret[index]['data'] = JSON.parse(onePreSet['preSetData']);
      ret[index]['info'] = JSON.parse(onePreSet['info']);
    }
    return ret;
  }

  @Get('/getOnePreSet/:uuid')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    required: true,
    name: 'uuid',
  })
  async getOnePreSet(@Param('uuid') uuid) {
    const preSetRepository = await this.dataSource.getRepository(PreSet);
    const preSet = await preSetRepository.find({
      where: { id: uuid },
    });
    if (!preSet || preSet.length == 0)
      throw new BadRequestException('preset not found!');
    const ret = [];
    // 배열에 요소 딱 하나만 담기기는 하는데... 일관성을 위해 배열로 응답
    for (const index in preSet) {
      const onePreSet = preSet[index];
      ret[index] = {};
      ret[index]['id'] = onePreSet['id'];
      ret[index]['data'] = JSON.parse(onePreSet['preSetData']);
      ret[index]['info'] = JSON.parse(onePreSet['info']);
    }
    return ret;
  }

  @Delete('/deleteOnePreSet/:uuid')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    required: true,
    name: 'uuid',
  })
  async deleteOnePreSet(@Param('uuid') uuid) {
    const preSetRepository = await this.dataSource.getRepository(PreSet);
    const preSet = await preSetRepository.delete({
      id: uuid,
    });
    if (!preSet) throw new BadRequestException('entity not found!');
    return 'delete success';
  }

  @Put('/updateOnePreSet/:uuid')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    required: true,
  })
  async updateOnePreSet(@Body() body) {
    const uuid = body['id'];
    const preSetRepository = await this.dataSource.getRepository(PreSet);
    if (!(await preSetRepository.findOne({ where: { id: Equal(uuid) } })))
      throw new BadRequestException('entity not found');
    const preSet = await preSetRepository.update(
      {
        id: uuid,
      },
      {
        preSetData: JSON.stringify(body['data']),
        info: JSON.stringify(body['info']),
      },
    );
    return 'update success';
  }
}
