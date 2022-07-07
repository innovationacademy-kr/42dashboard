import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UpdaterService } from './updater.service';
import { Updater } from './entities/updater.entity';
import { CreateUpdaterInput } from './dto/create-updater.input';
import { UpdateUpdaterInput } from './dto/update-updater.input';

@Resolver(() => Updater)
export class UpdaterResolver {
  constructor(private readonly updaterService: UpdaterService) {}

  @Query(() => String)
  updateDataPerDay() {
    return this.updaterService.updateDataPerDay();
  }

  @Query(() => String)
  getOldData() {
    return this.updaterService.getOldData();
  }
}
