import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Departments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cod_dane: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
