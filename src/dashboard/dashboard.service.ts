import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departments } from 'src/departments/department.entity';
import { DepartmentsRepository } from 'src/departments/departments.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class DashBoardService {
  constructor(
    @InjectRepository(DepartmentsRepository)
    private departmentRepository: DepartmentsRepository,
  ) {}
  async getDepartmentById(id: string) {
    const found = await getConnection()
      .createQueryBuilder()
      .select('DP')
      .from(Departments, 'DP')
      .where('DP.id = :id', { id })
      .getOne();
    console.log(found);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return found;
  }
}
