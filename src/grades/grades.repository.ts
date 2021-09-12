import { EntityRepository, Repository } from 'typeorm';
import { Grades } from './grade.entity';

@EntityRepository(Grades)
export class GradesRepository extends Repository<Grades> {}
