import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiResolver } from './api.resolver';
import { ApiService } from './api.service';

@Module({
<<<<<<< HEAD
=======
  
>>>>>>> ce88e66 (fix(yarn    run start를 하면 npm에서는 보지못한 에러가 발생): yarn run error)
  controllers: [ApiController],
  providers: [ApiResolver, ApiService],
  //exports:[ApiService]
})
export class ApiModule {}
