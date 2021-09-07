import { Controller, Get, Param } from '@nestjs/common';
// import { Department } from 'src/departments/department.entity';
import { DashBoardService } from './dashboard.service';

@Controller('dashboard')
export class DashBoardController {
  constructor(private dashBoardService: DashBoardService) {}

  @Get('/:id')
  async getDepartmentById(@Param('id') id: string) {
    return this.dashBoardService.getDepartmentById(id);
  }
}
