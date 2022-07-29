import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UpdaterService } from './updater.service';
import { Updater } from './entities/updater.entity';
import { CreateUpdaterInput } from './dto/create-updater.input';
import { UpdateUpdaterInput } from './dto/update-updater.input';
import { UpdateDB } from 'src/user_information/argstype/updateSheet.argstype';

@Resolver(() => Updater)
export class UpdaterResolver {
  constructor(private readonly updaterService: UpdaterService) {}

  @Query(() => String)
  updateData() {
    return this.updaterService.updateData();
  }

  @Query(() => String)
  updateOldData() {
    return this.updaterService.updateOldData();
  }

  @Query(() => String)
  extractDataIntoSpreadsheet() {
    return this.updaterService.extractDataIntoSpreadsheet();
  }

  @Query(() => String)
  getDataToModifyFromDB(@Args() updateDB: UpdateDB) {
    return this.updaterService.getDataToModifyFromDB(updateDB);
  }

  @Query(() => String)
  saveModifiedDataFromSheet(@Args() updateDB: UpdateDB) {
    return this.updaterService.saveModifiedDataFromSheet(updateDB);
  }

  @Query(() => String)
  getLatestData() {
    return this.updaterService.getLatestData();
  }
}
