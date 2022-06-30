import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UpdaterService } from './updater.service';
import { Updater } from './entities/updater.entity';
import { CreateUpdaterInput } from './dto/create-updater.input';
import { UpdateUpdaterInput } from './dto/update-updater.input';

@Resolver(() => Updater)
export class UpdaterResolver {
  constructor(private readonly updaterService: UpdaterService) {}
<<<<<<< HEAD
=======

>>>>>>> ce88e66 (fix(yarn    run start를 하면 npm에서는 보지못한 에러가 발생): yarn run error)
}
