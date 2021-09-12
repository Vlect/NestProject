import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ database: 'talentumehs_valle_magico' })
export class Mini_games {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    id_code: string;

    @Column()
    location_id: number;

    @Column()
    grade_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}