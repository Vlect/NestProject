import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departments } from 'src/departments/department.entity';
import { DepartmentsRepository } from 'src/departments/departments.repository';
import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentsRepository, Departments])],
  controllers: [DashBoardController],
  providers: [DashBoardService],
})
export class DashboardModule {}
