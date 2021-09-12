import { Departments } from 'src/departments/department.entity';
import { Headquarters } from 'src/headquarters/headquarter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Towns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  department_id: number;

  @Column()
  zone_id: number;

  @Column()
  town_type_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Headquarters, headquarter => headquarter.town)
  headquarter: Headquarters[];
}
