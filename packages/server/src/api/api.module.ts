import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiResolver } from './api.resolver';
import { ApiService } from './api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiResolver, ApiService],
  //exports:[ApiService]
})
export class ApiModule {}
