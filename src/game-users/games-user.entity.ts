import { Grades } from 'src/grades/grade.entity';
import { Headquarters } from 'src/headquarters/headquarter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'talentumehs_valle_magico' })
export class Game_Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  second_name: string;

  @Column()
  first_surname: string;

  @Column()
  second_surname: string;

  @Column()
  username: string;

  @Column()
  headquarter_id: number;

  // @OneToOne(() => Headquarters)
  // @JoinColumn({ name: 'headquarter_id' })
  // headquarter: Headquarters;

  @Column()
  grade_id: number;

  map_skin_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
