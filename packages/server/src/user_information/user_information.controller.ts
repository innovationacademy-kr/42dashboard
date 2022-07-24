import { Controller, Param, Get, Query } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { takeLast } from 'rxjs';
import { DataSource } from 'typeorm';
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

  @Get('restrictTest')
  async restrictTest() {
    const userRepo = this.dataSource.getRepository(User);
    try {
      const result = await userRepo.softRemove({ intra_no: 68641 });
    } catch (e) {
      return 'bad';
    }
    return 'ok';
  }

  @Get('/temp')
  tempFunction(@Query() query) {
    // const keyArr = [];
    // const valueArr = [];
    // for (const key in query) {
    //   keyArr.push(key);
    //   valueArr.push(query[key]);
    // }
    // let tableCount = 1;
    // const obj = {};
    // let temp;
    // for (const v in keyArr) {
    //   temp = keyArr[v].split('__');
    //   console.log('temp[0]', temp[0]);
    //   if (temp[0] in obj) {
    //     obj[temp[0]][obj[temp[0]].length] = {
    //       column: temp[1],
    //       operator: temp[2],
    //       value: valueArr[v],
    //     };
    //   } else {
    //     tableCount++;
    //     obj[temp[0]] = [];
    //     obj[temp[0]][obj[temp[0]].length] = {
    //       column: temp[1],
    //       operator: temp[2],
    //       value: valueArr[v],
    //     };
    //   }
    // }
    // console.log('-------------------------');
    // console.log(tableCount);
    // console.log(obj);
    // console.log('-------------------------calling twoJoin');
    return this.userService.towJoin(0, 0);
  }
}
