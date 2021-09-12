import { Institutions } from 'src/institutions/institution.entity';
import { Towns } from 'src/towns/town.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Headquarters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  town_id: number;

  @ManyToOne(() => Towns, (town) => town.headquarter)
  @JoinColumn({ name: 'town_id'})
  town: Towns;

  @Column()
  institution_id: number;
  
  @ManyToOne(() => Institutions, (institution) => institution.headquarters)
  @JoinColumn({ name: 'institution_id'})
  institution: Institutions;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
