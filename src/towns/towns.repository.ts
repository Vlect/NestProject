import { EntityRepository, Repository } from 'typeorm';
import { Towns } from './town.entity';

@EntityRepository(Towns)
export class TownsRepository extends Repository<Towns> {}
