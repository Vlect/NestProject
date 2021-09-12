import { Game_Users } from 'src/game-users/games-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'talentumehs_valle_magico' })
export class Game_user_records {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  errors: number;

  @Column()
  repeated_guide: number;

  @Column()
  total_score: number;

  @Column()
  mini_game_id: number;

  @Column()
  game_user_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
