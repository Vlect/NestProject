import { EntityRepository, Repository } from "typeorm";
import { Headquarters } from "./headquarter.entity";

@EntityRepository(Headquarters)
export class HeadquartersRepository extends Repository<Headquarters> {}