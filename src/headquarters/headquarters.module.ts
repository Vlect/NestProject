import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Headquarters } from './headquarter.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Headquarters])],
})
export class HeadquartersModule {}
