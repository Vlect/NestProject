import { EntityRepository, Repository } from 'typeorm';
import { Subjects } from './subject.entity';

@EntityRepository(Subjects)
export class SubjectsRepository extends Repository<Subjects> {}
