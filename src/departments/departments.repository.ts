import { EntityRepository, Repository } from 'typeorm';
import { Departments } from './department.entity';

@EntityRepository(Departments)
export class DepartmentsRepository extends Repository<Departments> {}
