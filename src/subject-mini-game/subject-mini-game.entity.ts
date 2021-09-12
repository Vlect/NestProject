import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ database: 'talentumehs_valle_magico' })
export class Subject_mini_game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject_id: number;

    @Column()
    mini_game_id: number;

    @Column()
    dba: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}