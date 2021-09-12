import { EntityRepository, Repository } from 'typeorm';
import { Game_Users } from './games-user.entity';

@EntityRepository(Game_Users)
export class GameUsersRepository extends Repository<Game_Users> {}
