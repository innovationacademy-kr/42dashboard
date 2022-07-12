import { Controller, Get } from '@nestjs/common';
import { UpdaterService } from './updater.service';

@Controller('update')
export class UpdaterController {
  constructor(private updaterService: UpdaterService) {}

  @Get()
  getAllSpread() {
    return this.updaterService.getAllSpread();
  }
}
