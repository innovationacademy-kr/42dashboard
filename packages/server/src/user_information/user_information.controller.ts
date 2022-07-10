import { Controller, Param, Get, Query } from '@nestjs/common';
import { takeLast } from 'rxjs';
import { UserInformationService } from './user_information.service';

@Controller('user-information')
export class UserInformationController {
  constructor(private readonly userService: UserInformationService) {}
  @Get()
  testUser() {
    return 'hello user!';
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
