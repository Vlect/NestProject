import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniGamesRepository } from './mini-games.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MiniGamesRepository])],
})
export class MiniGamesModule {}
