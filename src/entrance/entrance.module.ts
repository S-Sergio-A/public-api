import { Module } from '@nestjs/common';
import { EntranceController } from './entrance.controller';

@Module({
  controllers: [EntranceController]
})
export class EntranceModule {}
