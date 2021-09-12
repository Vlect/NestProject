import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesRepository } from './grades.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GradesRepository])],
})
export class GradesModule {}
