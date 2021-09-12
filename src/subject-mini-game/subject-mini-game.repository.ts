import { EntityRepository, Repository } from "typeorm";
import { Subject_mini_game } from "./subject-mini-game.entity";

@EntityRepository(Subject_mini_game)
export class SubjectMiniGameRepository extends Repository<Subject_mini_game> {}
