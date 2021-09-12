import { EntityRepository, Repository } from 'typeorm';
import { Institutions } from './institution.entity';

@EntityRepository(Institutions)
export class InstiturionsRepository extends Repository<Institutions> {}
