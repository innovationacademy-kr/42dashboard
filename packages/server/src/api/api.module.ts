import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiResolver } from './api.resolver';
import { ApiService } from './api.service';
import { Api } from './entity/api.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Api])],
  controllers: [ApiController],
  providers: [ApiResolver, ApiService],
  //exports:[ApiService]
})
export class ApiModule {}
