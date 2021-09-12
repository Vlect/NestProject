import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUserRecordsRepository } from './game-user-records.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameUserRecordsRepository])],
})
export class GameUserRecordsModule {}
