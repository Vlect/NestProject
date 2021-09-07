import { Departments } from 'src/departments/department.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Towns {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Departments)
  @JoinColumn()
  department_id: number;

  @Column()
  zone_id: number;

  @Column()
  town_type_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
