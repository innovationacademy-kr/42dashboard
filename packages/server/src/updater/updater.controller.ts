import { Controller, Get } from '@nestjs/common';
import { UpdaterService } from './updater.service';

@Controller('update')
export class UpdaterController {
  constructor(private updaterService: UpdaterService) {}

  @Get('/data')
  updateData() {
    return this.updaterService.updateData();
  }

  @Get('/oldData')
  updateOldData() {
    return this.updaterService.updateOldData();
  }

  @Get('/latest')
  getLatestData() {
    return this.updaterService.getLatestAllOneData();
  }
}
