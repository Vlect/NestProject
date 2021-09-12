import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownsRepository } from './towns.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TownsRepository])],
})
export class TownsModule {}
