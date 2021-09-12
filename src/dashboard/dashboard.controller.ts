import { Controller, Get, Param } from '@nestjs/common';
// import { Department } from 'src/departments/department.entity';
import { DashBoardService } from './dashboard.service';

@Controller('dashboard')
export class DashBoardController {
  constructor(private dashBoardService: DashBoardService) {}

  @Get('/:id')
  async getDashboardDataByDepartment(@Param('id') id: string) {
    return this.dashBoardService.getDashboardDataByDepartment(id);
  }

  @Get('/v2/:id')
  async getDashboardDataByDepartmentV2(@Param('id') id: string) {
    return this.dashBoardService.getDashboardDataByDepartmentV2(id);
  }
}
