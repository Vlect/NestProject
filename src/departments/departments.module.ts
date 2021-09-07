import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsRepository } from './departments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentsRepository])],
})
export class DepartmentsModule {}
