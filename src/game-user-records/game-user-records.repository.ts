import { EntityRepository, Repository } from 'typeorm';
import { Game_user_records } from './game-user-record.entity';

@EntityRepository(Game_user_records)
export class GameUserRecordsRepository extends Repository<Game_user_records> {}
