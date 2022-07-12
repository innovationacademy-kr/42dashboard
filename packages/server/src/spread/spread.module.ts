import { Module } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { Updater } from 'src/updater/entities/updater.entity';
import { UpdaterService } from 'src/updater/updater.service';
import { SpreadController } from './spread.controller';
import { SpreadResolver } from './spread.resolver';
import { SpreadService } from './spread.service';

@Module({
  controllers: [SpreadController],
  providers: [SpreadResolver, SpreadService, ApiService],
})
export class SpreadModule {}
