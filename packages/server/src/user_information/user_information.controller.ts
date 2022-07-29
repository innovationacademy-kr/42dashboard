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
}
