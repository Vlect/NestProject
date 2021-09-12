import { EntityRepository, Repository } from 'typeorm';
import { Mini_games } from './mini-game.entity';
@EntityRepository(Mini_games)
export class MiniGamesRepository extends Repository<Mini_games> {}
