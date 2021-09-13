import { Controller, Get, Param } from '@nestjs/common';
// import { Department } from 'src/departments/department.entity';
import { DashBoardService } from './dashboard.service';

@Controller('dashboard')
export class DashBoardController {
  constructor(private dashBoardService: DashBoardService) {}

  @Get('get-data/department/:id')
  async getDashboardDataByDepartment(@Param('id') id: string) {
    return this.dashBoardService.getDashboardDataByDepartment(id);
  }

  @Get('get-data/institution/:id')
  async getDashboardDataByInstitution(@Param('id') id: string) {
    return this.dashBoardService.getDashboardDataByInstitution(id);
  }

  @Get('get-data/headquarter/:id')
  async getDashboardDataByHeadquarter(@Param('id') id: string) {
    return this.dashBoardService.getDashboardDataByHeadquarter(id);
  }

  @Get('get-data/town/:id')
  async getDashboardDataByTown(@Param('id') id: string) {
    return this.dashBoardService.getDashboardDataByTown(id);
  }
}
