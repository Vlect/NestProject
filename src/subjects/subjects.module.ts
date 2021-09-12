import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsRepository } from './subjects.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectsRepository])],
})
export class SubjectsModule {}
